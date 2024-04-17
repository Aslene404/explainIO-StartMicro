/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect,Suspense } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Greeting from "../../components/Greeting/Greeting";
import Settings from "../../components/Settings/Settings";
import PaypalPopUp from "../../components/Popups/PaypalPopup/PaypalPopUp";
import NewProject from "../../components/NewProject/NewProject";
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import { firestore, storage } from "../../Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Home.css";
import { setBackgroundImage } from "../../utils/helpers";
import { auth } from "../../Firebase";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import SearchBar from "../../components/SearchBar/SearchBar";
import CourseList from "../../components/CourseList/CourseList";
import i18n from "i18next";
import {  initReactI18next } from "react-i18next";
import translations from './Home.json';
registerLocale("de", de);
setDefaultLocale("de");

const loadTranslations = async (language) => {
  await i18n.use(initReactI18next) 
  .init({ 
    resources: translations,
    lng: language,
  });

};

const Home = () => {
  setBackgroundImage(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [noResult, setNoResult]= useState(false);
  const [language, setLanguage]= useState('');
  const [nbEssay, setNbEssay] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [nbEssayCheked, setNbEssayCheked] = useState(false);
  const [showPopUp,setShowPopUp] =useState(false);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
  
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language]);
  
  const getCourses = async () => {
    const coursesCollection = collection(firestore, "Courses");
    const querySnapshot = await getDocs(coursesCollection);
    const courses = [];

    for (const doc of querySnapshot.docs) {
      const courseData = doc.data();
      const currentUser = auth.currentUser;
      courses.push(courseData);
      // if (
      //   courseData.CoursePrivacy &&
      //   currentUser &&
      //   !(currentUser.email?.endsWith("@velptec.de"))
      // ) {
      //   courses.push(courseData);
      // } else if (currentUser
      //    && (currentUser.email?.endsWith("@velptec.de"))) {
      //   courses.push(courseData);
      // }
    }
    setCourses(courses);
    await Promise.all(
      courses.map((course) => fetchImageUrl(course.CoursePicture))
    );
  };



  const fetchImageUrl = async (name) => {
    try {
      const videoRef = storage.ref().child(`${name}`);
      const url = await videoRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error fetching video URL:", error);
      return "";
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const fetchUserNbEssay = async () => {
    const userCollection = collection(firestore, "User");
    const q = query(userCollection, where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const userData = querySnapshot.docs[0].data();
      const nbEssay = userData.nbEssay;
      setNbEssay(nbEssay);
      setNbEssayCheked(true)
      setPaymentStatus(userData.paymentStatus)
    } 
  };
    fetchUserNbEssay();
   const handleOpenPopUp =() => {
    if(localStorage.getItem("activeButton") === "Neues Projekt" && nbEssay >= 3)
    {
      setShowPopUp(true);
    } 
  } 

 

  return (
    <Suspense fallback="loading">
    <div className="home-container">
      <Navbar />
      <div  className={` home-content ${language==='ar' ? 'contentRtl' : 'contentLtr'}`}>
        <Greeting />
        {localStorage.getItem("activeButton") === "start" ? 
          <div>
            <SearchBar
              setFilteredCourses={setFilteredCourses}
              courses={courses}
              setNoResult={setNoResult}
            />
            <CourseList filteredCourses={filteredCourses}  noResult={noResult}/>
          </div>
        :
(localStorage.getItem("activeButton") === "Neues Projekt" &&
 (nbEssay >= 3 && !paymentStatus)? (
  <PaypalPopUp show={handleOpenPopUp}/>

) : (
  ((nbEssay < 3   && nbEssayCheked)|| paymentStatus ) && <NewProject />
))  } 
      {localStorage.getItem("activeButton") === "settings" &&
        <Settings /> }
      </div>
      <div className="version">
          V1.0.6

        </div>
    </div></Suspense>
  );
};
export default Home;
