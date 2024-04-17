import React, { useState } from 'react';
import MyContext from './MyContext';

const MyContextProvider = ({ children }) => {
    const [chapters, setChapters] = useState([]);
    const [myScenes, setMyScenes] = useState([]);
    const [fragen, setFragen] = useState([]);
    const [avatars, setAvatars] = useState({
      avatarRight: null,
      avatarLeft:null
    });
    const [existingScenesTitles, setExistingScenesTitles] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [clickedScene, setClickedScene] = useState();
    const [clickedType, setClickedType] = useState();
    const [isQuestionCanceled, setIsQuestionCanceled] = useState(false);
    const [isPopUpCanceled, setIsPopUpCanceled] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentFrage, setCurrentFrage] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(1);
    const [selectedAvatarInfo, setSelectedAvatarInfo] = useState(null);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const[disableStyle, setDisableStyle] =useState(false);
    const[blockProcess, setBlockProcess] =useState(false);
    const [fragenModal, setFragenModal]= useState(false);
    const [fragenGeneration, setFragenGeneration] =useState(false);
    const [loading, setLoading]= useState(false);
    const [waitingResponse, setWaitingResponse]= useState(false);
    const [questions,setQuestions]=useState([]);
    const [firstScene, setFirstScene]=useState();
    const [count,setCount]=useState(0);
    const [showPopUp, setShowPopUp]=useState(false);
    const [reloadOrNot, setReloadOrNot]=useState(false);
    const [processOn, setProcessOn]= useState(false);
    const [timeOutQuestions,setTimeOutQuestions]=useState([]);
    const [questionsTimeOut, setQuestionsTimeOut] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [course, setCourse] =useState();
    const [showSideBar, setShowSideBar]= useState(false);
    const [timeOut, setTimeOut] = useState(false);
    const [EditScene, setEditScene] = useState(null);
    const [sceneToDelete, setSceneToDelete] = useState(null);
    const [storedPdfData, setStoredPdfData] = useState(null);
    const [storedCanvasContent, setStoredCanvasContent] = useState([]);
    const [storedSelectedPage, setStoredSelectedPage] = useState(null);
    const [previousSkript, setPreviousSkript] =useState(false);
    const [chargedScenes, setChargedScenes] = useState([]);
    const [scale, setScale] = useState(1);
    const [newSlectionExist, setNewSelectionExist]=useState(false)
    const [fragenUpdatedAfterSelection,setFragenUpdatedAfterSelection ]=useState(false)
    const [selectedcharacter1, setSelectedcharacter1] = useState();
    const [selectedcharacter2, setSelectedcharacter2] = useState();
    const [visitedSections, setVisitedSections] = useState(["Skript"]);
    const[choosedAvatars, setChoosedAvatars]= useState([{avatarindex:null,voiceIndex:null},{avatarindex:null,voiceIndex:null}]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [pdfError, setPdfError] =useState(false);
    const [selectedText, setSelectedText] = useState("");
    const [textLanguage, setTextLanguage] = useState("");
    const [mode, setMode] = useState(null);
    const [autoModeChapters,setautoModeChapters]=useState(null)
    const [processCompleted, setProcessCompleted] = useState(false);
    const [isErrorOccured, setIsErrorOccured]= useState(false);






  return (
    <MyContext.Provider value={{ 
      chapters, setChapters,
      myScenes, setMyScenes,
      fragen, setFragen,
      videos,setVideos,
      currentFrage, setCurrentFrage,
      avatars, setAvatars,
      clickedScene, setClickedScene,
      clickedType, setClickedType,
      isQuestionCanceled,setIsQuestionCanceled,
      selectedCharacter, setSelectedCharacter,
      selectedAvatarInfo, setSelectedAvatarInfo,
      selectedVoice, setSelectedVoice,
      disableStyle, setDisableStyle,
      blockProcess, setBlockProcess,
      fragenModal, setFragenModal,
      fragenGeneration, setFragenGeneration,
      loading,setLoading,
      waitingResponse, setWaitingResponse,
      questions,setQuestions,
      firstScene, setFirstScene,
      count, setCount,
      showPopUp,setShowPopUp,
      reloadOrNot, setReloadOrNot,
      processOn, setProcessOn,
      timeOutQuestions, setTimeOutQuestions,
      questionsTimeOut, setQuestionsTimeOut,
      updateMode, setUpdateMode,
      course, setCourse,
      showSideBar, setShowSideBar,
      timeOut, setTimeOut,
      existingScenesTitles, setExistingScenesTitles,
      EditScene, setEditScene,
      showDeleteConfirmation, setShowDeleteConfirmation,
      setSceneToDelete, sceneToDelete,
      storedPdfData, setStoredPdfData,
      storedCanvasContent, setStoredCanvasContent,
      storedSelectedPage, setStoredSelectedPage,
      previousSkript, setPreviousSkript,
      chargedScenes, setChargedScenes,
      scale, setScale,
      newSlectionExist, setNewSelectionExist,
      fragenUpdatedAfterSelection,setFragenUpdatedAfterSelection,
      selectedcharacter1, setSelectedcharacter1,
       selectedcharacter2, setSelectedcharacter2,
       visitedSections, setVisitedSections,
       choosedAvatars, setChoosedAvatars,
       selectedAvatar, setSelectedAvatar,
       selectedText, setSelectedText,
       textLanguage, setTextLanguage,
       mode, setMode,
       autoModeChapters,setautoModeChapters,
       isPopUpCanceled, setIsPopUpCanceled,
       processCompleted, setProcessCompleted,
       activeIndex, setActiveIndex,
       pdfError, setPdfError,
      isErrorOccured, setIsErrorOccured

      }}>

      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
