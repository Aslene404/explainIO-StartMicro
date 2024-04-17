import React, { useState, useContext,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewScenePopUp.css';
import MyContext from '../../../Provider/MyContext';
import { useTranslation } from "react-i18next";

function PdfPopUp({ show, onClose, sideBarItem, existingSceneTitles, setTitle ,clickedScene}) {
  const { clickedType } = useContext(MyContext); 
  const { t } = useTranslation();
  const [sceneData, setSceneData] = useState({
    sceneTitle: clickedScene ? clickedScene.sceneTitle : '',
    sceneLocation:  clickedScene ? clickedScene.sceneLocation : "Büro",
  });
  const [error, setError] = useState(null);
  const [errorName, setErrorName] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;
   
  }, []);


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

      const modal = document.getElementById('pdfModal');
      modal.style.left = modal.offsetLeft + deltaX + 'px';
      modal.style.top = modal.offsetTop + deltaY + 'px';
    }
  };

  const handleSceneTitleChange = (e) => {
    const inputValue = e.target.value;
    setSceneData({
      ...sceneData,
      sceneTitle: inputValue,
    });
  };

  const handleSceneLocationChange = (e) => {
    setSceneData({
      ...sceneData,
      sceneLocation: e.target.value,
     
    }); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!sceneData.sceneTitle) {
      setError(t('fillInputMessage'));
      return;
    }
    const existsInTitles = existingSceneTitles.some(title =>
      {    if (typeof title === 'string') {
        return title.toLowerCase() === sceneData.sceneTitle.toLowerCase();
      }
      return false
      }
    );
    
    
    if ((!clickedScene || sceneData.sceneTitle !== clickedScene.sceneTitle ) &&  existsInTitles) {
      setErrorName(t('sceneTitleExists'));
      return;
    }

    try {
      sideBarItem(sceneData);
      setTitle("");
      onClose();
    } catch (error) {
      setError('An error occurred while saving the scene');
    }
  };

  return (
    <div className={` ${isArabic ? 'rtl' : 'ltr'}`}>
      <div
        id="pdfModal"
        className={`modal ${show ? 'show' : ''}`}
        tabIndex="1"
        role="dialog"
        aria-hidden={!show}
        style={{ display: show ? 'block' : 'none' }}
        onMouseMove={handleMouseMove}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onMouseDown={handleMouseDown}
        >
          <div className="modal-content popUpContent">
            <div className="modal-body">
              <form>
                <div
                  className={`element form-group ${
                    (error && !sceneData.sceneTitle) || errorName
                      ? 'has-danger'
                      : ''
                  }`}
                >
                  <label
                    htmlFor="sceneType"
                    className="control-label element-label"
                  >
                    {t('sceneName')}
                  </label>
                  <div className='newscene-name-item'>
                    <input
                      type="text"
                      id="sceneName"
                      className={`form-control  element-input
                      ${(error && !sceneData.sceneTitle) || errorName
                        ? 'is-invalid'
                        : ''}`}
                      value={sceneData.sceneTitle}
                      onChange={handleSceneTitleChange}
                      required
                      autoComplete="off" 
                    />
                    {((error && !sceneData.sceneTitle) || errorName) && (
                      <div className="help-block" >
                        {error}
                      </div>
                    )}
                    {errorName && (
                      <div className="help-block" >
                        {errorName}
                      </div>
                    )}
                  </div>
                </div>
                {(clickedType !== 'podcast' && clickedType !== 'textReader') && (
                  <div className="element">
                    <label
                      htmlFor="sceneType"
                      className="control-label element-label"
                    >
                      {t('sceneLocation')}
                    </label>
                    <select
                      id="sceneType"
                      value={sceneData.sceneLocation}
                      onChange={handleSceneLocationChange}
                      className="element-input form-control"
                    >
                      <option value="Büro">{t('office')}</option>
                      <option value="ClassrKlassenzimmeroom">
                      {t('classroom')}
                      </option>
                      <option value="Garten">{t('garden')}</option>
                      <option value="Modernes Büro">{t('modernOffice')}</option>

                    </select>
                  </div>
                )}

                <div className="buttons-container">
                  <button onClick={handleSave} className="buttons button1 " style={{border:"none"}}>
                    {t('ok')}
                  </button>
                  <button onClick={onClose} className="buttons "  style={{border:"none"}}>
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfPopUp;
