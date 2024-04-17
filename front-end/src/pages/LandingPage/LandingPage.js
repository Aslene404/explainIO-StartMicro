/* eslint-disable jsx-a11y/anchor-is-valid */
import React,{useEffect,useState} from 'react';
import "./LandingPage.css";
import logo from '../../assets/logoIcon.png';
import buttonPicture from '../../assets/button.png';
import { useNavigate } from 'react-router-dom';
import { setBackgroundImage} from '../../utils/helpers';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import translations from './LandingPage.json';

const loadTranslations = async (language) => {
  await i18n.use(initReactI18next) 
  .init({ 
    resources: translations,
    lng: language,
  });

};

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  setBackgroundImage(false);


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
  
  
   const handleNavigate =() =>{
    navigate("/login");
   }

  

  return (
    <div  className='Landing-content' >
      <div className='Landing-content-logo'>
        <img className='Landing-content-image rotating-image' src={logo} alt="logoExplainIO" />
        <h6  className='Landing-content-title'>EXPLAINIO</h6>
      </div>
      <div className='Landing-content-content' > 
        <p className={`Landing-content-firstParagraphe   ${language==='ar-XA' ? 'rtl' : 'ltr'}`}>{t("fewStepsToCreation")}</p>
        <p className={`Landing-content-secondParagraphe   ${language==='ar-XA' ? 'rtl' : 'ltr'}`}>{t("welcomeMessage")}</p>
      </div>
      <a className='Landing-content-button' onClick={handleNavigate} type="">{t("startYourCreation")} <img className="button-image" src={buttonPicture} alt="" /></a>
      <div className="version">
          V1.0.6

        </div>
    </div>
  )
}

export default LandingPage;