/* eslint-disable array-callback-return */
import React , {useContext,useState} from "react";
import MyContext from "../../Provider/MyContext";
import "./Sidebar.css"
import NewScene from "../../components/Popups/NewScenePopUp/NewScenePopUp";
import PopupMultipleBtn from "../../components/Popups/PopupMultipleBtn/PopupMultipleBtn";
import NewCoursePopUp from "../../components/Popups/NewCoursePopUp/NewCoursePopUp";
import { firestore,auth } from "../../Firebase";
import { collection, getDocs ,query, where, updateDoc , doc } from "firebase/firestore";

import {useNavigate } from "react-router-dom";
import SidebarQuestion from "./SidebarQuestion/SidebarQuestion";

import SidebarCharacter from "./SidebarCharacter/SidebarCharacter";
import SidebarGeneration from "./SidebarGeneration/SidebarGeneration";
import SidebarSkript from "./SidebarSkript/SidebarSkript";
import {getCurrentUserName, getCurrentDate} from "../../utils/helpers";
import Logo from "../Logo/Logo";
import { useTranslation } from "react-i18next";

const Sidebar = ({
    pdfData,
    generation,
    showMyModal,
    showCreateCourseModal,
    showQuiteCreationModal,
    selectedItem,
    scenes,
    setScenes, 
    setTitle,
    setShowQuiteCreationModal,
    setShowMyModal,
    setShowCreateCourseModal,
    setSideButton,
    sideButton,
    generationCompleted
}) => {
  const navigate = useNavigate()
   
    const [actionButton, setActionButton] = useState("");
    const {
        fragen,
        fragenModal,
        clickedType,
        setCurrentFrage,
        setSelectedCharakter,
        setSelectedAvatarInfo,
        setDisableStyle,
        setClickedScene,
        setFirstScene,
        setChapters,
        setMyScenes,
        setFragen,
        setAvatars,
        setClickedType,
        setVideos,
        videos,
        existingScenesTitles,
        setExistingScenesTitles,
        clickedScene,
        EditScene,
        textLanguage,
        setEditScene,sceneToDelete, setSceneToDelete,
        showDeleteConfirmation, setShowDeleteConfirmation,setBlockProcess,
    myScenes,
      } = useContext(MyContext);
      const { t } = useTranslation();

      
  

  const isInMyScenes = (scene) => {
    const isIn =
      myScenes &&
      myScenes.length > 0 &&
      myScenes.find((myScene) => myScene.sceneTitle === scene.sceneTitle);
    return isIn;
  };

  const handleConfirmDelete = () => {
    if (sceneToDelete) {
      const updatedScenes = scenes.filter((s) => s !== sceneToDelete);
      setScenes(updatedScenes);
      const updtatedScenesTitles = existingScenesTitles.filter((s) => s !== sceneToDelete.sceneTitle);
      setExistingScenesTitles(updtatedScenesTitles);
      if (clickedScene === sceneToDelete) {
        setClickedScene(null);
      }
      const isSceneInMyScenes = isInMyScenes(sceneToDelete);

      setSceneToDelete(null);
      setShowDeleteConfirmation(false);
      if (isSceneInMyScenes) {
       const  updatedMyScenes = myScenes.filter(
          (myScene) => myScene.sceneTitle !== sceneToDelete.sceneTitle
        );
        setMyScenes(updatedMyScenes);
      }
      let chapExist=false
      updatedScenes.map((scene)=>{
       if(isInMyScenes(scene)) {chapExist=true} 
      })
      if(updatedScenes.length===0 || !chapExist){
          setBlockProcess(true) 
        }
    }
  };

  const handleConfirmEdit = (data) => {
    if (EditScene) {
      const updatedScenes = scenes.map((scene) =>
        scene === EditScene ? { ...scene, ...data } : scene
      );
      const updatedScenesTitle = scenes.map((scene) =>
        scene.sceneTitle === EditScene.sceneTitle ? { ...scene.sceneTitle, ...data } : scene.sceneTitle
      );
      setExistingScenesTitles(updatedScenesTitle);
      setScenes(updatedScenes);
      setClickedScene(updatedScenes.find((scene) => scene === EditScene));

      const isSceneInMyScenes = isInMyScenes(EditScene);

      if (isSceneInMyScenes) {
        const updatedMyScenes = myScenes.map((myScene) =>
          myScene.sceneTitle === EditScene.sceneTitle
            ? { ...myScene, ...data }
            : myScene
        );
        setMyScenes(updatedMyScenes);
      }
    }

    setEditScene(null);
  };

  const handleCancelDelete = () => {
    setSceneToDelete(null);
    setShowDeleteConfirmation(false);
  };
  const handleEditSceneClose = () => {
    setEditScene(null);
  };


  const handleOpenMyModal = () => {
        setShowMyModal(true);
      };

  const handleCloseQuiteCourseCreationModal = () => {
        setShowQuiteCreationModal(false);
        setActionButton("");
      };

  const handleSideBarItem = (data) => {
        
        setScenes([...scenes, data]);
        if (scenes.length >= 1) {
          setFirstScene(scenes[0]);
        } else {
          setClickedScene(scenes);
        }
        setExistingScenesTitles([...existingScenesTitles, data.sceneTitle]);
      };
    
  const quitCourse=(e)=>{
        e.preventDefault();
        try {
          navigate("/home");
          setShowQuiteCreationModal(false);
          setChapters([]);
          setMyScenes([]);
          setFragen([]);
          setAvatars({
            avatarRight: {},
            avatarLeft: {},
          });
          setClickedScene(null);
          setClickedType(null);
          setCurrentFrage(null);
          setVideos([]);
          setSelectedCharakter(1);
          setSelectedAvatarInfo(null);
          setDisableStyle(false);
        } catch (error) {}
      }

  const handleCloseCreateCourseModal = () => {
        setShowCreateCourseModal(false);
        setActionButton("");
      };

  const handleCloseMyModal = () => {
    setShowMyModal(false);
  };

  const handleOpenCreateCourseModal = () => {
    setShowCreateCourseModal(true);
  };

  const handleOpenQuiteCourseCreationModal = () => {
        setShowQuiteCreationModal(true);
      };   

  const handleSideButton = (button) => {
        setSideButton(button);
      };
      
  const handleConfirm = async (data) => {
        const { title, freigeben } = data;
        try {
          const courseCollection = firestore.collection("Courses");
          const courseData = {
            Title: title,
            Fragen: fragen,
            Scenes: videos,
            courseOwner: getCurrentUserName(),
            CoursePrivacy: freigeben,
            type: clickedType,
            language: textLanguage,
            CoursePicture:
              (clickedType === "podcast")
                ? "uploads/voice.PNG" :
                (clickedType ==="textReader") ?
               "uploads/reader.png" 
               : videos[0].file_name + "-thumbnail",
            rating: 0,
            creationDate: getCurrentDate(),
          };
          const docRef = await courseCollection.add(courseData);
          const courseId = docRef.id;
    
          await courseCollection.doc(courseId).update({
            courseId: courseId,
          });

          const userCollection = collection(firestore,"User");
          console.log("-----------userCollection----------", userCollection)
          const q = query(userCollection, where("email", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(q);
        
          console.log("querySnapshot.docs:", querySnapshot.docs);
          
          if (querySnapshot.docs.length > 0) {

            console.log("Document found");
            const docId = querySnapshot.docs[0].id;
            const userData = querySnapshot.docs[0].data(); 
            console.log("userData.nbEssay:", userData.nbEssay);
            console.log("typeof userData.nbEssay:", typeof userData.nbEssay);
            const updatedNbEssay = userData.nbEssay + 1; 
            await updateDoc(doc(userCollection, docId), { nbEssay: updatedNbEssay,paymentStatus:updatedNbEssay>3?false:true  }); 
            console.log("----------------wsel ll update ou pas");
          } else {
            console.log("Document not found");
          }
        } catch (error) {
          console.error("Error adding data to the collection: ", error);
        }
      };

     
  return <> <div
  className={`left-bar  leftbar-mode  ${
    showMyModal ||
    showCreateCourseModal ||
    fragenModal ||
    showQuiteCreationModal
      ? "content-blur"
      : ""
  }`}
>
<div style={{ height: "18vh", minHeight: 110,display:"flex" }}>
           <Logo 
            generation={generation} 
            handleOpenQuiteCourseCreationModal={handleOpenQuiteCourseCreationModal}/>
</div>
<div>
    {pdfData && (
      <div>
        {(selectedItem === "Skript"  || selectedItem === ("Dialog" )) &&  
        <SidebarSkript  
         handleOpenMyModal={handleOpenMyModal}
          showMyModal={showMyModal} 
          scenes={scenes} 
          setScenes={setScenes} 
          setExistingScenesTiltes={setExistingScenesTitles}
          existingScenesTitles={existingScenesTitles}
          selectedItem={selectedItem} />
          }
        
        {selectedItem === "Fragen" && 
        <SidebarQuestion />
        }
        
        {selectedItem === "Charakter" && !generation && 
        <SidebarCharacter/>
        }
        
        {generation && 
        <SidebarGeneration 
         sideButton={sideButton} 
         handleSideButton={handleSideButton} 
         handleOpenQuiteCourseCreationModal={handleOpenQuiteCourseCreationModal}
         generationCompleted={generationCompleted} 
         actionButton={actionButton} 
         setActionButton={setActionButton} 
         handleOpenCreateCourseModal={handleOpenCreateCourseModal} />
         }
      </div>
    )}
  </div>
</div>

{(showMyModal) && (
          <div className="popup">
          <NewScene
            setTitle={setTitle}
              show={handleOpenMyModal}
              onClose={handleCloseMyModal}
              sideBarItem={handleSideBarItem}
              existingSceneTitles={existingScenesTitles}
            />
          </div>
        )}

          <NewCoursePopUp
              show={showCreateCourseModal}
              onClose={handleCloseCreateCourseModal}
              onConfirm={handleConfirm} />

           <PopupMultipleBtn  
           show={showQuiteCreationModal}
           text={t('exitWithoutSaving')}
           btns={[
            {text: t('ok'),fn:quitCourse},
            {text:t('cancel'),fn:handleCloseQuiteCourseCreationModal}]} />

<PopupMultipleBtn
          show={showDeleteConfirmation}
          text={t('deleteSceneConfirmation')}
          btns={[
            { text: "Ok", fn: handleConfirmDelete },
            { text: "Cancel", fn: handleCancelDelete },
          ]}
        />
        {EditScene && (
          <NewScene
            show={EditScene}
            onClose={handleEditSceneClose}
            sideBarItem={handleConfirmEdit}
            existingSceneTitles={scenes.map((scene) => scene.sceneTitle)}
            setTitle={setClickedScene}
            clickedScene={clickedScene}
          />
        )}
</>

  

};

export default Sidebar;