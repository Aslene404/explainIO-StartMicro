import React, { useEffect, useContext, useState } from "react";
import "./ModePopup.css";
import MyContext from "../../../Provider/MyContext";
import { useTranslation } from "react-i18next";
import { buttonFunctions } from "../../TopBar/buttonFunctions";


import unchecked from "../../../assets/unchecked.png";
import checked from "../../../assets/checked.png";
import info from "../../../assets/Info.png";
import effacer from "../../../assets/effacer.png";
import CustomTextarea from "../../CustomTextarea/CustomTextarea"

const ModePopup = ({ show, onClose, onConfirm, loading,setScenes, setSelectedItem,setResponseData,setActiveItem }) => {

  const {mode, setMode, setMyScenes,setIsPopUpCanceled,autoModeChapters,setautoModeChapters,previousSkript,setVisitedSections,activeIndex, setActiveIndex,setNewSelectionExist,setFragenUpdatedAfterSelection,setPdfError,
  myScenes, clickedType, firstScene,setClickedScene, setWaitingResponse,setBlockProcess,setProcessCompleted, reloadNumber, totalRequests, setTimeOut, setLoading,textLanguage, setChapters,} = useContext(MyContext);


  const [focusedLine, setFocusedLine] = useState(null);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [scenesChapters, setScenesChapters] = useState([]);
  const [selectedChapterContent, setSelectedChapterContent] = useState(null);
  const [errorName, setErrorName] = useState(null);
  const items = clickedType==="textReader"? ["Skript", "Charakter"]:["Skript", "Dialog", "Fragen", "Charakter"];
  
  const [sceneData, setSceneData] = useState({
    sceneTitle: "",
    sceneLocation: "Büro",
  });
  const { t } = useTranslation();
  const handleMode = () => {
    
    setMode("Manual mode")
    onClose();
  };

 
  const onAutomaticMode = () => {
    onConfirm();
  };

  const handleSceneTitleChange = (e) => {
    setErrorName(null)
    const inputValue = e.target.value;
    setSceneData({
      ...sceneData,
      sceneTitle: inputValue,
    });
  };

  const handleSubmitChapters = () => {
    setIsPopUpCanceled(true);
    let buttonFunction;
    if (clickedType !== "textReader") {
       buttonFunction = buttonFunctions["createDialog"];
       if (buttonFunction) {
          buttonFunction({
             myScenes, clickedType, firstScene, setClickedScene, setWaitingResponse, setResponseData, setSelectedItem, setBlockProcess, setProcessCompleted, reloadNumber, totalRequests, setTimeOut, setLoading, textLanguage, setPdfError
          });
       }
       setVisitedSections((prevSections) => {
        console.log("je l houni");
          return prevSections.includes("Dialog")
             ? prevSections
             : [...prevSections, items[items.length - 3]];
       });
    } else {
       console.log("jet l textReader ");
       setVisitedSections((prevSections) => {
        return prevSections.includes("Charakter")
          ? prevSections
          : [...prevSections, items[items.length-1]];
      });
       console.log("jet l houni ");
       setBlockProcess(false);
      setSelectedItem("Charakter");
    }
    onClose();
 };
 
  const handleSceneLocationChange = (e) => {
    setSceneData({
      ...sceneData,
      sceneLocation: e.target.value,
    });
  };

  const handleDeleteChapter = (selectedchap) => {
    setSelectedChapters((prev) => {
      const result = prev.filter((chap) => {
        return (
          selectedchap.content !== chap.content
        );
      });
      return result;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (sceneData.sceneTitle) {
      const findedSceneIndex=myScenes.findIndex((scene)=>scene.sceneTitle === sceneData.sceneTitle)
            setNewSelectionExist(true)
            setFragenUpdatedAfterSelection(true)
      if (findedSceneIndex!== -1) {
        setMyScenes((prev) => {
          setScenesChapters((prev) => [...prev, ...selectedChapters]);
         const  updatedScenes= prev.map((scene)=>{if(scene.sceneTitle===sceneData.sceneTitle && scene.sceneLocation===sceneData.sceneLocation){
            return {...scene, sceneChapters:
              
              [...scene.sceneChapters.map((chap, index)=>{
              if(index===0){return {...chap,position:"first"}
            }else
            {return {...chap, position:"middle"}}
              }),...selectedChapters.map((chap,index)=>{
                if(selectedChapters.length===1)
                {
                  return {...chap, position:"last"}
                } else if(index===selectedChapters.length-1)
                {
                  return {...chap, position:"last"}  
                } else {
                  return {...chap, position:"middle"}
                }
              })]
            
            }
          } else {
            return scene
          }})
          return updatedScenes;
        });
        
        setSelectedChapters([]);
        setSceneData({
          sceneTitle:"",
          sceneLocation: "Büro",
        });
        setChapters(prev => {
          const newChapters = prev.slice();
          selectedChapters.forEach(chapter => {
            newChapters.push({
              title: chapter.title,
              content: chapter.content,
              sceneTitle: sceneData.sceneTitle,
              sceneLocation: sceneData.sceneLocation
            });
          });
          return newChapters;
        });
      } else {
          setScenesChapters((prev) => [...prev, ...selectedChapters]);
          setScenes((prev)=>{
            return [ ...prev, {sceneTitle: sceneData.sceneTitle, sceneLocation: sceneData.sceneLocation} ];
          })
          setChapters(prev => {
            const newChapters = prev.slice();
            selectedChapters.forEach(chapter => {
              newChapters.push({
                title: chapter.title,
                content: chapter.content,
                sceneTitle: sceneData.sceneTitle,
                sceneLocation: sceneData.sceneLocation
              });
            });
            return newChapters;
          });
        
          setMyScenes((prev) => {
            const updatedChapters = selectedChapters.map((chapter, index) => {
              let position = "";
              if (selectedChapters.length === 1) {
                position = "first&last";
              } else if (index === 0) {
                position = "first";
              } else if (index === selectedChapters.length - 1) {
                position = "last";
              } else {
                position = "middle";
              }
              return { ...chapter, position };
            });
          
            return [...prev, {
              sceneTitle: sceneData.sceneTitle,
              sceneLocation: sceneData.sceneLocation,
              sceneChapters: updatedChapters
            }];
          });
          
          setSelectedChapters([]);
          setSceneData({
            sceneTitle:"",
            sceneLocation: "Büro",
            

          });
        }
    }
  };


useEffect(()=>{
    console.log("------------------------------myscenes------------------------", myScenes);
    console.log(items);
  },[myScenes]);

useEffect(()=>{},[activeIndex])
const closeChapterContent=()=>{
  setSelectedChapterContent(null)
}



  const handleClosePopUp  = () =>{
    if(!previousSkript)
    {
      onClose();
      setMode("Manual mode")
      setMyScenes([])
      setChapters([])
      setScenes([])
      setScenesChapters([])
      setSelectedChapters([])
      setSceneData({
        sceneTitle: "",
        sceneLocation: "Büro",
      })
    } else
    {
      onClose();
      let index;
      if (clickedType!=="textReader")
      {
        setVisitedSections((prevSections) => {
          return prevSections.includes("Dialog")
            ? prevSections
            : [...prevSections, items[items.length-3]];
        });
  
        setSelectedItem("Dialog")
        setActiveItem("Dialog")
        index = items.indexOf("Dialog");
        setActiveIndex(index);
      }
      else{
        console.log("------------------jet ou pas ---------------------------");

        setVisitedSections((prevSections) => {
          return prevSections.includes("Charakter")
            ? prevSections
            : [...prevSections, items[items.length-1]];
        });
  
        setSelectedItem("Charakter")
        setActiveItem("Charakter")
        index = items.indexOf("Charakter");
        setActiveIndex(index);
      }
      

    }
    
  }
  


  const isChecked=(chap)=>
  {
   
    const foundChapter = selectedChapters.find(
      (item) => item.title === chap.title  && item.content===chap.content
    );
  if(foundChapter){return true} else return false
  }




const handleSelectionChapters=(chap)=>{
    if (!isSelected(chap)) {
  
  setSelectedChapters((prev) => {
    const isChapterSelected = prev.includes(chap);

    if (isChapterSelected) {
      return prev.filter((selectedChapter) => selectedChapter !== chap);
    } else {
      return [...prev, chap];
    }
  });

}
}
const isSelected=(chap)=>{
return scenesChapters.includes(chap)
}

const handleChapterContentChange = (newContent) => {
  setautoModeChapters((prevChapters) => {
    const updatedChapters = [...prevChapters];
    const chapIndex = updatedChapters.findIndex(
      (chap) => chap.content === selectedChapterContent.content
    );

    if (chapIndex !== -1) {
      const chapter = updatedChapters[chapIndex];

      if (chapter) {
        chapter.content = newContent;
      }
      updatedChapters[chapIndex]=chapter
    }

    return updatedChapters;
  });
};

const handleChapterTitleChange = (newContent) => {
  setautoModeChapters((prevChapters) => {
    const updatedChapters = [...prevChapters];
    const chapIndex = updatedChapters.findIndex(
      (chap) => chap.content === selectedChapterContent.content
    );

    if (chapIndex !== -1) {
      const chapter = updatedChapters[chapIndex];

      if (chapter) {
        chapter.title = newContent;
      }
      updatedChapters[chapIndex]=chapter
    }

    return updatedChapters;
  });
};


  return (
    <div
      className="modal modal-back"
      tabIndex="1"
      role="dialog"
      aria-hidden={!show}
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered" >
        <div className="modal-content popUpContent modal-body-container-style" style={{ width: "550px", }}>

          <div className=" modal-body-style text-center" style={{maxHeight:"600px", overflowY:"scroll",minHeight:"140px"}} >
          <div className="info-container">
      <div className="info-icon">
      <img src={info}alt="info" className="info-icon" />  
          <div className="info-dropdown" style={{fontSize:15,width:490,padding:5,height:105}}>

          <p>{t('modeInfoMessage')}</p>
        </div>
      </div>
          </div>
    {mode == null ? (
  <div>
    <p className="text-center mb-4">{t('popupModeText')}</p>

    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <button
        style={{ width: "200px" }}
        onClick={handleMode}
        className="btn-remove-modal me-2"
      >
        {t("manualMode")}
      </button>
      <button
        style={{ width: "200px" }}
        onClick={onAutomaticMode}
        className="btn-remove-modal me-2"
      >
        {t("automaticMode")}

      </button>
    </div>
  </div>
) : loading ? (
  <div className="spinner-container" style={{height:"100px"}}>
    <div className="spinner"></div>
  </div>
) : autoModeChapters != null ? (
  <div style={{
    justifyContent:"start",
  }}>

<div className="pt-3" style={{paddingLeft:8}}>
{myScenes.length>0&&<select
                      style={{frontWeigh:"bold", width:"92%", backgroundColor:"transparent", color:"#ffffff" , border: "2px solid #ffffff"}}
                          className=" form-control mb-2"
                          onChange={(e) =>{setSceneData(prev=>{return{...prev,sceneTitle:e.target.value}})}}
                       >
                          {myScenes.map((t, index) => (
                            <option 
                            style={{color:"black"}}
                            key={index} value={t.sceneTitle}>
                              {t.sceneTitle}
                            </option>
                          ))}
                        </select>}
<form className="modePopUp-form mb-2" style={{display:'flex',gap:5,alignItems:'center'}}>
                 

                 
                  <div className="modePopUp-element form-group me-2" style={{width:"50%"}}>
                    <div className="newscene-name-item ">
                      <input
                        type="text"
                        id="sceneName"
                        className="form-control  modePopUp-element-input mode-input"
                        style={{border:errorName?"2px #d21111 solid":""}}
                        value={sceneData.sceneTitle}
                        onChange={handleSceneTitleChange}
                        required
                        autoComplete="off"
                      />
                    </div>
                   
                  </div>
                  {clickedType !== "podcast" &&
                    clickedType !== "textReader" && (
                      <div className="modePopUp-element "style={{width:"40%"}}>
                        <select
                          id="sceneType"
                          value={sceneData.sceneLocation}
                          onChange={handleSceneLocationChange}
                          className="modePopUp-element-input form-control mode-input"
                        >
                          <option value="Büro" style={{color:"black"}}>{t("office")}</option>
                          <option value="ClassrKlassenzimmeroom" style={{color:"black"}}>
                            {t("classroom")}
                          </option>
                          <option value="Garten" style={{color:"black"}}>{t("garden")}</option>
                          <option value="Modernes Büro" style={{color:"black"}}>
                            {t("modernOffice")}
                          </option>
                        </select>
                      </div>
                    )}
                  <div className="buttons-container " style={{display:"flex", justifyContent:"end"}}>
                    <button
                    disabled={selectedChapters.length===0||sceneData.sceneTitle===""}

                      onClick={handleSave}
                      className="modePopUp-sceneButton add-btn "
                      style={{ border: "none" }}
                    >
                      +
                    </button>
                    
                  </div>
                </form>
                {errorName && (
                      <div className="error-sceneName" >
                        {errorName}
                      </div>
                    )}

  <div className="selected-chap-container" style={{ border: selectedChapters.length===0 ? "none":"2px #ffffff solid"}}>
    {selectedChapters.map((chap, index)=>{
      return <div key={index} className="selected-chap">
      <span className="delete-badge" onClick={() => handleDeleteChapter(chap)}>
        -
      </span>
      <div className="chapter-content">
        {chap.title}
      </div>
    </div>
    })}
  </div>
</div>

{selectedChapterContent==null?
<>
{autoModeChapters.map((chap, index) => (
      <div className="mb-1" key={chap.title} style={{ justifyContent: "start", textAlign: "left", display:"flex" }}>
      <div className="col-md-1 me-2" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <img style={{width:"26px", height:"auto", cursor:isSelected(chap)?"default":"pointer"}} src={isChecked(chap)||isSelected(chap)?checked:unchecked} alt="" onClick={()=>{handleSelectionChapters(chap)}} />
      </div>
       <div style={{width:85,fontSize:"15px", marginRight:"5px",display:"flex", justifyContent:"center", alignItems:"center",color:isSelected(chap)?"#878787":""}}>chap : {index+1}</div>
        <span  className="chap-btn" style={{width:"365px",paddingLeft:5, cursor:isSelected(chap)?"default":"pointer",color:isSelected(chap)?"#878787":""}}  onClick={()=>{setSelectedChapterContent(chap)}}>{chap.title}</span>
      </div>
    ))}
    <div style={{display:"flex", justifyContent:"space-around"}}>
    <button disabled={myScenes.length===0}onClick={handleSubmitChapters} style={{ width: "150px" , height:"40px" }} className="btn-remove-modal me-2 mt-4">
      {t('submit')}
    </button>
    <button  onClick={handleClosePopUp}style={{ width: "150px" , height:"40px" }} className="btn-remove-modal me-2 mt-4">
      {t('cancel')}

    </button></div>
</>
:
<div>
<div className="info-container">
    
      <div style={{display:"flex",justifyContent:"flex-start"}}>
      <img src={effacer}alt="info" className="effacer-icon" onClick={closeChapterContent} /> 
      <CustomTextarea
                                SubIndex={1}
                                MotherIndex={1}
                                value={selectedChapterContent.title}
                                focusedLine={focusedLine}
                                setFocusedLine={setFocusedLine} 
                                type="Chapters"
                                changeHandle={handleChapterTitleChange}
                                id={"chapter-title"}
                                /> 
      {/* <div className="chap-content-title">{selectedChapterContent.title}</div> */}
      </div>
     
          </div>
          <div >
          
          <CustomTextarea
                                SubIndex={2}
                                MotherIndex={1}
                                value={selectedChapterContent.content}
                                focusedLine={focusedLine}
                                setFocusedLine={setFocusedLine} 
                                type="Chapters"
                                changeHandle={handleChapterContentChange}
                                id={"chapter-content"}
                                />
          {/* <p className="chap-content-text">{selectedChapterContent.content.split(/\n/).map((line,index)=><div className="mb-1" style={{display:"flex", justifyContent:textLanguage.trim().toUpperCase()==="AR-XA"?"end":"start"}}>
         
            {line}
            
            </div>)}</p> */}

            </div>
          
</div>

}





  </div>
) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModePopup;