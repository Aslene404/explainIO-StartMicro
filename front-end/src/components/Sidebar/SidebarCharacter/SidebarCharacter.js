import React,{useContext} from "react";
import MyContext from "../../../Provider/MyContext";
import "./SidebarCharacter.css"
import { useTranslation } from "react-i18next";
import man from "../../../assets/man-user.png";
import woman from "../../../assets/woman-user.png";
const SidebarCharacter = () => {
  const {
    setSelectedCharacter,
    setSelectedAvatarInfo,
    setDisableStyle,
    selectedCharacter,
    clickedType,
    avatars} = useContext(MyContext);
      const { t } = useTranslation();

  const setCharacter1 = () => {
    setSelectedCharacter(1);

    setSelectedAvatarInfo(null);
    setDisableStyle(true);
  };
  const setCharacter2 = () => {

    setSelectedCharacter(2);

    setSelectedAvatarInfo(null);
    setDisableStyle(true);
  };
  return(
  <div className="sidebar-charakter-container">
  <div
    className={`charakter-item ${ selectedCharacter === 1 ? "active" : ""}`}
    onClick={setCharacter1}
  >
    <div className="sidebar-charakter-item">
      <div className="sidebar-charakter-image"  >
        <img
        className="charakter-image"
          src={
            avatars.avatarRight&&(clickedType==="podcast"||clickedType==="textReader")?avatars.avatarRight.sexe==="woman"?woman:man :avatars.avatarRight
              ? avatars.avatarRight.image
              : ""
          }
          alt="Selected Avatar"
          style={{
            paddingLeft: avatars.avatarRight?.name==="Sofia" ?  "25px" : "",
            height:avatars.avatarRight&&(clickedType==="podcast"||clickedType==="textReader")? "16vh":"40vh",
            marginTop:avatars.avatarRight&&(clickedType==="podcast"||clickedType==="textReader")? "0":"-5vh"  
          }}/>
      </div>
      <p className="sidebar-charakter-label">
        {clickedType === "monolog"
          ? t('character')
          : clickedType === "dialog" ?
          t('character')+" 1" : "Stimme"}

      </p>
    </div>
  </div>

  {(clickedType !== "monolog" && clickedType!=="podcast" && clickedType!=="textReader") && (
    <div
      className={`charakter-item ${
        selectedCharacter === 2 ? "active" : ""
      }`}
      onClick={setCharacter2}
    >
      <div className="sidebar-charakter-item"  >
        <div className="sidebar-charakter-image"  >
          <img
            className="charakter-image"
            src={
              avatars.avatarLeft
                ? avatars.avatarLeft.image
                : ""
            }
            alt="Selected Avatar"
            style={{
              paddingLeft: avatars.avatarRight?.name==="Sofia" ?  "25px" : "",
              height:avatars.avatarRight&&(clickedType==="podcast"||clickedType==="textReader")? "16vh":"40vh",
              marginTop:avatars.avatarRight&&(clickedType==="podcast"||clickedType==="textReader")? "0":"-5vh"  
            }}/>      
        </div>
        <p className="sidebar-charakter-label" >   
        {t('character')} 2
        </p>
      </div>
    </div>
  )}
</div>)
  

};

export default SidebarCharacter;
