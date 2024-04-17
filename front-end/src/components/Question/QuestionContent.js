import React, { useState,useContext, useEffect } from "react";
import checked from "../../assets/checked.png";
import unchecked from "../../assets/unchecked.png";
import MyContext from "../../Provider/MyContext";
import CustomTextarea from "../../components/CustomTextarea/CustomTextarea"

const QuestionContent = ({data, updateCorrectAnswer}) => {
  const { setCurrentFrage, setFragen, fragen } = useContext(MyContext);
  const[focusedLine,setFocusedLine]=useState(null)
 
  const HandleModification = (prop, newResponse) => {
    console.log("HandleModification prop", prop)
    setCurrentFrage((prevFrage) => {
      const newFrage= {
        ...prevFrage,
        correct_answers: prevFrage.correct_answers.map((corr_answer,index)=>{
          return corr_answer==prop ? newResponse : corr_answer
        }),
        answers:  prevFrage.answers.map((answer,index) => {
          return answer=== prop ? newResponse : answer;
        }),
      }
      console.log("new Frage", newFrage)
      return newFrage;
    });
  
    const updatedFragen = fragen.map((frage) => {
      if (frage.question === data?.question) {
        const newFrage= {
          ...frage,
          answers: frage.answers.map((answer,index) => {
            return answer=== prop ? newResponse : answer;
          }),
          correct_answers: frage.correct_answers.map((corr_answer,index)=>{
            return corr_answer==prop ? newResponse : corr_answer
          }),
        };
        // console.log("new Frage", newFrage)
        return newFrage
      }
      return frage;
    });
  
    setFragen(updatedFragen);
  };
  
  const handleQuestionChange = (newQuestion) => {
    setCurrentFrage((prevFrage) => ({
      ...prevFrage,
      question: newQuestion,
    }));

    const updatedFragen = fragen.map((frage) => {
      if (frage.question === data.question) {
        return {
          ...frage,
          question: newQuestion,
        };
      }
      return frage;
    });
    setFragen(updatedFragen);
  };
  return (
    <>
      <CustomTextarea
        frage={data.question}
        value={data.question}
        type="Frage"
        changeHandle={handleQuestionChange}
        focusedLine={focusedLine}
        setFocusedLine={setFocusedLine}
        id={"frage-" + data.frageIndex}
      />
      {data.answers.map((option, key) => {
    const url =
        Array.isArray(data.correct_answers) && data.correct_answers.includes(option)
            ? checked
            : unchecked;
        return (
          <div className="row mb-1 options-container" key={key}>
            <div className="col-md-7 d-flex">
              <span className="me-2">{key + ")"}</span>
              <CustomTextarea
                SubIndex={key}
                MotherIndex={0}
                frage={data.frage}
                prop_key={option}
                value={data.answers[key]}
                focusedLine={focusedLine}
                setFocusedLine={setFocusedLine}
                type="FrgagenOption"
                changeHandle={HandleModification}
                id={"frage-"+data.frageIndex+"option-"+key}
              />
            </div>
            <div className="col-md-2 update-correct-answer">
              <img
                alt=""
                src={url}
                onClick={() => {
                  updateCorrectAnswer(option);
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default QuestionContent;
