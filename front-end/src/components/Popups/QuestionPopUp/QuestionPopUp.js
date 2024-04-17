import React, { useState, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuestionPopUp.css";
import MyContext from "../../../Provider/MyContext";
import { useTranslation } from "react-i18next";
import info from "../../../assets/Info.png";


import {
   fetchQuestions
} from '../../TopBar/apiRequests';

function QuestionPopUp({ show, onClose, GetInfo }) {
  const {
    clickedType,
    setIsQuestionCanceled,
    setVisitedSections,
    chapters,
    setLoading,
    loading,
    setTimeOut,
    textLanguage,
    setBlockProcess,setFragen,setCurrentFrage,setFragenGeneration, setFragenUpdatedAfterSelection,fragen
     } = useContext(MyContext);
     const items = clickedType==="textReader"? ["Skript", "Charakter"]:["Skript", "Dialog", "Fragen", "Charakter"];

  const [questionsData, setQuestionsData] = useState({
    sc_count: 0,
    mc_count: 0,
    wf_count:0
  });
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;
   
  }, []);

  const handleScQuestionsNumberChange = (e) => {
    const inputValue = parseInt(e.target.value, 10);
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 10 && (inputValue+questionsData.mc_count+questionsData.wf_count <=15)) {
      setQuestionsData({
        ...questionsData,
        sc_count: inputValue,
      });
    }
  };


  useEffect(()=>{
     if(loading)
     {console.log(" laoding is true");
    
    }
    else{
      console.log("loading is false")
    }
  },[loading])
  
  const handleMcQuestionsNumberChange = (e) => {
    const inputValue = parseInt(e.target.value, 10);
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 10&& (questionsData.sc_count+inputValue+questionsData.wf_count <=15)) {
      setQuestionsData({
        ...questionsData,
        mc_count: inputValue,
      });
    }
  };
  const handleWfQuestionsNumberChange = (e) => {
    const inputValue = parseInt(e.target.value, 10);
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 10&& (questionsData.sc_count+questionsData.mc_count+inputValue <=15)) {
      setQuestionsData({
        ...questionsData,
        wf_count: inputValue,
      });
    }
      };

  
  const handleSave = async (e) => {
    e.preventDefault();
      try {
        if (!questionsData.sc_count && !questionsData.mc_count && !questionsData.wf_count) {
          setError(t('questionNumberRequired'));
          return;
        }
        
        try {
          let timeoutId = setTimeout(() => {
            setTimeOut(true);  
          }, 90000);
         
          fetchQuestions(questionsData.sc_count, questionsData.mc_count, questionsData.wf_count, setLoading, setBlockProcess, chapters, setFragen, setCurrentFrage, setFragenGeneration, setFragenUpdatedAfterSelection, textLanguage)
              .then(() => {
                  setLoading(false);
                  setFragenGeneration(true);
                  setFragenUpdatedAfterSelection(false)
                  clearTimeout(timeoutId);

              })
              .catch(error => {
                  console.error("Error creating Questions1:", error);
                  clearTimeout(timeoutId);
                  setTimeOut(true);
              });
      } catch (error) {
          console.error("Error creating Questions2:", error);
      }
        
        
        GetInfo(questionsData.sc_count,questionsData.mc_count,questionsData.wf_count);
        localStorage.setItem(
          "sc_count",
          JSON.stringify(questionsData.sc_count)
        );
        localStorage.setItem(
          "mc_count",
          JSON.stringify(questionsData.mc_count)
        );
        localStorage.setItem(
          "wf_count",
          JSON.stringify(questionsData.wf_count)
        );

        onClose();
           }
       catch (error) {
        setError("error :!!!!!!");
      }
  };

  const handleClose = () => {
    if (fragen.length ===0) {
      setIsQuestionCanceled(true);
    setFragenUpdatedAfterSelection(false)
    setBlockProcess(false)
    setVisitedSections((prevSections) => {
      console.log("--------------------je lennaaaa f popUp-----------------");
      return prevSections.includes("Charakter")
        ? prevSections
        : [...prevSections, items[items.length-1]];
    });
    onClose();
    }
    else
    onClose();
    setFragenUpdatedAfterSelection(false)
    setBlockProcess(false)
  };

  return (
    <div >
   
      <div
        className={`modal ${show ? "show" : ""}`}
        tabIndex="1"
        role="dialog"
        aria-hidden={!show}
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content popUpContent" >  
          <div className="info-container">
      <div className="info-icon">
      <img src={info}alt="info" className="info-icon" />  
          <div className="info-dropdown">
          <p>{t('importantMessage')}</p>
          <p>{t('processingMessage')}</p>
        </div>
      </div>
    </div>
            <div  className={`modal-body   ${isArabic ? 'rtl' : 'ltr'}`}> 
              {error && (
                <div
                  className="help-block question-help-block"
                >
                  {error}
                </div>
              )}
              <form>
                <div
                  className={`element fragen popup-fragen form-group ${
                    error ? "has-danger" : ""
                  }`}
                >
                  <label
                    htmlFor="sceneType"
                    className="control-label element-label col-md-9"
                  >
                    {t("singleChoice")}
                  </label>
                  <input
                    type="number"
                    className={`form-control  element-input-number col-md-3
                    ${error ? "is-invalid" : ""}`}
                    value={questionsData.sc_count}
                    onChange={handleScQuestionsNumberChange}
                    required
                    autoComplete="off" 
                  />
                </div>
                <div
                  className={`element fragen popup-fragen form-group ${
                    error ? "has-danger" : ""
                  }`}
                >
                  <label
                    htmlFor="sceneType"
                    className="control-label element-label col-md-9"
                  >
                   {t('multipleChoice')}
                  </label>
                  <input
                    type="number"
                    id="sceneName"
                    className={`form-control  element-input-number col-md-3
                    ${error ? "is-invalid" : ""}`}
                    value={questionsData.mc_count}
                    onChange={handleMcQuestionsNumberChange}
                    required
                    autoComplete="off" 
                  />
                </div>
                <div
                  className={`element fragen popup-fragen form-group ${
                    error ? "has-danger" : ""
                  }`}
                >
                  <label
                    htmlFor="sceneType"
                    className="control-label element-label col-md-9"
                  >
                   {t('trueFalse')}
                  </label>
                  <input
                    type="number"
                    id="sceneName"
                    className={`form-control  element-input-number col-md-3
                    ${error ? "is-invalid" : ""}`}
                    value={questionsData.wf_count}
                    onChange={handleWfQuestionsNumberChange}
                    required
                    autoComplete="off" 
                  />
                </div>
                <div
                  className="fragen-tooltip"
                  style={{ top: error ? "33%" : 73 }}
                >
                  {t('numberShouldBeBetween1And10')}
                </div>
                
                <div className="buttons-container">
                  <a onClick={handleSave} className="buttons button1 ">
                    {t('ok')}
                  </a>
                  <a onClick={handleClose} className="buttons ">
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

export default QuestionPopUp;