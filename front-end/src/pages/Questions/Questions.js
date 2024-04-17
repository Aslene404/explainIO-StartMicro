
import QuestionPopUp from "../../components/Popups/QuestionPopUp/QuestionPopUp"
import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fragen from '../../components/Question/Question';
import MyContext from "../../Provider/MyContext";
import "./Questions.css";
const Questions = () => {
    const {
        fragen, setFragen, currentFrage, setCurrentFrage, setFragenModal,
        questions, timeOutQuestions,
        fragenModal, setFragenGeneration, loading, setLoading, setBlockProcess
    } = useContext(MyContext);


    const [QuestionsInfo, setQuestionsInfo] = useState({ sc_count: null, mc_count: null,wf_count:null });

    
    const handleOpenMyModal = () => {
        
        setFragenModal(true);
        setBlockProcess(true);
        
    };
   
    const handleCloseMyModal = () => {
        if (fragen.length===0) {
            setFragenModal(false);
        if ((questions.length === 0) || timeOutQuestions===0) {
            setLoading(true);
            setFragenGeneration(false);
        } else {
            setBlockProcess(false);
        }
        }
        else{
            setFragenModal(false);
        }
        
    };

    useEffect(()=>{
      if(fragen.length === 0)
      {
        setFragenModal(true)
      }
    
    },[])
    
    const selectRandomQuestions = (questions, sc_count, mc_count, wf_count) => {
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
      const singleChoiceQuestions = [];
      const multipleChoiceQuestions = [];
      const trueFalseQuestions = [];
      shuffledQuestions.forEach((question) => {
        const correctAnswersLength = question.correct_answers.length;

        if (correctAnswersLength > 1) {
          multipleChoiceQuestions.push(question);
        } else if (
          correctAnswersLength === 1 &&
          ["wahr", "falsch"].includes(question.correct_answers[0])
        ) {
          trueFalseQuestions.push(question);
        } else {
          singleChoiceQuestions.push(question);
        }
      });

      const selectedSC = singleChoiceQuestions.slice(0, sc_count);
      const selectedMC = multipleChoiceQuestions.slice(0, mc_count);
      const selectedWF = trueFalseQuestions.slice(0, wf_count);

      const selectedQuestions = [...selectedSC, ...selectedMC, ...selectedWF];

      setFragen(selectedQuestions);
      setCurrentFrage({...selectedQuestions[0],frageIndex:0});
      setFragenGeneration(true);
    };
    

    const handleQuestionsInfo = async (sc_count, mc_count, wf_count) => {
      setQuestionsInfo({
        ...QuestionsInfo,
        sc_count: sc_count,
        mc_count: mc_count,
        wf_count: wf_count,
      });
      if (timeOutQuestions.length !== 0) {
        if (timeOutQuestions.length >= sc_count + mc_count + wf_count)
          selectRandomQuestions(
            timeOutQuestions,
            sc_count + mc_count + wf_count
          );
        else {
          setFragen(timeOutQuestions);
          setCurrentFrage({...timeOutQuestions[0], frageIndex:0});
          setFragenGeneration(true);
        }
      }

      selectRandomQuestions(questions, sc_count, mc_count, wf_count);
    };


  // useEffect(() => {
  //     if (fragen.length!==0) {
  //         setBlockProcess(false);
  //       }
  //       else{
  //           setBlockProcess(true);
  //       }
  // }, [questions, timeOutQuestions]);
  


    return (
        <div style={{ display: "flex", flexDirection: "column", height: "80%", justifyContent: "center", alignItems: "center", filter: "none" }}>
            {
                fragenModal
                &&!loading
                && <QuestionPopUp show={handleOpenMyModal} onClose={handleCloseMyModal} 
                GetInfo={handleQuestionsInfo} />}

            {loading &&
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            }

            {fragen.length !== 0
                && !fragenModal
                && !loading
                && <Fragen data={currentFrage} />}
        </div>
    );
};

export default Questions;