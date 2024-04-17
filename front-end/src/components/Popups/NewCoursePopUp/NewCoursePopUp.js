import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./NewCoursePopUp.css";
function NewCoursePopUp({ show, onClose, onConfirm }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error,setError] = useState(null);
  const [title, setTitle] = useState("");
  const [freigeben, setFreigeben] = useState(false);
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;
   
  }, []);


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFreigebenChange = () => {
    setFreigeben(!freigeben);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title) {
        setError(t('insertTitle'));
        return;
      }
      await onConfirm({
        title,
        freigeben,
      });
      navigate("/home");
      onClose();
    } catch (error) {
    }
  };

  const handleClose = () => {
    try {
      onClose();
    } catch (error) {}
  };

  return (
    <div className={` ${isArabic ? 'rtl' : 'ltr'}`}>
      <div
        className={`modal ${show ? "show" : ""}`}
        tabIndex="1"
        role="dialog"
        aria-hidden={!show}
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content popUpContent px-3 new-chapter-popup"
          >
            <div className="modal-body">
              <form>
                <div className="course-container" >
                  <div className="chapter-title-container">
                    <h3 className="chapter-title">{t('save')}</h3>
                  </div>
                  <div
                    className={`course-element element form-group ${
                      error && !title ? "has-danger" : ""
                    }`}
                  >
                    <label
                      htmlFor="sceneType"
                      className="control-label element-label"
                    >
                     { t('courseName')}{" "}
                    </label>
                    <div>
                      <input 
                        required
                        type="text"
                        id="sceneName"
                        className={` form-control e-input  ${
                          error && !title ? "is-invalid" : ""
                        }  ${isArabic ? 'new-course-input-rtl' : 'new-course-input'}` }
                        value={title}
                        onChange={handleTitleChange}
                        autoComplete="off" 
                        
                      />
                      {error && !title && (
                        <div className="help-block">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`element form-group course-element`}
                  >
                    <label
                      htmlFor="freigeben"
                      className="checkbox-container control-label element-label"
                    >
                      {t("release")}
                      <input
                        type="checkbox"
                        id="freigeben"
                        className="form-check-input course-check-input"
                        checked={freigeben}
                        onChange={handleFreigebenChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <div></div>
                  </div>
                  <div className="buttons-container course-buttons-container" >
                    <button 
                      onClick={handleSubmit}
                      className="buttons-chapter button1" style={{border:"none"}}
                    >
                       {t('ok')}
                    </button>
                    <button  onClick={handleClose} className="buttons-chapter" style={{border:"none"}}>
                    {t('cancel')}
                    </button>
                    
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCoursePopUp;
