import React, { useEffect, useState } from "react";
import checked from "../../assets/checked.png";
import unchecked from "../../assets/unchecked.png";
import { auth } from "../../Firebase";
import { firestore } from "../../Firebase";
import BadMarks from "../../animations/BadMarks";
import GoodMarks from "../../animations/GoodMarks";
import checkedRed from "../../assets/checkedRed.png";
import checkedGreen from "../../assets/checkedGreen.png";
import uncheckedRed from "../../assets/uncheckedRed.png";
import CoursePageNavbar from "../../components/CoursePageComponents/CoursePageNavbar/CoursePageNavbar"
import CoursePageResults from "../../components/CoursePageComponents/CoursePageResults/CoursePageResults"
import { useTranslation } from "react-i18next";

import"./DisplayQuestions.css"

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import CoursePageQuestions from "../../components/CoursePageComponents/CoursePageQuestions/CoursePageQuestions";


const DisplayQuestions = ({ courseData, id, sideButton, changesDone,setChangesDone }) => {
  const { t } = useTranslation();
  const alphabets = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",];
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showAnimations, setShowAnimations] = useState(false);
  const [modalExistIsOpen, setModalExistIsOpen] = useState(false);
  const [result, setResult] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [navButton, setNavButton] = useState("fragen");
  const [userAnswers, setUserAnswers] = useState({});
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;

  }, []);
  useEffect(() => {
    const checkUserTest = async () => {
      const userId = auth.currentUser.uid;

      const userTestQuery = query(
        collection(firestore, "Tests"),
        where("courseId", "==", id),
        where("userId", "==", userId)
      );

      const userTestSnapshot = await getDocs(userTestQuery);
      if (!userTestSnapshot.empty) {
        const existingTest = userTestSnapshot.docs[0].data();
        setResult(existingTest.result);
        openModalExist();
      }
    };

    if (sideButton === "fragen") {
      checkUserTest();
    }
  }, [sideButton, id]);

  useEffect(() => {
    const totalQuestions = courseData?.Fragen?.length || 0;
    const answeredQuestions = Object.keys(userAnswers).length;
    const isAllChecked = answeredQuestions === totalQuestions;
    setIsAllChecked(isAllChecked);
  }, [courseData, userAnswers]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const testsCollection = collection(firestore, "Tests");
        const testsQuery = query(testsCollection, where("courseId", "==", id));
        const testsSnapshot = await getDocs(testsQuery);

        const results = [];
        testsSnapshot.forEach((doc) => {
          const data = doc.data();
          results.push({
            userName: data.userEmail,
            resultPercentage: data.result,
            date: data.timestamp.toDate().toLocaleDateString(),
          });
        });

        setTestResults(results);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, [id]);

  const handleNavButton = (button) => {
    setNavButton(button);
  };



  const getAnswerImageUrl = (isCorrect, isSelected) => {
    if (isSelected) {
      return isCorrect ? checkedGreen : uncheckedRed;
    } else {
      return isCorrect ? checkedRed : unchecked;
    }
  };

 

  const handleAnswerSelection = (question, selectedOption) => {
    setUserAnswers((prevAnswers) => {
      const prevSelectedOptions = prevAnswers[question] || [];
      const isOptionSelected = prevSelectedOptions.includes(selectedOption);

      let updatedOptions;

      if (isOptionSelected) {
        updatedOptions = prevSelectedOptions.filter(
          (option) => option !== selectedOption
        );
      } else {
        updatedOptions = [...prevSelectedOptions, selectedOption];
      }

      return {
        ...prevAnswers,
        [question]: updatedOptions,
      };
    });
  };

  const handleSubmitTest = async () => {
    openModal();
    setIsTestSubmitted(true);
    const percentage = calculatePercentage();
    const userEmail = auth.currentUser.email;
    const userId = auth.currentUser.uid;

    const testsCollection = collection(firestore, "Tests");
    await addDoc(testsCollection, {
      courseId: id,
      result: percentage,
      userEmail: userEmail,
      userId: userId,
      timestamp: serverTimestamp(),
    });
  };

  const calculatePercentage = () => {
        const totalQuestions = courseData?.Fragen?.length || 0;
    if (totalQuestions === 0) {
      return 0;
    }
    const correctAnswers = courseData?.Fragen?.filter((question) => {
      const userSelectedOptions = userAnswers[question.question] || [];
      const correctOptions = question.correct_answers.map((answer) => {
        const trimmedAnswer = answer.trim();
        const index = question.answers.findIndex((a) => a === trimmedAnswer);
        return index;
      });
      return (
        userSelectedOptions.length === correctOptions.length &&
        userSelectedOptions.every((option) => correctOptions.includes(option))
    
      );
    }).length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    return percentage.toFixed(2);
  };

  const openModal = () => {
    setModalIsOpen(true);
    setShowAnimations(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setShowAnimations(false);
  };

  const openModalExist = () => {
    setModalExistIsOpen(true);
  };

  const closeExistModal = () => {
    setModalExistIsOpen(false);
  };
  const getCurrentUserName=()=>{

    const user = auth.currentUser.email;
    const extractedUsername = user.split("@")[0];
    const usernameWithSpace = extractedUsername.replace(".", " ");
    return usernameWithSpace ;
  }
  return (
    <div className="questions-container">
      {auth.currentUser &&
            auth.currentUser.email&& getCurrentUserName()===courseData?.courseOwner&&
        <div className="nav-questions" >
          {testResults?.length > 0 && (
            <CoursePageNavbar  navButton={navButton} handleNavButton={handleNavButton} /> 
          )}
          {navButton === "fragen" && (
            <CoursePageQuestions  courseData={courseData} changesDone={changesDone} setChangesDone={setChangesDone}/>
          )}
          {navButton === "results" && (
            <CoursePageResults id={id} />
          )}
        </div>}
     
      { auth.currentUser &&
            auth.currentUser.email&& getCurrentUserName()!==courseData?.courseOwner&& <div className="test-content">
          <div className="container-fluid ps-4" >
            {courseData?.Fragen?.map((question, index) => (
              <div key={index} className={`question pb-3 ${courseData.language=== 'ar-XA' ? 'fragenRtl' : 'ltr'}`}>
                <span>
                  {index + 1}.{question.question}
                </span>
                <div className="questions-content">
                  {(Object.values(question.answers)).map((item, answerIndex)=> {
                    const isCorrectAnswer = question.correct_answers.includes(
                      item
                    );
                    const isSelected =
                      userAnswers[question.question]?.includes(answerIndex);
                    const imageUrl = !isTestSubmitted
                      ? userAnswers[question.question]?.includes(answerIndex)
                        ? checked
                        : unchecked
                      : getAnswerImageUrl(isCorrectAnswer, isSelected);

                    return (
                      <div className="row mb-1" key={answerIndex}>
                        <div className="col-md-7 d-flex">
                          {alphabets[answerIndex] + ") "}
                          {item.substring(0, 2)}
                          {item.slice(2)}
                        </div>
                        <div className="col-md-2">
                          {!isTestSubmitted ? (
                            <img
                            alt=""
                              src={imageUrl}
                              onClick={() =>
                                handleAnswerSelection(question.question, answerIndex)
                              }
                            />
                          ) : (
                            <img src={imageUrl} alt="" />
                          )}
                        </div>
                      </div>
                    );
                  })} 
                </div>
              </div>
            ))}

            {result === "" && !isTestSubmitted && (
              <button className="btn-submit-test"
                style={{
                  marginLeft:30,
                  background: isAllChecked
                    ? "var(--6-e-82-e-2-c, #e11b19)"
                    : "#3C3C3C",
                  cursor: isAllChecked ? "pointer" : "default",
                }}
                onClick={isAllChecked ? handleSubmitTest : undefined}
              >
                {t("submit")}
              </button>
            )}
          </div>
        </div>}
      

      {modalIsOpen && (
        <div className="custom-modal">
          <div  className={`modal-result ${isArabic? 'rtl' : 'ltr'}`}>
            <h2>{t('testResult')}</h2>
            <p>{t("percentage")}: {calculatePercentage()}%</p>
            <div>
              {calculatePercentage() > 50
                ? t("testPassed")
                : t("testFailed")}
            </div>
            <button onClick={closeModal} className="result-btn">
            {t('close')}
            </button>
          </div>
        </div>
      )}
      {showAnimations &&
        (calculatePercentage() >= 50 ? <GoodMarks /> : <BadMarks />)}

      {modalExistIsOpen && (
        <div className="custom-modal">
          <div className={`modal-result ${isArabic? 'rtl' : 'ltr'}`}>
            <h2>{t("testResult")}</h2>
            <div>{t("testCompletedMessage")}{result}% .</div>
            <button onClick={closeExistModal} className="result-btn">
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayQuestions;
