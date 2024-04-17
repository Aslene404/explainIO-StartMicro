import React, {useContext,useState,useEffect} from "react";
import monolog from "../../assets/newProject/monolog.png";
import podcast from "../../assets/newProject/podcast.png";
import dialog from "../../assets/newProject/dialog.png";
import textReader from "../../assets/newProject/textReader.png";

import "./NewProject.css";
import { setBackgroundImage } from "../../utils/helpers";
import MyContext from '../../Provider/MyContext';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const NewProject = () => {

  const { setClickedType} =useContext(MyContext);
  const { t } = useTranslation();
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;

  }, []);

  setBackgroundImage(true);
  const navigate = useNavigate();
  const handleClick = (type) => {
   


    switch (type) {
      case "podcast":
        sessionStorage.setItem('hasReloaded', false); 
        setClickedType("podcast")
        break;
      case "dialog":
        sessionStorage.setItem('hasReloaded', false); 
        setClickedType("dialog")

        break;
        case "monolog":
          sessionStorage.setItem('hasReloaded', false); 
          setClickedType("monolog")

        break;
        case "textReader":
         // sessionStorage.setItem('hasReloaded', false); 
          setClickedType("textReader")

        break;
      default:
    }
    navigate("/loadScript");
  };
  return (
    <div className=" newProject " style={{width:"100%"}}>
      <p className= {`subtitle ${isArabic ? 'rtl' : 'ltr'}`}>{t('creationQuestion')}</p>
      <div className="newProject-container-images">
      <div className=" newProject-images" style={{justifyContent:isArabic?"flex-end":"flex-start", marginRight:isArabic? "50px":"0"}}>
          <div className="newProject-element">
          <img
            className="newProject-img"
            src={dialog}
            onClick={() => handleClick("dialog")}
             alt=""/>
           <div className="newProject-title">{t('dialogue')}</div>
          </div>
          <div className="newProject-element">
          <img
            className="newProject-img"
            src={monolog}
            onClick={() => handleClick("monolog")}
             alt=""/> 
           <div className="newProject-title">{t('monologue')}</div>
          </div>
          <div className="newProject-element">
          <img
            className="newProject-img"
            src={podcast}
            onClick={() => handleClick("podcast")}
             alt=""/>
           <div className="newProject-title">{t('podcast')}</div>
          </div>
          <div className="newProject-element">
          <img
            className="newProject-img"
            src={textReader}
            onClick={() => handleClick("textReader")}
             alt=""/>
           <div className="newProject-title">{t('TextReader')}</div>
          </div>
        </div></div>
    </div>
  );
};

export default NewProject;
