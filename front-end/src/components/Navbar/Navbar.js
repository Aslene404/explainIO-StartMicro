/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import logo from "../../assets/logoIcon.png";
import iconHome from "../../assets/navbar/iconHome.png";
import file from "../../assets/navbar/file.png";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Logout from "../../pages/Logout/Logout";
import { auth } from "../../Firebase";
import { useTranslation } from 'react-i18next';
import SettingPopup from "../Popups/SettingPopup/SettingPopup";

const Navbar = () => {
  
  const [activeButton, setActiveButton] = useState("start");
  const [isNavbarMode, setIsNavbarMode] = useState("false");
  const [show, setShow] = useState(false);
  const [ t ] = useTranslation();
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;

  }, []);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    localStorage.setItem("activeButton", button);
  };

  useEffect(() => {
    const storedActiveButton = localStorage.getItem("activeButton");
    if (storedActiveButton) {
      setActiveButton(storedActiveButton);
    }
  }, []);

  const handleMenuToggle = () => {
    const sideBar = document.querySelector('.side_bar');
    if ( sideBar.style.transform === 'translateX(-100%)') {
          sideBar.style.transform = 'translateX(0%)'
          setIsNavbarMode(true)
    }
    else{
      sideBar.style.transform = 'translateX(-100%)'

    }
;
  };


 const onClose =()=>{
  setShow(false)
  window.location.reload();
 }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sideBar = document.querySelector('.side_bar');
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
    <div>
       <div className="menu-button" onClick={() => handleMenuToggle()}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`side_bar side_bar_container ${isArabic ? 'rtlSide' : 'ltrSide'}`} >
      <div className="side_bar-logo"  >
        <img
        className="logo-img-nav"
          src={logo}
          alt="logo"
        />
        <span className="logo-name-nav">EXPLAINIO</span>
      </div>
      <div className="nav-btns">
        <a className="nav-btn-link" href="" >
          <div
            onClick={() => handleButtonClick("start")}
            className={`nav-btn ${
              activeButton === "start" ? "active-btn" : ""
            }`}
          > 
            <img src={iconHome} alt="" className="nav-btn-img"/>
            <span className="btn-name">{t('start')}</span>
          </div>
        </a>
        
         <a className="nav-btn-link" href="" >
          <div
            onClick={() => handleButtonClick("Neues Projekt")}
            className={`nav-btn ${
              activeButton === "Neues Projekt" ? "active-btn" : ""
            }`}
          >
            <img src={file} alt="" className="nav-btn-img"/>
            <span className="btn-name">{t('newProject')}</span>
          </div>
        </a>
      </div>
      <div >
        <div className="div-bar"></div>
        <button className="last-name me-3" style={{ position: "fixed", bottom: 50 , color:"darkgray", border:"none", backgroundColor:"transparent"}} 
        onClick={()=>{  setShow(true)}}>
        {t('settings')}
        </button>
        <span className="last-name" style={{ position: "fixed", bottom: 10 }}>
          <Logout></Logout>
        </span>
      </div>
    </div>
    <SettingPopup text="here we are" show={show} onClose={onClose} />
   
    </div>
  );
};

export default Navbar;