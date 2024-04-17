import React, { useState, useEffect} from "react";
import "./LoadScript.css";
import PDFProcessor from "./PDFProcessor";
import DisplayVideo from "../../components/DisplayVideo/DisplayVideo";
import Sidebar from "../../components/Sidebar/Sidebar";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from './LoadScript.json';
const loadTranslations = async (language) => {
  await i18n.use(initReactI18next) 
  .init({ 
    resources: translations,
    lng: language,
  });

};

const LoadScript = () => {
  const [showMyModal, setShowMyModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [selectedItem, setSelectedItem] = useState("Skript");
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [showQuiteCreationModal, setShowQuiteCreationModal] = useState(false);
  const [generation, setGeneration] = useState(false);
  const [sideButton, setSideButton] = useState("szene");
  const [video, setVideo] = useState("");
  const [title, setTitle] = useState("");
  const [isNavbarMode, setIsNavbarMode] = useState("false");

 const  handleKeyDown = (event) => {
  if(event.key ==="Enter")
    event.preventDefault();

  };
  const [language, setLanguage]= useState('');

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
  
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language]);
  

  useEffect(() => {
    localStorage.setItem("activeButton", "start");
  }, []);

  const handlePDFUploaded = () => {
    setPdfData(true);
  };


  
const handleMenuToggle = () => {
  const sideBar = document.querySelector('.leftbar-mode');
  if ( sideBar.style.transform === 'translateX(-100%)') {
        sideBar.style.transform = 'translateX(0%)'
        setIsNavbarMode(true)
  }
  else{
    sideBar.style.transform = 'translateX(-100%)'

  }
;
};

useEffect(() => {
  const handleOutsideClick = (e) => {
    const sideBar = document.querySelector('.leftbar-mode');
    const menu = document.querySelector('.menu-button');
    if (isNavbarMode && sideBar && !sideBar.contains(e.target) &&  !menu.contains(e.target))  {
      sideBar.style.transform = 'translateX(-100%)';
      setIsNavbarMode(false);
    }
  };

  document.addEventListener("click", handleOutsideClick);

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };
}, [isNavbarMode]);
  return (
    <div onKeyDown={handleKeyDown} tabIndex="0" className={`LoadScript-content`}>
      <div className={`back-page `}>
      <div className="menu-button" onClick={() => handleMenuToggle()}>
        <span></span>
        <span></span>
        <span></span></div>
       
        <Sidebar
         pdfData={pdfData}
         generation={generation}
         showMyModal={showMyModal}
         setShowMyModal={setShowMyModal}
         showCreateCourseModal={showCreateCourseModal}
         setShowCreateCourseModal={setShowCreateCourseModal}
         showQuiteCreationModal={showQuiteCreationModal}
         setShowQuiteCreationModal={setShowQuiteCreationModal}
         selectedItem={selectedItem}
         scenes={scenes}
         setScenes={setScenes}
         sideButton={sideButton}
         setSideButton={setSideButton}
         generationCompleted={generationCompleted}
         setTitle={setTitle}
        />


        <div
          className={`content-pdf ${
            showMyModal || showCreateCourseModal || showQuiteCreationModal
              ? "content-blur"
              : ""
          }`}
        >
          {!generation ? (
            <PDFProcessor
              onPDFUploaded={handlePDFUploaded}
              setActiveItem={setSelectedItem}
              scenes={scenes}
              setScenes={setScenes}
              setGeneration={setGeneration}
              setVideo={setVideo}
              setTitle={setTitle}
              title={title}
                          />
          ) : (
            <DisplayVideo
              video={video}
              sideButton={sideButton}
              setGenerationCompleted={setGenerationCompleted}
            />
          )}
        </div>
        <div className="version">
          V1.0.6

        </div>
        
      </div>
    </div>
  );
};

export default LoadScript;
