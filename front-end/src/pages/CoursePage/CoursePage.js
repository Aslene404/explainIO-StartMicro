/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import FeedBack from "../../components/FeedBack/FeedBack";
import { firestore } from "../../Firebase";
import MyContext from "../../Provider/MyContext";
import LeftBarCourse from "../../components/LeftBarCourse/LeftBarCourse";
import DisplayScene from "../../components/DisplayScene/DisplayScene";
import DisplayQuestions from "../../components/DisplayQuestions/DisplayQuestions";
import "./CoursePage.scss";
import { useNavigate} from "react-router-dom";
import PopupMultipleBtn from "../../components/Popups/PopupMultipleBtn/PopupMultipleBtn"
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import translations from './CoursePage.json';

const loadTranslations = async (language) => {
  await i18n.use(initReactI18next) 
  .init({ 
    resources: translations,
    lng: language,
  });

};

const CoursePage = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [sideButton, setSideButton] = useState("szene");
  const [selectedButton, setSelectedButton] = useState("fragen");

  const [type, setType] = useState("");
  const [showMyDeleteModel, setShowMyDeleteModel] = useState(false);
  const {setCourse} = useContext(MyContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isNavbarMode, setIsNavbarMode] = useState("false");
  const [changesDone,setChangesDone]=useState(true)
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
    const fetchCourseData = async () => {
      try {
        const courseDoc = await firestore.collection("Courses").doc(id).get();
        if (courseDoc.exists) {
          const data = courseDoc.data();
          setCourseData(data);
          setCourse(data);
          setType(data.type);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchCourseData();
  }, [id]);

  const deleteChanges = async () => {

    setSideButton(selectedButton)
    setChangesDone(true)
    setSelectedButton('fragen')
  
  };

  const handleClosePopup=()=>{
    setSelectedButton('fragen')
  }

  const deleteCourse = async () => {
    const coursesCollection = collection(firestore, "Courses");
    const course_query = query(coursesCollection, where("courseId", "==", id));
    try {
      const querySnapshot = await getDocs(course_query);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      setShowMyDeleteModel(false);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleSideButton = (button) => {
    if (sideButton==='fragen'&& !changesDone) {
      setSelectedButton(button)
    }
    else setSideButton(button);
  };
  

  const handleFreigeben = async () => {
    try {
      const courseRef = firestore.collection("Courses").doc(id);
      const courseDoc = await courseRef.get();

      if (courseDoc.exists) {
        const currentCoursePrivacy = courseData.CoursePrivacy;

        await courseRef.update({
          CoursePrivacy: !currentCoursePrivacy,
        });
        window.location.reload();
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating CoursePrivacy: ", error);
    }
  };
const handleClose=()=>{
  setShowMyDeleteModel(false)
}

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
    <div className={`back-page `}>
       <div className="menu-button" onClick={() => handleMenuToggle()}>
        <span></span>
        <span></span>
        <span></span></div>
        <div className="leftbar-mode">
      <LeftBarCourse
        sideButton={sideButton}
        handleSideButton={handleSideButton}
        handleFreigeben={handleFreigeben}
        showMyDeleteModel={showMyDeleteModel}
        setShowMyDeleteModel={setShowMyDeleteModel}
        courseData={courseData}
      /></div>
      <div className="content-pdf course-container" >
        {sideButton === "szene" && (
          <DisplayScene type={type} courseData={courseData} sideButton={sideButton} />
        )}
        {sideButton === "com" && <FeedBack />}

        {sideButton === "fragen" && (
          <DisplayQuestions
            id={id}
            courseData={courseData}
            sideButton={sideButton}
            changesDone={changesDone}
            setChangesDone={setChangesDone}
          />
        )}
      </div>

      <PopupMultipleBtn  
           show={showMyDeleteModel}
           text={t('confirmDeleteCourse')}
           btns={[
            {text: t('ok'),fn:deleteCourse},
            {text:t('cancel'),fn:handleClose}]} />

             <PopupMultipleBtn  
           show={!changesDone&&selectedButton!=='fragen'}
           text={t('confirmDeleteChanges')}
           btns={[
            {text:"Ok",fn:deleteChanges},
            {text:"Cancel",fn:handleClosePopup}]} />
      <div className="version">
          V1.0.6

        </div>
    </div>
  );
};

export default CoursePage;
