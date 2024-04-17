/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChapterPopUp.css";
import MyContext from "../../../Provider/MyContext";
import { useTranslation } from "react-i18next";

function ChapterPopUp({ show, onClose, onConfirm, onDelete, chapterTitle, setTitle, title }) {
  const [error, setError] = useState(null);
  const { clickedScene, setBlockProcess } = useContext(MyContext);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();
  const [titlesList, setTitlesList] = useState([]);
  const [lastThreeTitles, setLastThreeTitles] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;
   
  }, []);
  useEffect(() => {
    setLastThreeTitles(titlesList.slice(-3));
  }, [titlesList]);

  const handleMouseDown = (e) => {
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });

      const modal = document.getElementById("chapterModal");
      modal.style.left = modal.offsetLeft + deltaX + "px";
      modal.style.top = modal.offsetTop + deltaY + "px";
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleSelect = (selectedTitle) => {
    setTitle(selectedTitle);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError(t('insertTitle'));
      return;
    }
    try {
      setBlockProcess(true);
      onClose();
      onConfirm();
      chapterTitle(title);

      if (!titlesList.includes(title)) {
        setTitlesList((prevTitles) => [...prevTitles, title]);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleClose = () => {
    try {
      onDelete();
      onClose();
    } catch (error) {
      setError(error);
    }
  };

  const handleTextAreaClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  

  return (
    <div className={`${show ? "backdrop-chapter " : ""}  ${isArabic ? 'rtl' : 'ltr'} `}>
      <div
        id="chapterModal"
        className={`modal ${show ? "show" : ""} `}
        tabIndex="1"
        role="dialog"
        aria-hidden={!show}
        style={{ display: show ? "block" : "none" }}
        onMouseMove={handleMouseMove}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onMouseDown={handleMouseDown}
        >
          <div className="modal-content popUpContent">
            <div className="modal-body">
              <form>
                  <div className="chapter-title-container">
                    <h3 className="chapter-title">
                      {clickedScene?.sceneTitle}
                    </h3>
                  </div>
                  <div
                    className={`element-chapter-popUp form-group ${
                      error && !title ? "has-danger" : ""
                    }`}
                  >
                    <label
                      htmlFor="sceneType"
                      className="control-label element-label-chapter"
                    >
                      {t('chapterName')}
                    </label>
                    <div>
                      <input
                        type="text"
                        id="sceneName"
                        className={`form-control chapter-input ${
                          error && !title ? "is-invalid" : ""
                        }`}
                        value={title}
                        onChange={handleTitleChange}
                        onClick={handleTextAreaClick}
                        required
                        autoComplete="off"
                      />
                      {error && !title && (
                        <div className="help-block" style={{ color: "white" }}>
                          {error}
                        </div>
                      )}  </div>
                      </div>

                      { lastThreeTitles.length > 1 && (
                         <div className="element-chapter-popUp">
                         <label
                           htmlFor="sceneType"
                           className="control-label element-label-chapter-option"
                         >
                           {t('latestChapters')}
                         </label>
                        <select
                          className="chapter-input form-control"
                          onChange={(e) => handleTitleSelect(e.target.value)}
                        >
                          {lastThreeTitles.map((t, index) => (
                            <option key={index} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                          
                        </div>
                      )}
                  <div className="buttons-container" style={{}}>
                    <a
                      onClick={handleSubmit}
                      className="buttons-chapter button1"
                    >
                      {t('ok')}
                    </a>
                    <a onClick={handleClose} className="buttons-chapter">
                      {t('cancel')}
                    </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterPopUp;