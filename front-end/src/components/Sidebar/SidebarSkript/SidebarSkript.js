/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import add from "../../../assets/icons/addScene.png";
import office from "../../../assets/backgrounds/office.jpg";
import modern_office from "../../../assets/backgrounds/modern_office.png";
import classroom from "../../../assets/backgrounds/classroom.png";
import playground from "../../../assets/backgrounds/playground.png";
import voice from "../../../assets/voice.PNG";
import MyContext from "../../../Provider/MyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./SidebarSkript.css";
import { useTranslation } from "react-i18next";

const SidebarSkript = ({
  handleOpenMyModal,
  showMyModal,
  scenes,
  selectedItem
}) => {
  const {
    clickedScene,
    setClickedScene,
    clickedType,
     setEditScene,
     setShowDeleteConfirmation,setSceneToDelete,mode
  } = useContext(MyContext);
  
  const { t } = useTranslation();

  useEffect(() => {
    if (scenes && scenes.length > 0 &&selectedItem==='Skript') {
      setClickedScene(scenes[scenes.length - 1]);
    }
  }, [scenes, setClickedScene]);

  const handleDeleteClick = (scene) => {
    setSceneToDelete(scene);
    setShowDeleteConfirmation(true);
  };

  const handleClick = (scene) => {
    setClickedScene(scene);
  };

  const getSceneImage = (sceneImage) => {
    switch (sceneImage) {
      case "Büro":
        return office;
      case "Modernes Büro":
        return modern_office;
      case "ClassrKlassenzimmeroom":
        return classroom;
      case "Garten":
        return playground;
      default:
        return "";
    }
  };

  const handleEditScene = (scene) => {
    setEditScene(scene);
  };
  
  return (
    <div >
      <div >
        <div style={{ overflowY: "auto", height:scenes.length>3? "65vh": "71vh" }}>
        {scenes?.map((scene, index) => (
          <div
            key={index}
            className={`scene ${clickedScene === scene ? "selected" : ""}`}
            onClick={() => handleClick(scene)}>
            {selectedItem==='Skript'&&selectedItem==='Skript' && (
              <div className="edit-btns-sidebar">
                <div
                  className="edit-btn-sidebar"
                  onClick={() => handleEditScene(scene)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </div>

                <div
                  className="edit-btn-sidebar"
                  onClick={() => handleDeleteClick(scene)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>
            )}
            {(clickedType === "podcast" ||clickedType==="textReader") ? (
              <img src={voice} alt={`Scene ${index}`} className="scene-img" />
            ) : (
              <img
                src={getSceneImage(scene.sceneLocation)}
                alt={`Scene ${index}`}
                className="scene-img"
              />
            )}
            <div
              className="scene-title"
              style={{
                backgroundColor: clickedScene === scene ? "red" : "grey",
              }}
            >
              {scene.sceneTitle}
            </div>
          </div>
        ))}
        
        {scenes && scenes.length < 4 && selectedItem==='Skript' && (
          (mode && mode==='Manual mode')&&
          <div
            onClick={handleOpenMyModal}
            className="side-bar-item"
            style={{
              background: showMyModal ? "var(--6-e-82-e-2-c, #E11B19)" : "",
            }}
          >
            <img src={add} alt="" className="item-img" />
            <span className="item-name">{t('scene')}</span>
          </div>
        )}
        </div>
      
        {scenes && scenes.length >= 4 && selectedItem==='Skript'&& (
          <div
            onClick={handleOpenMyModal}
            className="side-bar-item"
            style={{
              background: showMyModal ? "var(--6-e-82-e-2-c, #E11B19)" : "",
            }}
          >
            <img src={add} alt="" className="item-img" />
            <span className="item-name">{t('scene')}</span>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default SidebarSkript;
