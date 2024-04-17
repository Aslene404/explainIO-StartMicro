/* eslint-disable react-hooks/exhaustive-deps */
import React, {  useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import removeRed from "../../assets/icons/removeRed.png";
import remove from "../../assets/icons/remove.png";
import logo from "../../assets/logoIcon.png";
import comWhite from "../../assets/icons/comWhite.png";
import comRed from "../../assets/icons/comRed.png";
import unchecked from "../../assets/unchecked.png";
import checked from "../../assets/checked.png";
import "./LeftBarCourse.css";
import { auth } from "../../Firebase";
import MyContext from "../../Provider/MyContext";
import { useTranslation } from "react-i18next";


const LeftBar = ({
  sideButton,
  handleSideButton,
  handleFreigeben,
  showMyDeleteModel,
  setShowMyDeleteModel,
  courseData,
}) => {
  const {updateMode, setUpdateMode, setShowSideBar} = useContext(MyContext);
  const { t } = useTranslation();

useEffect(()=>{
    console.log("---------------------courseData---------------", courseData);
},[courseData])
 const  handleModeUpdateToggle =()=>{
 setUpdateMode((prev)=>!prev)}

 useEffect(()=>{
  setUpdateMode(false)
 },[])

 const getCurrentUserName=()=>{

  const user = auth.currentUser.email;
  const extractedUsername = user.split("@")[0];
  const usernameWithSpace = extractedUsername.replace(".", " ");
  return usernameWithSpace ;
}



 useEffect(()=>{
  if(!updateMode)
  {setShowSideBar(false)}
 },[updateMode])

 
  return (
    <div className="left-bar">
      <Link to="/home" className="left-bar-logo-container">
        <div className="left-bar-logo">
          <img src={logo} alt="Logo" />
          <span className="logo-name">EXPLAINIO</span>
        </div>
      </Link>
      <div className="left-bar-buttons-container">
        <div className="left-bar-buttons">
          <div
            className="side-bar-button"
            style={{ background: sideButton === "szene" ? "#e11b19" : "" }}
            onClick={() => handleSideButton("szene")}
          >
            {t('scene')}
          </div>
          {courseData && courseData.Fragen && courseData.Fragen.length !== 0 ? (
            <div
              className="side-bar-button"
              style={{ background: sideButton === "fragen" ? "#e11b19" : "" }}
              onClick={() => handleSideButton("fragen")}
            >
              {t('questions')}
            </div>
          ) : (
            ""
          )}
          {auth.currentUser &&
            auth.currentUser.email&& getCurrentUserName()===courseData?.courseOwner&&
             (
              <div className="privacy-btn" onClick={() => handleFreigeben()}>
                {courseData?.CoursePrivacy ? (
                  <img src={checked} alt="" className="privacy-btn-img" />
                ) : (
                  <img src={unchecked} alt="" className="privacy-btn-img" />
                )}
                {t('release')}
              </div>
            )}

          <div className="comment-btn" onClick={() => handleSideButton("com")}>
            {sideButton !== "com" ? (
              <img src={comWhite} alt="comment" className="comment-img" />
            ) : (
              <img src={comRed} alt="comment" className="comment-img" />
            )}
          </div>
          {auth.currentUser &&
          auth.currentUser.email && getCurrentUserName()===courseData?.courseOwner? (
            <div className="edit-btns">
              <div className="delete-btn">
                {showMyDeleteModel === false ? (
                  <img
                    src={remove}
                    onClick={() => {
                      setShowMyDeleteModel(true);
                    }}
                    alt="delete"
                    className="delete-btn-img"
                  />
                ) : (
                  <img
                    src={removeRed}
                    alt="remove"
                    className="delete-btn-img"
                  />
                )}
              </div>
              {!courseData?.CoursePrivacy && getCurrentUserName()===courseData?.courseOwner&& (
                  
                <div className="check-box">
                  <input
                    type="checkbox"
                    checked={updateMode}
                    onChange={handleModeUpdateToggle}
                  />
                  <div className="edit-label">
                  {t('modeUpdate')}                  
                  </div>
                </div>

              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
