/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import "./Character.css";
import MyContext from '../../Provider/MyContext';
import PopupWarning from "../Popups/PopupWarning/PopupWarning";
import { useTranslation } from "react-i18next";
import { languagevoices } from "../../Data/voices";

const Charakter = ( ) => {
  const { clickedType, setAvatars ,selectedCharacter,selectedVoice, setSelectedVoice ,selectedAvatarInfo,setSelectedAvatarInfo, setDisableStyle, selectedAvatar, setSelectedAvatar,

    disableStyle,selectedcharacter1, setSelectedcharacter1, selectedcharacter2, setSelectedcharacter2, choosedAvatars, setChoosedAvatars, textLanguage}=useContext(MyContext);
  const myAvatars = languagevoices(textLanguage);
  
  const { t } = useTranslation();
  
  const [audioRef, setAudioRef] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showModal,setShowModal]=useState(false)

  if (
    selectedCharacter === 1 &&
    selectedAvatarInfo &&
    selectedAvatarInfo !== selectedcharacter1
  ) {
    setSelectedcharacter1(selectedAvatarInfo);
    setAvatars((prevAvatars) => ({
      ...prevAvatars,
      avatarRight: {
        name: selectedAvatarInfo.name,
        voiceName: selectedAvatarInfo.voicesName[selectedVoice.voiceIndex ],
        image: selectedAvatarInfo.image,
        sexe:selectedAvatarInfo.sexe
      },
    }));
  }
  if (
    selectedCharacter === 2 &&
    selectedAvatarInfo &&
    selectedAvatarInfo !== selectedcharacter2
  ) {
    setSelectedcharacter2(selectedAvatarInfo);
    setAvatars((prevAvatars) => ({
      ...prevAvatars,
      avatarLeft: {
        name: selectedAvatarInfo.name,
        voiceName: selectedAvatarInfo?.voicesName[selectedVoice.voiceIndex],
        image: selectedAvatarInfo.image,
        sexe:selectedAvatarInfo.sexe
      },
    }));
  }

  const handleVoiceSelection = (avatarIndex, voiceIndex) => {
    setSelectedVoice({voiceIndex: voiceIndex, voiceName:myAvatars[avatarIndex].voicesName[voiceIndex]
    });
    if (selectedCharacter === 1) {
      setAvatars((prevAvatars) => ({
        ...prevAvatars,
        avatarRight: {
          name:myAvatars[avatarIndex].name,
          voiceName:myAvatars[avatarIndex].voicesName[voiceIndex],
          image:myAvatars[avatarIndex].image,
          sexe:myAvatars[avatarIndex].sexe
        },
      }));
      
    setChoosedAvatars((prevVal)=>{
      let tab=prevVal;
      tab[0]={...tab[0],voiceIndex:voiceIndex}
      return tab
    }) }
    else if (selectedCharacter === 2)  {
      setAvatars((prevAvatars) => ({
        ...prevAvatars,
        avatarLeft: {
          name:myAvatars[avatarIndex].name,
          voiceName:myAvatars[avatarIndex].voicesName[voiceIndex],
          image:myAvatars[avatarIndex].image,
          sexe:myAvatars[avatarIndex].sexe
        },
      }));
      
      setChoosedAvatars((prevVal)=>{
      let tab=prevVal;
      tab[1]={...tab[1],voiceIndex:voiceIndex}
      return tab
    }) }

    setSelectedAvatarInfo((prevInfo)=>{
      return {
        ...prevInfo,
        voiceName:myAvatars[avatarIndex].voices[voiceIndex]
      }
    });
  
  
    
    const newAudio = new Audio(myAvatars[avatarIndex].voices[voiceIndex]);
 
    if (audioRef) {
      if (audioRef.paused) {
        audioRef.play().catch((error) => {
          console.error("Play error:", error);
        });
      } else {
        audioRef.pause();
      }}

    if (audioRef && selectedAvatar === avatarIndex && selectedVoice.voiceIndex===voiceIndex) {
      if (audioRef.paused) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    } else {
      if (audioRef) {
        audioRef.pause();
      }

      newAudio.play();
      setAudioRef(newAudio);

      newAudio.addEventListener("timeupdate", () => {
        setProgress((newAudio.currentTime / newAudio.duration) * 100);
      });
    }
  };
  
  
  const handleAvatarSelection = (avatarIndex,voiceindex) => {
     if(clickedType==="dialog" || clickedType==="monolog"){setAudioRef(null)}
  
    if (
      (selectedCharacter === 1 && selectedcharacter2 && selectedcharacter2.image ===myAvatars[avatarIndex].image) ||
      (selectedCharacter === 2 && selectedcharacter1 && selectedcharacter1.image ===myAvatars[avatarIndex].image)){
      setShowModal(true)
      setTimeout(()=>{setShowModal(false)},500)
      return;
    }
    selectedCharacter === 1 ? setChoosedAvatars((prevVal)=>{
      let tab=prevVal;
      tab[0]={...tab[0],avatarindex:avatarIndex,voiceIndex:voiceindex}
      return tab
    }) : setChoosedAvatars((prevVal)=>{
      let tab=prevVal;
      tab[1]={...tab[1],avatarindex:avatarIndex,voiceIndex:voiceindex}
      return tab
    }) 
    setSelectedAvatar(avatarIndex);
    setSelectedVoice({voiceIndex: voiceindex, voiceName:myAvatars[avatarIndex].voicesName[voiceindex]
    });    setSelectedAvatarInfo(myAvatars[avatarIndex]);
    setDisableStyle(false);
  
   
  };
  

  const handlePause = (index) => {
    if (audioRef && !audioRef.paused && selectedAvatar === index) {
        audioRef.pause();
    }
};

