import React ,{useContext} from "react";
import save from "../../../assets/icons/save.png";
import disabledSave from "../../../assets/icons/disabledSave.png";
import saveRed from "../../../assets/icons/saveRed.png";
import removeRed from "../../../assets/icons/removeRed.png";
import remove from "../../../assets/icons/remove.png";
import MyContext from "../../../Provider/MyContext";
import { useTranslation } from "react-i18next";
import "./SidebarGeneration.css"


const SidebarGeneration = ({
    sideButton,
    handleSideButton,
    handleOpenQuiteCourseCreationModal,
    generationCompleted,
    actionButton,
    setActionButton,
    handleOpenCreateCourseModal}) => {

    const {fragen} = useContext(MyContext);
    const { t } = useTranslation();

  return  <div className="sidebar-generation-container">
  <div
    className= {`side-bar-button ${ sideButton === "szene" ? "side-bar-btn-background":""} `}   
     onClick={() => handleSideButton("szene")}
  >
    {t('scene')}
  </div>
  {fragen?.length !== 0 && (
    <div
      className= {`side-bar-button ${ sideButton === "fragen" ? "side-bar-btn-background":""} `}
      onClick={() => handleSideButton("fragen")}
    >
      {t('questions')}
    </div>
  )}

  <div className="sidebar-generation-edit-btns">
    <div className="sidebar-generation-edit-btn">
      {actionButton !== "save" ? (
        generationCompleted ? (
          <img
            src={save}
            onClick={() => {
              handleOpenCreateCourseModal();
              setActionButton("save");
            }}
            alt="save"
            className="sidebar-generation-save-btn"
          />
        ) : (
          <img
            src={disabledSave}
            alt=""
            className="sidebar-generation-save-btn"
          />
        )
      ) : (
        <img
          src={saveRed}
          alt=""
          className="sidebar-generation-save-btn"
        />
      )}
    </div>
    <div className="sidebar-generation-edit-btn">
      {actionButton !== "remove" ? (
        <img
          src={remove}
          onClick={() => {
            handleOpenQuiteCourseCreationModal();
            setActionButton("remove");
          }}
          alt="remove"
          className="sidebar-generation-remove-btn"
        />
      ) : (
        <img
          src={removeRed}
          className="sidebar-generation-remove-btn"
          alt="remove"
        />
      )}
    </div>
  </div>
</div>
  

};

export default SidebarGeneration;
