/* eslint-disable react-hooks/exhaustive-deps */
import React, {  useState ,useContext, useEffect} from "react";
import checked from "../../../assets/checked.png";
import unchecked from "../../../assets/unchecked.png";
import MyContext from "../../../Provider/MyContext";
import remove from "../../../assets/icons/remove.png";
import CustomTextarea from "../../CustomTextarea/CustomTextarea"
import PopupWarning from "../../Popups/PopupWarning/PopupWarning"
import PopupMultipleBtn from "../../Popups/PopupMultipleBtn/PopupMultipleBtn";
import "./CoursePageQuestions.css"
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc 
} from "firebase/firestore";
import { firestore } from "../../../Firebase";
import { useTranslation } from "react-i18next";

const CoursePageQuestions = ({ courseData, changesDone,setChangesDone}) => {
  const { updateMode } = useContext(MyContext);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState([]);
  const [course, setCourse]= useState(courseData)
  const [focusedLine, setFocusedLine] = useState(null);
  const [showModal,setShowModal]=useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
const [questionToDelete, setQuestionToDelete] = useState(null);
const { t } = useTranslation();

  useEffect(()=>{
  getCourseById()
  },[])

  const showAnswer = (question) => {
    setShowCorrectAnswer((prevAnswers) => {
      const questionIndex = prevAnswers.indexOf(question);

      if (questionIndex === -1) {
        return [...prevAnswers, question];
      } else {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers.splice(questionIndex, 1);
        return updatedAnswers;
      }
    });
  };

  const getCourseById= async()=>{
const coursesCollection = collection(firestore, "Courses");
  const course_query = query(coursesCollection, where("courseId", "==", course.courseId));
  try {
    const querySnapshot = await getDocs(course_query);
    setCourse(querySnapshot.docs[0].data())
  } catch (error) {
    console.error("Error getting course:", error);
  }
  }

  const deleteFrageModal = (selectedfrage) => {
    setQuestionToDelete(selectedfrage);
    setShowConfirmationModal(true);
  };
  const onCancel = () => {
    setShowConfirmationModal(false);
    setQuestionToDelete(null);
  };

const deleteFrage =async ()=>{
  const newFragen = course.Fragen.filter(frage => frage.question !== questionToDelete.question);
  const coursesCollection = collection(firestore, "Courses");
  const course_query = query(coursesCollection, where("courseId", "==", course.courseId));
  try {
    const querySnapshot = await getDocs(course_query);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref; 
   await updateDoc(docRef, {
        Fragen: newFragen,
      });
    });
    getCourseById()
  } catch (error) {
    console.error("Error deleting course:", error);
  }
  setShowConfirmationModal(false);
  setQuestionToDelete(null);
}

const handleContentChange = (selectedfrage, answerKey, newContent) => {
 const updatedFragen = course.Fragen.map((frage, index) => {
  if (frage.question === selectedfrage) {
    const copie_frage = frage;
    copie_frage.answers=frage.answers.map((answer,answerIndex)=>{
     return  answerIndex === answerKey ? newContent : answer
    })
    return copie_frage;
  }
  return frage;
});
setCourse({...course, Fragen:updatedFragen});
setChangesDone(false)
};

const updateCorrectAnswer = (selectedFrage,option) => {
  const updatedFragen = course.Fragen.map((frage) => {
    if (frage.question === selectedFrage.question) {
      let updatedAntworten;
      if (frage.correct_answers.includes(option)) {
        updatedAntworten = frage.correct_answers.filter(
          (answer) => answer !== option
        );
      } else {
        updatedAntworten = [...frage.correct_answers, option];
      }
      return {
        ...frage,
        correct_answers: updatedAntworten,
      };
    }
    return frage;
  });
  setCourse({...course,Fragen:updatedFragen});
  setChangesDone(false)
};

const saveChanges=async()=>
{ 
  const coursesCollection = collection(firestore, "Courses");
  const course_query = query(coursesCollection, where("courseId", "==", course.courseId));
  try {
    const querySnapshot = await getDocs(course_query);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref; 
   await updateDoc(docRef, {
        Fragen: course.Fragen,
      });
    });
    setChangesDone(true)
    setShowModal(true)
    setTimeout(()=>{setShowModal(false)},2000)
    getCourseById()
  } catch (error) {
    console.error("Error deleting course:", error);
  }
}

