import React, { useContext, useState } from "react";
import MyContext from "../../../Provider/MyContext";
import "./SidebarQuestion.css";
import { useTranslation } from "react-i18next";
import { arraysAreEqual } from "../../../utils/helpers";

const SidebarQuestion = () => {
  const { fragen, currentFrage, setCurrentFrage } = useContext(MyContext);
  const [currentIndex, setCurrentIndex] = useState(null);
  const { t } = useTranslation();

  // Initialize selectedQuestion with the index of the first question
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const handleCurrentFrage = (frage, index) => {
    setCurrentFrage({...frage, frageIndex:index});
    console.log("currentFrage", currentFrage);
    setCurrentIndex(index);
  };

  const handleFragenButton = () => {
    if (fragen.length === 0) {
      return (
        <div className="no-fragen-title">
          {t('questions')}
        </div>
      );
    } else {
      return fragen.map((frage, index) => {
        const isSelected = frage.question === currentFrage.question && arraysAreEqual(currentFrage.answers, frage.answers);
  
        return (
          <button 
            key={index}
            onClick={() => {
              handleCurrentFrage(frage, index);
              console.log("--------------current fragen---------", currentFrage);
            }}
            className={isSelected ? "fragen active" : "fragen"}
            disabled={isSelected}
          >
            <span className="me-2">{t('question')}</span>
            {index + 1}
          </button>
        );
      });
    }
  }; 

  return (
    <div className="side-questions-container">
      {handleFragenButton()}
    </div>
  );
};

export default SidebarQuestion;