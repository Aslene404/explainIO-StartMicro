/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useContext, useEffect } from "react";
import "./TopBar.css";
import arrow from "../../assets/Arrow.png";
import buttonPicture from "../../assets/button.png";
import MyContext from "../../Provider/MyContext";
import repeat from "../../assets/repeat1.png";
import disabled_reload from "../../assets/reload_disabled.png";
import PopUpMultipleButton from'../../components/Popups/PopupMultipleBtn/PopupMultipleBtn';
import { handleRequestDialogAgain, reloadQuestions } from "./apiRequests";
import { buttonFunctions } from "./buttonFunctions";
import { useTranslation } from "react-i18next";

const TopBar = ({
  setSelectedItem,
  selectedItem,
  setResponseData,
  setVideo,
  setGeneration,
  fetchData
}) => {
  const {
    myScenes,
    clickedType,
    avatars,
    isQuestionCanceled,
    setIsQuestionCanceled,
    setIsPopUpCanceled,
    isPopUpCanceled,
    setVideos,
    chapters,
    setQuestions,
    questions,
    setEasyQuestions,
    fragenGeneration,
    setFragenGeneration,
    setLoading,
    setClickedScene,
    blockProcess,
    setBlockProcess,
    loading,
    waitingResponse,
    setWaitingResponse,
    setFragen,
    firstScene,
    fragen,
    isErrorOccured,
    setProcessOn,
    setFragenModal,
    setCurrentFrage,
    setReloadOrNot,
    setPreviousSkript,
    setMyScenes,
    setTimeOutQuestions,
    timeOut, setTimeOut,
    timeOutQuestions,
    previousSkript,
    newSlectionExist,
    fragenUpdatedAfterSelection,
    visitedSections,
    setVisitedSections,
    textLanguage,
    processCompleted,
    setProcessCompleted,
    activeIndex,
    setActiveIndex,
    setPdfError,
    setIsErrorOccured
  } = useContext(MyContext);
  const items = clickedType==="textReader"? ["Skript", "Charakter"]:["Skript", "Dialog", "Fragen", "Charakter"];


  const { t } = useTranslation();

  const [showPopUp, setShowPopUp] = useState(false);

  useEffect(()=>{
   console.log("----------------------------------------visitedSections-----------------------------------",visitedSections)
  },[visitedSections])

const verifyCarakters=()=>{
  if(selectedItem==="Charakter" && (clickedType==="dialog") && (avatars.avatarRight==null||avatars.avatarLeft==null))
  {
    return true
  }
  else if(selectedItem==="Charakter" && (clickedType==="dialog") && (!avatars.avatarRight.voiceName||!avatars.avatarLeft.voiceName))
  {
    return true
  }
  else if(selectedItem==="Charakter" && (clickedType==="monolog" ||clickedType==="podcast"|| clickedType==="textReader")&& avatars.avatarRight==null)
  {
    return true
  } else {return false}
}



  const setSectionVisited = (section) => {
    const index = items.indexOf(section);
  
    if (index !== -1) {
      const newIndex = index + 1;
      const nextSection = items[newIndex];
      setVisitedSections((prevSections) => {
        return prevSections.includes(nextSection)
          ? prevSections
          : [...prevSections, nextSection];
      });
    }
  };
  
    

  const quitePopUp=(e)=>{
    e.preventDefault();
    try {
      setShowPopUp(false);
      
    } catch (error) {}
  }
  const toggleConfirmationModal=(e)=>{
    e.preventDefault();
    try {
      setShowPopUp(false);
      const previousIndex = (activeIndex -1) % items.length;
      setActiveIndex(previousIndex);
      setSelectedItem(items[activeIndex-1]);

      
    } catch (error) {}
  }

  useEffect (() =>{
      console.log("block process value is -----------------------", blockProcess);
  },[blockProcess]);

  let reloadNumber = 0;
  const totalRequests = myScenes.reduce(
    (sum, scene) => sum + scene.sceneChapters.length,
    0
  );
  const [count, setCount] = useState(1);
  const handleReloadQuestions =()=> {
    reloadQuestions(count, timeOutQuestions, questions, fragen,setFragen, setCurrentFrage,
       setFragenGeneration, setLoading, setBlockProcess, setCount, chapters,textLanguage)
  }
  
  const handleOpenShowPopUp =() =>{
    if(items[activeIndex]!=="Dialog"){

    setShowPopUp(true);
    }
}

  useEffect(()=>{
   if(timeOut){
    handleOpenShowPopUp();
   }
  },[timeOut])
  
 
  

  const activeItem =items[activeIndex];
  
  const handleItemClick = () => {
   
    setSectionVisited(activeItem);
    if (activeItem === "Charakter") {
      setGeneration(true);
      setProcessOn(false);
      setFragenGeneration(false);
    }

    const nextIndex = (activeIndex + 1) % items.length;
    setActiveIndex(nextIndex);

    const buttonFunction = buttonFunctions[buttonText];
    if (buttonFunction) {
       buttonFunction({
        myScenes, clickedType, firstScene,setClickedScene,chapters, setEasyQuestions, setQuestions, setTimeOutQuestions
        , setWaitingResponse, setResponseData,setSelectedItem,setBlockProcess,setProcessCompleted, reloadNumber, totalRequests, setTimeOut, setLoading,setFragenGeneration, setMyScenes,setFragenModal, avatars, setVideo,setVideos, previousSkript,textLanguage,setPdfError
      });
    }
  };

  useEffect(() => {
    if (isQuestionCanceled) {
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      setSelectedItem("Charakter");
      setIsQuestionCanceled(false);
      setLoading(false);
    }
  }, [isQuestionCanceled, activeIndex]);
  useEffect(() => {
    if (isErrorOccured) {
      const nextIndex = (activeIndex - 1) % items.length;
      setActiveIndex(nextIndex);
      setSelectedItem("Skript");
      setIsErrorOccured(false);
      setLoading(false);
    }
  }, [isErrorOccured, activeIndex]);


  useEffect(() => {
    if (isPopUpCanceled) {
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      clickedType==="textReader" ? setSelectedItem("Charakter") :setSelectedItem("Dialog");
      setIsPopUpCanceled(false);
    }
  }, [isPopUpCanceled, activeIndex]);

  let buttonText = clickedType==="textReader"? 'chooseCharacter': 'createDialog';
  if (activeItem === "Dialog") {
    buttonText = 'createQuestions';
  } else if (activeItem === "Fragen") {
    if (clickedType === "podcast"|| clickedType==="textReader") {
      buttonText = 'chooseVoice';
    } else {
      buttonText = 'chooseCharacter';
    }
  } else if (activeItem === "Charakter") {
    buttonText = 'generate';
  }
  

  const handleDialogAgain = () =>{
    handleRequestDialogAgain(setWaitingResponse, setReloadOrNot, clickedType, setBlockProcess
      ,setResponseData,setProcessCompleted, reloadNumber, totalRequests, setTimeOut, chapters, textLanguage
      );
  }

  const handleSectionClick = (section) => {
    const index = items.indexOf(section);

    setActiveIndex(index);
    setSelectedItem(section);

    if (section === 'Skript') {
      fetchData()
    }
    

  };
  
 

  return (
    <div className={` TopBar-elements`}>
      <div className="topBar-cercles">
        <div className="TopBar-element"  onClick={() => {
        if (visitedSections.includes("Skript")&& !blockProcess) {
          setPreviousSkript(true);
          handleSectionClick("Skript");
        }}} 
        style={{cursor:visitedSections.includes("Skript")?"pointer":""}}>
          <div
            className="element-circle"
            style={{
              backgroundColor: activeItem === "Skript" ? "#E82E2C" :(!visitedSections.includes("Skript")||blockProcess)?"#a2a2a2":"",
            }}
          ></div>
          <p className="element-title">{t('script')}</p>
        </div>
        
        {clickedType!=="textReader" ?
          (<>
          <img className="arrow" src={arrow} alt="arrow" />
        <div className="TopBar-element" onClick={() => {
        if (visitedSections.includes("Dialog")&& !newSlectionExist&& !blockProcess 
         ){
          handleSectionClick("Dialog");
        }}}
        style={{cursor:visitedSections.includes("Dialog")?"pointer":""}} >
          {activeIndex === 1 &&(processCompleted || true) ? (
            <div onClick={handleDialogAgain}>
              {waitingResponse ? (
                <img
                  className="element-picture"
                  src={disabled_reload}
                  alt="first-picture"
                />
              ) : (
                <img
                  className="element-picture"
                  style={{ cursor: "pointer" }}
                  src={repeat}
                  alt="second-picture"
                />
              )}{" "}
            </div>
          ) : (
            <div
              className="element-circle"
              style={{
                backgroundColor: activeItem === "Dialog" ? "#E82E2C" :(!visitedSections.includes("Dialog")||newSlectionExist||blockProcess)?"#a2a2a2": "",
              }}
            ></div>
          )}
          <p className="element-title">{t('dialog')}</p>
        </div>
        <img className="arrow" src={arrow} alt="arrow" />
        <div className="TopBar-element"  onClick={() => {
          if (visitedSections.includes("Fragen")&& !blockProcess &&!fragenUpdatedAfterSelection
          ) {
            handleSectionClick("Fragen");
          }
        }}
        style={{cursor:visitedSections.includes("Fragen")?"pointer":""}} >
          { activeIndex === 2 &&  (fragenGeneration  || true )  ? (
            <div onClick={handleReloadQuestions}>
              {loading ? (
                <img
                  className="element-picture"
                  src={disabled_reload}
                  alt="first-picture"
                />
              ) : (
                <img
                  className="element-picture"
                  style={{ cursor: "pointer" }}
                  src={repeat}
                  alt="second-picture"
                />
              )}{" "}
            </div>
          ) : (
            <div
              className="element-circle"
              style={{
                backgroundColor: activeItem === "Fragen" ? "#E82E2C":(!visitedSections.includes("Fragen")||fragenUpdatedAfterSelection||blockProcess)?"#a2a2a2": "",
              }}
            ></div>
          )}

          <p className="element-title">{t('questions')}</p>
        </div></>) : <></>}
        <img className="arrow" src={arrow} alt="arrow" />
        <div className="TopBar-element" onClick={() => {
        if (visitedSections.includes("Charakter")&& !blockProcess&&!newSlectionExist&&!fragenUpdatedAfterSelection ) {
          handleSectionClick("Charakter");
        }
          }}
          style={{cursor:visitedSections.includes("Charakter") && activeIndex !== 3?"pointer":""}}>
          <div
            className="element-circle"
            style={{
              backgroundColor: activeItem === "Charakter" ? "#E82E2C" :(!visitedSections.includes("Charakter")||blockProcess||newSlectionExist||fragenUpdatedAfterSelection)?"#a2a2a2" : "",
            }}
          ></div>
          <p className="element-title">
            {(clickedType === "podcast"||clickedType==="textReader" )? t('voice') : t('character')}
          </p>
        </div>
      </div>
      <div style={{ marginBottom: "3%" }}>
        <button
          disabled={blockProcess || verifyCarakters()}
          className="TopBar-button"
          onClick={handleItemClick}
        >
         {t(buttonText)}
 
          <img
          className="button-image"
          src={buttonPicture}
          alt="buttonPicture"
          />
        </button>
      </div>
      {showPopUp && (
           <PopUpMultipleButton  
           show={showPopUp}
           text={t('errorOccurred')} 
           btns={[
            {text:"Ok",fn: toggleConfirmationModal },
            {text: "Cancel", fn: quitePopUp},
          ]}/>
        )}
    </div>
  );
};

export default TopBar;