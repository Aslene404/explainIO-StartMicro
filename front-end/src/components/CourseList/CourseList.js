import React, { useState, useEffect } from "react";
import CourseCrad from "../CourseCrad/CourseCrad";
import Lottie from 'react-lottie';
import * as progress_points_Animation from '../../assets/LottieAnimations/progress_points_Animation.json';
import * as noResultAnimation from '../../assets/LottieAnimations/noResultAnimation2.json';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./CourseList.css"
import { useTranslation } from "react-i18next";


const cardsPerPage = 12;

const CourseList = ({ filteredCourses, noResult }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredCourses.length / cardsPerPage);
  const { t } = useTranslation();

  const getDisplayedCourses = () => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  };

  const setCurrentPageFunction = (pageNumber) => {
    const contentDiv = document.getElementById("cards-container");
    if (contentDiv) {
      contentDiv.scrollTop = 0;
    }
    setCurrentPage(pageNumber);
  };
  useEffect(()=>{
     
  },[filteredCourses])

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: progress_points_Animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  const defaultOptions2 = {
    loop: true,
    autoplay: true, 
    animationData: noResultAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    },
  };

  return (
    <div className="cards-container" id="cards-container"  >
      {filteredCourses?.length>0? 
      <div className="course-list"  >
      {getDisplayedCourses().map((course, index) => (
          <CourseCrad key={index} course={course} index={index} />
        ))}
      </div>:(<div className="no-course">{noResult?
             <Lottie options={defaultOptions2}
             height={300}
             width={300}
             speed={1} 
             isStopped={false}
             isPaused={false}
             />: 
      
      // t('loading')+"..."
      <Lottie options={defaultOptions}
              height={200}
              width={200}
              isStopped={false}
              isPaused={false}
              />

      }</div>)} 
      {totalPages > 1 ? (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPageFunction(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPageFunction(index + 1)}
              className={`pagination-btn ${
                currentPage === index + 1 ? "btn-active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPageFunction(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default CourseList;
