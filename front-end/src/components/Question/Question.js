import React, { useState, useContext,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MyContext from "../../Provider/MyContext";
import remove from "../../assets/icons/remove.png";
import PopupMultipleBtn from "../Popups/PopupMultipleBtn/PopupMultipleBtn";
import QuestionContent from "./QuestionContent";
import "./Question.css";
import { useTranslation } from "react-i18next";

const Question = ({ data }) => {
  const { currentFrage, setCurrentFrage, setFragen, fragen,textLanguage } =
    useContext(MyContext);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isBackdropVisible, setBackdropVisible] = useState(false);
  const { t } = useTranslation();
 
  const toggleConfirmationModal = () => {
    setConfirmationModalVisible(!isConfirmationModalVisible);
    setBackdropVisible(!isBackdropVisible);
  };



  const removeFrage = () => {
    
    const tabfragen = [];
    let i = 0;
    let fragtemporel = null;

    while (i < fragen.length) {
      if (fragen[i].question !== currentFrage.question) {
        tabfragen.push(fragen[i]);
      } else {
        if (i === 0 && fragen.length > 1) {
          fragtemporel = fragen[i + 1];
        } else if (fragen.length === 1) {
          fragtemporel = null;
        } else {
          fragtemporel = fragen[i - 1];
        }
      }
      i++; 
    }
    setFragen(tabfragen);
    setCurrentFrage(fragtemporel);
  };

  const updateCorrectAnswer = (item) => {
    setCurrentFrage((prevFrage) => {
      let updatedAntworten;
      if (prevFrage.correct_answers.includes(item) && prevFrage.answers.includes(item)) {
        updatedAntworten = prevFrage.correct_answers.filter(
          (answer) => answer !== item
        );
      } else if(prevFrage.answers.includes(item)){
        updatedAntworten = [...prevFrage.correct_answers, item];
      }
    //  const  confirmedUntworten= updatedAntworten.filter((correctAnswer)=>{
    //     return prevFrage.answers.includes(correctAnswer)
    //    })

      return {
        ...prevFrage,
        correct_answers: updatedAntworten,
      };
    });
    const updatedFragen = fragen.map((frage) => {
      if (frage.question === data.question) {
        let updatedAntworten;
        if (frage.correct_answers.includes(item)) {
          updatedAntworten = frage.correct_answers.filter(
            (answer) => answer !== item
          );
        } else {
          updatedAntworten = [...frage.correct_answers, item];
        }
        // const  confirmedUntworten= updatedAntworten.filter((correctAnswer)=>{
        //   return frage.answers.includes(correctAnswer)
        //  })
        return {
          ...frage,
          correct_answers: updatedAntworten,
        };
      } else
      return frage;
    });
    setFragen(updatedFragen);
  };
  

  return (
    <div className={`question-container ${textLanguage === "ar-XA" ? 'questionRtl' : 'ltr'}`} >
      <div className="container-fluid ps-4 " >
      <QuestionContent
          data={data}
          updateCorrectAnswer={updateCorrectAnswer}
        />
        <button
          className="p-1 px-3 delete_style mt-5 btn-remove-question"
          onClick={toggleConfirmationModal}
        >
          <span>
            <img
              alt="remove"
              src={remove}
              className="me-2 remove-question-btn"
            />
          </span>
          {t('delete')}
        </button>
      </div>
      <PopupMultipleBtn
        show={isBackdropVisible}
        text={t('deleteQuestionConfirmation')}
        btns={[
          {text:  t('ok'),fn: () => {removeFrage(); toggleConfirmationModal();},},
          {text: t('cancel'), fn: toggleConfirmationModal },
        ]}
      />
    </div>
  );
};

export default Question;