const handleQuestionChange = (selectedFrage, newQuestion) => {
  const updatedFragen = course.Fragen.map((frage) => {
    if (frage.question === selectedFrage) {
      return {
        ...frage,
        question: newQuestion,
      };
    }
    return frage;
  });
  setCourse({...course,Fragen:updatedFragen});
  setChangesDone(false)
};


  return (
    <div className="container-fluid ps-4" >
      {course?.Fragen?.map((question, index) => (
        <div key={index} className={`question pb-3 ${course.language=== 'ar-XA' ? 'fragenRtl' : 'ltr'}`}>
          <div className="d-flex">
            <span className="coursePageQuestions-index"> {index + 1}.</span>
            <div  className="coursePageQuestions-question" >
              {!updateMode ? 
                <div className="coursePage-question pb-3">
                {(() => {
                  const regex = /^\d+\.\s/;
                  const hasNumberAndPoint = regex.test(question.question);
                  if (hasNumberAndPoint) {
                    return (
                      <p>
                        {question.question.replace(/^\d+\.\s/, "")}
                      </p>
                    );
                  } else {
                    return <p>{question.question}</p>;
                  }
                })()}
              </div>
              :  <CustomTextarea
              SubIndex={index}
              value={question.question}
              focusedLine={focusedLine}
              setFocusedLine={setFocusedLine} 
              type="FrageModeUpdate"
              changeHandle={handleQuestionChange}
              id={"frage-"+index}
              />}
            </div>
          </div>
          <div className="coursePageQuestions-option" >
            {
              question.answers.map((option, key) => {
                const imageUrl =
                    Array.isArray(question.correct_answers) && question.correct_answers.includes(option)&& showCorrectAnswer.includes(question.question)
                        ? checked
                        : unchecked;
              return (
                <div className=" option-check row mb-1" key={key}>
                  <div className=" question-option col-md-7 d-flex" >
                    {<span className="me-1 ">
                      {key  + ") "}
                    </span>}
                    {updateMode ? (
                      <CustomTextarea
                      frage={question.question}
                      prop_key={key}
                      SubIndex={key}
                      MotherIndex={index}
                      value={question.answers[key]}
                      focusedLine={focusedLine}
                      setFocusedLine={setFocusedLine} 
                      type="FrgagenOptionUpdate"
                      changeHandle={handleContentChange}
                      id={"frage-"+index+"option"+key}
                      /> 
                    ) : (
                      <div>{question.answers[key]}</div>
                    )}
                  </div>
                  <div
                    className="col-md-2"
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <img
                      alt=""
                      src={imageUrl}
                      onClick={() => {
                        if (
                          updateMode &&
                          showCorrectAnswer.includes(question.question)
                        ) {
                          updateCorrectAnswer(question, option);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="question-btn-container">
              <button
                className="me-2 question-btn"
                onClick={() => showAnswer(question.question)}
              >
                {showCorrectAnswer.includes(question.question)
                  ? t('hideAnswers')
                  : t('showAnswers')}
              </button>
              {updateMode && (
                <button
                  className="me-2 question-btn"
                  
                  onClick={() => {
                    if (updateMode) {
                      deleteFrageModal(question);
                    }
                  }}
                >
                  <img src={remove} alt="removeQuestion" className="question-remove-picture"/>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {updateMode && (
        <div style={{display:"flex", justifyContent:"center", }} >
          <button
            className="px-4 save-button question-btn "
            disabled={changesDone}
            onClick={saveChanges}
          >
            {t("SaveChanges")}
          </button>
        </div>
      )}
      <PopupWarning  text={t('Änderungen gespeichert ...')} show={showModal}/>
      <PopupMultipleBtn
        show={showConfirmationModal}
        text={t('deleteQuestionConfirmation')}
        btns={[
          {text: t('ok'),fn: deleteFrage},
          {text: t('cancel'), fn: onCancel },
        ]}
      />
    </div>
  );
};

export default CoursePageQuestions;