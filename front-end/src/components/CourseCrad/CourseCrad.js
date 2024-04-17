/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../../Firebase";
import "./CourseCrad.css";
import { firestore } from "../../Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const CourseBackCrad = ({ course }) => {
  const [isArabic, setIsArabic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;

  }, []);

  

  const getFeedbacks = async () => {
    let feedbacks = [];
    try {
      const feedbackCollection = collection(firestore, "Feedback");
      const q = query(
        feedbackCollection,
        where("courseId", "==", course.courseId)
      );
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        const feedbackData = doc.data();
        feedbacks.push(feedbackData);
      }
      if (feedbacks.length > 0) {
        setFeedback(() => {
          const total = feedbacks.reduce(
            (sum, feedback) => sum + feedback.rating, 0
          );
          return total / feedbacks.length;
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const courseDuration = (videos) => {
    let totalDuration = 0;
  
    for (const video of videos) {
      for (const subtitle of video.subtitles) {
        totalDuration += subtitle.duration;
      }
    }
    const total_duration_in_minutes = totalDuration / 60;
    let rounded_duration = Math.floor(total_duration_in_minutes);
  
    const remainingSeconds = totalDuration % 60;
    if (total_duration_in_minutes > 1 && remainingSeconds > 30) {
      rounded_duration += 1;
    }
    else if(total_duration_in_minutes < 1){
      rounded_duration = 1
    }
    return rounded_duration;
  };

  function capitalizeFirstLetterOfEachWord(sentence) {
    if (sentence && sentence.length > 0) {
      const words = sentence.split(" ");


      const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );

      return capitalizedWords.join(" ");
    } else {
      return sentence;
    }
  }

  const fetchImageUrl = async (name) => {
    try {
      const videoRef = storage.ref().child(`${name}`);
      const url = await videoRef.getDownloadURL();
      setImageUrl(url);
      return url;
    } catch (error) {
      console.error("Error fetching video URL:", error);
      return "";
    }
  };

  const handleClick = (courseId) => {
    sessionStorage.setItem("hasReloaded", false);
    navigate(`/coursePage/${courseId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchImageUrl(course.CoursePicture);
      await getFeedbacks();
    };

    fetchData();
  }, [course.CoursePicture]);

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      style={{ fontSize: "30px" }}
      key={index}
      className={
        index < Math.floor(feedback)
          ? "filled"
          : index < feedback
          ? "half-filled"
          : "empty"
      }
    >
      &#9733;
    </span>
  ));

  return (
    <div
      key={course.id}
      className="course-card"
      onClick={() => handleClick(course.courseId)}
    >
      <div className="course-card-inner">
        <div className="course-card-front">
          {imageUrl && <img src={imageUrl} className="course-card-front-img" alt="coursepicture" />}
          <div className="title-container">
            {course.Title && (
              <h5 className="card-course-title" >
                {course.Title}
              </h5>
            )}
          </div>
        </div>
        <div className="course-card-back" style={{ cursor: "pointer" }}>
          <div className="title-back-container">
            {course.Title && <h4 className="course-title">{course.Title}</h4>}
          </div>
          <div className="card-information">
            <span className={`item-back ${isArabic ? 'rtl' : 'ltr'}`}>{t('duration') +": "+courseDuration(course.Scenes)+" " + t('min')}</span>
            <span className={`item-back ${isArabic ? 'rtl' : 'ltr'}`}>
            {t('author')}: {capitalizeFirstLetterOfEachWord(course.courseOwner)}
            </span>
            <span className={`item-back ${isArabic ? 'rtl' : 'ltr'}`}>{t('created')}: {course.creationDate}</span>
            <span className={`item-back ${isArabic ? 'rtl' : 'ltr'}`}>
            {t('type')}: {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
            </span>
            <span className={`item-back ${isArabic ? 'rtl' : 'ltr'}`}>
            {t('status')}: {course.CoursePrivacy ? "Productiv" : "In Erstellung"}
            </span>
            <span className={`item-back ${isArabic ? 'rtl' : 'ltr'}`}>
            {t('questions')}: {course.Fragen.length !== 0 ? t('yes') : t('no')}
            </span>
          </div>
          <div>
            <div className="text-center">{stars}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBackCrad;