const handlePlay = (index) => {
  if (audioRef && audioRef.paused && selectedAvatar === index ) {
      audioRef.play();
  }
};


 useEffect(() => {
    const handleWindowClick = (event) => {
      if ((!event.target.closest(".avatar-container")) && audioRef && !audioRef.paused) {
        audioRef.pause();
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }

      window.removeEventListener("click", handleWindowClick);
    };
  }, [audioRef]);

  const getColor=(index, voiceinedex)=>{
    let color ="#3C3C3C"; 
    if(choosedAvatars[0].avatarindex===index||choosedAvatars[1].avatarindex===index)
    {
      color="#7a7979"
      if((choosedAvatars[0].avatarindex===index&&choosedAvatars[0].voiceIndex===voiceinedex)||(choosedAvatars[1].avatarindex===index&&choosedAvatars[1].voiceIndex===voiceinedex))
      {
        color="rgb(222, 59, 59)"
      }
         
    }
  return color 
  }

  useEffect(()=>{
     
    console.log("-------- selected Avatar ------------", selectedAvatar);
    console.log("-------- selected Voice ------------", selectedVoice);
  

  },[selectedAvatar, selectedVoice]);

  return (
    <div className="character-container">
      <div
        className="character-podcast"
      >  {(clickedType==="podcast"|| clickedType==="textReader") ? (myAvatars.map(( avatar, index) => (
        avatar.voices.map((voice,voiceindex)=>{
       return  <div
          key={voiceindex}
          className={`avatar-container ${
            (selectedAvatar === index && selectedVoice.voiceIndex === voiceindex   )? "selected-podcast" : ""
          }`} 
        >
          <div className="custom-audio-podcast">
          <button
  className="custom-audio-button"
  onClick={() => {
    setSelectedVoice({voiceIndex: voiceindex, voiceName: voice})
    setSelectedAvatar(index);
    handleVoiceSelection(index,voiceindex)
    handleAvatarSelection(index,voiceindex);
    (audioRef && !audioRef.paused && selectedAvatar === index && selectedVoice.voiceIndex === voiceindex) ?
    handlePause(index) : handlePlay(index)
  }}
  style={{ height: selectedAvatar === index && selectedVoice.voiceIndex === voiceindex ? 80 : 110 }}
>
  {selectedAvatar === index &&selectedVoice.voiceIndex === voiceindex && audioRef && !audioRef.paused ? (
    <FontAwesomeIcon
      icon={faPause}
      className="custom-audio-button-icon"
    />
  ) : (
    <FontAwesomeIcon
      icon={faPlay}
      className="custom-audio-button-icon"
    />
  )}
</button>
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-indicator"
                  style={{
                    marginLeft:
                      selectedAvatar === index && selectedVoice.voiceIndex === voiceindex ? `${progress}%` : "",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>   
        }) 
      ))): (myAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`avatar-container ${
            (selectedAvatar === index && !disableStyle )? "selected-avatar" : ""
          }`} style={{ width: "28%", maxWidth: "400px" ,display:"flex", flexDirection:"column",
            alignItems:"center",minWidth: "230px"}}
        >
          <img onClick={() => handleAvatarSelection(index,0)} src={avatar.image} alt={avatar.name} style={{ cursor:"pointer", height: selectedAvatar === index ? "28vh" : "31vh",minHeight:230 }} />
          {avatar.voices.map((voice, voiceindex) => (
 <div className="custom-audio-container mb-2"  key={voiceindex}
 style={{
  backgroundColor:getColor(index, voiceindex),
  width: "55%" 
}}
 >
 <button
 style={{
 color: selectedAvatar === index ? (selectedVoice.voiceIndex==null? "##ffffff":(selectedVoice.voiceIndex === voiceindex ? "#ffffff":"lightGray")) :"##ffffff"
 }}
   className="custom-audio-button"
    onClick={() => {
      if(selectedAvatar === index)
      {
        handleVoiceSelection(index,voiceindex)
      }
      selectedAvatar === index && selectedVoice.voiceIndex === voiceindex && audioRef && !audioRef.paused ? handlePause(index) : handlePlay(index)
    }}>
   {selectedAvatar === index  && selectedVoice.voiceIndex === voiceindex && audioRef && !audioRef.paused ? (
     <FontAwesomeIcon
       icon={faPause}
       className="custom-audio-button-icon"
   
     />
   ) : (
     <FontAwesomeIcon
       icon={faPlay}
       className="custom-audio-button-icon"
      style={{ fontSize: "20px"}}
     />
   )}
 </button>
 <div className="progress-container">
   <div className="progress-bar">
     <div
       className="progress-indicator"
       style={{
         backgroundColor:(choosedAvatars[0].avatarindex===index||choosedAvatars[1].avatarindex===index)?"#ffffff" :"#E11B19",
         marginLeft:selectedAvatar === index  && selectedVoice.voiceIndex === voiceindex  ? `${progress}%` : "",
       }}
     ></div>
   </div>
 </div>
</div>
          ))}
         
        </div>
      )))}
        
      </div>
      <PopupWarning  text={t('noMatchingAvatar')} show={showModal}/>
    </div>
  );
};

export default Charakter;

