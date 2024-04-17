import React, { useEffect, useState, useContext } from "react";
import MyContext from "../../Provider/MyContext";
import CustomTextarea from "../CustomTextarea/CustomTextarea"
import './Dialog.css';

const Dialog = ({ responseData , setResponseData }) => {
  const { myScenes, clickedScene, 
  clickedType, setMyScenes, waitingResponse, reloadOrNot, error,textLanguage, chargedScenes, setChargedScenes,setNewSelectionExist, pdfError
} = useContext(MyContext);

  const [focusedLine, setFocusedLine] = useState(null);
  const modifySlice = (line) => {
    if (textLanguage === 'ar-XA') {
      return line.slice(9);
    } else if (textLanguage === 'fr-FR') {
      return line.slice(12);
    } else {
      return line.slice(11);
    }
  };
  
  

  useEffect(() => {
    if ((responseData && (responseData.speech || responseData.conversation))) {
      setMyScenes((prevScenes) => {
        const updatedScenes = [...prevScenes];
        const sceneIndex = updatedScenes.findIndex(
          (scene) => scene.sceneTitle === responseData.sceneName
        );
        if (sceneIndex !== -1) {
          const scene = updatedScenes[sceneIndex];
          const chapterIdentifier = responseData.title;

          const updatedChapters = scene.sceneChapters.map((chapter) => {
             if (chapter.title === chapterIdentifier) {
              if((clickedType === "monolog"|| clickedType === "podcast")) {
                chapter.content = responseData.speech;
                chapter.status="done";
              } else if(clickedType === "dialog"){
                chapter.content = responseData.conversation.split("\n");
                chapter.status="done";

              } 
            }
          return chapter;
          });
          setChargedScenes((prev_scenes) => {
            const foundScene = prev_scenes.find(
              (item) => item.sceneName === responseData.sceneName
            );
            if (!foundScene) {
              return [
                ...prev_scenes,
                {
                  sceneName: responseData.sceneName,
                  chargedChapters: [responseData.title],
                },
              ];
            } else {
              const updatedScenes = prev_scenes.map((item) => {
                if (item.sceneName === responseData.sceneName) {
                  const foundChapter = item.chargedChapters.find(
                    (item) => item === responseData.title
                  );
                  if (!foundChapter) {
                    return {
                      ...item,
                      chargedChapters: [...item.chargedChapters, responseData.title ],
                    };
                  }
                }
                return item;
              });
              return updatedScenes;
            }
          });
          updatedScenes[sceneIndex] = {...scene, sceneChapters: updatedChapters};
        }
        return updatedScenes;
      });
    } 
    setResponseData("");
  }, [responseData, setMyScenes]);

 

  useEffect(()=>{
    let chapNumber=0
    let chargedChapNumber=0
        myScenes.map((scene)=>{
          chapNumber+=scene.sceneChapters.length
         
        })
    chargedScenes.map((scene)=>{
      chargedChapNumber+=scene.chargedChapters.length

    })
   if(chapNumber === chargedChapNumber && chargedChapNumber  && chapNumber !== 0)
   {
    setNewSelectionExist(false)
   }
  },[chargedScenes])

const handleContentChange = (chapterIndex, lineIndex, newContent) => {
    setMyScenes((prevScenes) => {
      const updatedScenes = [...prevScenes];
      const sceneIndex = updatedScenes.findIndex(
        (scene) => scene.sceneTitle === clickedScene.sceneTitle
      );
      if (sceneIndex !== -1) {
        const scene = updatedScenes[sceneIndex];
        const chapter = scene.sceneChapters[chapterIndex];
        if (chapter && lineIndex !== -1) {
          const originalLine = chapter.content[lineIndex];
          const modifiedLine = `${originalLine.slice(0, 12)}${newContent}`;
          chapter.content[lineIndex] = modifiedLine;
        }
      }

      return updatedScenes;
    });
  };

const handleChapterContentChange = (chapterIndex, newContent) => {
    setMyScenes((prevScenes) => {
      const updatedScenes = [...prevScenes];
      const sceneIndex = updatedScenes.findIndex(
        (scene) => scene.sceneTitle === clickedScene.sceneTitle
      );

      if (sceneIndex !== -1) {
        const scene = updatedScenes[sceneIndex];
        const chapter = scene.sceneChapters[chapterIndex];

        if (chapter) {
          chapter.content = newContent;
        }
      }

      return updatedScenes;
    });
  };


const verifier=(sceneName)=>{
  const valid = false;
  const foundScene = chargedScenes.find(
    (item) => item.sceneName === sceneName
  );
  const foundScene2=myScenes.find(
    (item) => item.sceneTitle === sceneName
  );
  if(foundScene && foundScene.chargedChapters.length===foundScene2.sceneChapters.length)
  {return true}else{return false}
}

  return (
    <div className="dialog-container"  >
    <div
     className={`dialog-container-elements ${textLanguage=== 'ar-XA' ? 'dialogRtl' : 'ltr'}`}
    >
        {(clickedType !== "podcast" && clickedType !=="monolog")
          ? myScenes.map((scene,sceneIndex) => (
              <div
                key={sceneIndex}
                style={{
                  height: "100%",
                  width: "94%",
                  display:
                    scene.sceneTitle === clickedScene.sceneTitle
                      ? "block"
                      : "none",
                }}
              >
                {Array.isArray(scene.sceneChapters) &&
                  (verifier(scene.sceneTitle)&& !(waitingResponse&&reloadOrNot)) && scene.sceneChapters.filter((chapter) => chapter.status === "done").map((chapter, chapterIndex) => (
                   <div key={chapterIndex}>
                      {(Array.isArray(chapter.content)&&chapter.content.map((line, lineIndex) => (
                          <div key={lineIndex} style={{ display: "flex" }}>
                            <span className="dialog-elements-span">
                              {textLanguage === 'ar-XA' ? line.slice(0, 9) : (textLanguage === 'fr-FR' ? line.slice(0, 12) : line.slice(0, 11))}
                            </span>
                            { line && (
                                 <CustomTextarea 
                                 GrandMother={sceneIndex}
                                 SubIndex={lineIndex}
                                 MotherIndex={chapterIndex}
                                 value={modifySlice(line)}
                                 focusedLine={focusedLine}
                                 setFocusedLine={setFocusedLine} 
                                 type="Dialog"
                                 changeHandle={handleContentChange}
                                 id={"Dialog-scene"+sceneIndex+"chapter"+chapterIndex+"line"+lineIndex}
                                 />  )}
                          </div>
                        )))}   
   
                    {chapterIndex!==scene.sceneChapters.length-1?(<div className="d-flex dialog-line-container" >
                    <hr className="line"/> 
                    </div>):<></>}
                   </div>
                  ))}
                {((!verifier(scene.sceneTitle) &&!error)||(waitingResponse&& !error &&reloadOrNot) ) && !pdfError &&(
                    <div className="spinner-container">
                      <div className="spinner"></div>
                    </div>
                  )}
              </div>
            ))
          : myScenes.map((scene, sceneIndex) => (
              <div
                key={sceneIndex}
                style={{ height: "100%", width: "100%",
                  display: scene.sceneTitle === clickedScene.sceneTitle
                      ? "block"
                      : "none" }} 
                      >
                {Array.isArray(scene.sceneChapters) && (verifier(scene.sceneTitle)&&!(waitingResponse&&reloadOrNot))&&
                  scene.sceneChapters.map( (chapter, chapterIndex) =>
                     { 

                      return <div key={chapterIndex}>
                     <div    style={{ display: "flex" }} >
                           
                             {chapter&&<CustomTextarea
                                SubIndex={chapterIndex}
                                MotherIndex={sceneIndex}
                                value={chapter.content}
                                focusedLine={focusedLine}
                                setFocusedLine={setFocusedLine} 
                                type="Monolog"
                                changeHandle={handleChapterContentChange}
                                id={"Monolog-scene"+sceneIndex+"chapter"+chapterIndex}
                                /> }
                         
                        </div>
                        
                    {chapterIndex!==scene.sceneChapters.length-1?(<div className="d-flex dialog-line-container" >
                    <hr className="line"/> 
                    </div>):<></>}
                     </div>
                      }
                  )}
                {((!verifier(scene.sceneTitle) &&!error)||(waitingResponse&& !error &&reloadOrNot)) && !pdfError && (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default Dialog;