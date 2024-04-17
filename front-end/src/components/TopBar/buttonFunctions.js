
import {sendPodcastRequest,
  createDialogRequest,
   createConversationMonodialogRequest,
   createPodcastConversationRequest,
   textReaderRequest, createVideoDialog, createVideoMonodialogRequest
} from './apiRequests';

export const buttonFunctions = {
 "createDialog": async ({myScenes, clickedType, firstScene,setClickedScene, setWaitingResponse, setResponseData,setSelectedItem,setBlockProcess,setProcessCompleted, reloadNumber, totalRequests, setTimeOut, setLoading,textLanguage,setPdfError}) => {  
  const languageMappings = {
    'ar-XA': "الشخصية",
    'fr-FR': "Personnage",
    'de-DE': "Charakter",
    'en-US': "Character"
  };

  
  const speakerName = languageMappings[textLanguage];
  
   if (firstScene) {
     setClickedScene(firstScene);
   }
   setWaitingResponse(true);
   setSelectedItem("Dialog");
   if (clickedType === "dialog") {
     setBlockProcess(true);
     localStorage.setItem("scenes", JSON.stringify(myScenes));

         for (const scene of myScenes) {
           for (const chapter of scene.sceneChapters) {
            if (chapter.status ==="undone") {
             const requestData = {
               speaker1: speakerName + "1",
               speaker2: speakerName + "2",
               lang_code: textLanguage,
               scenarios: [{content: chapter.softContent,title:chapter.title,position:chapter.position,status:chapter.status}],
               sceneName: scene.sceneTitle,
             };
             try {
              let timeoutId = setTimeout(() => {
               setTimeOut(true);  
                          }, 90000); 
          
             await createDialogRequest(requestData,setWaitingResponse,setResponseData,setProcessCompleted, reloadNumber, totalRequests,setBlockProcess, setTimeOut, textLanguage, setPdfError).then((response) => {
              clearTimeout(timeoutId);
              console.log("--------------------RESPONSE f button functions----------------",response);
          
              if (response.ok) {
                  setWaitingResponse(false);
              }
              setLoading(false);
            });

          } catch (error) {
            console.log("famaaaaaa error", error);
            setLoading(false);
            setWaitingResponse(false);
             setPdfError(true);
          }
           }
         }
        }

       setBlockProcess(false);
       setWaitingResponse(false);
      

       ;
   } else if (clickedType === "monolog") {
     setBlockProcess(true);
     localStorage.setItem("monoScenes", JSON.stringify(myScenes));

         for (const scene of myScenes) {
           for (const chapter of scene.sceneChapters) {
            if (chapter.status ==="undone") {

             const requestData = {
               speaker1: speakerName + "1",
               sceneName: scene.sceneTitle,
               lang_code: textLanguage,

               scenarios: [{content: chapter.softContent,title:chapter.title,position:chapter.position,status:chapter.status}],
               position: chapter.position,
             };
             try {
              let timeoutId = setTimeout(() => {
                setTimeOut(true);  
              }, 90000); 
          
              await createConversationMonodialogRequest(requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests, setBlockProcess, setTimeOut, textLanguage,setPdfError).then((response) => {
              clearTimeout(timeoutId);
          
              if (response.ok) {
                  setWaitingResponse(false);
              }
              setLoading(false);
            })

          
             
          } catch (error) {
               setLoading(false);
               setPdfError(true);
          }
        } 
           }
         }
         setBlockProcess(false);
     setWaitingResponse(false);
     }
    else if (clickedType === "podcast") {
     setBlockProcess(true);
     localStorage.setItem("monoScenes", JSON.stringify(myScenes));

         for (const scene of myScenes) {
           for (const chapter of scene.sceneChapters) {
            if (chapter.status ==="undone") {

             const requestData = {
               speaker: "Charakter",
               sceneName: scene.sceneTitle,
               lang_code: textLanguage,

               scenarios: [{content: chapter.softContent,title:chapter.title,position:chapter.position,status:chapter.status}],
               position: chapter.position,
             };
             try {
              let timeoutId = setTimeout(() => {
                setTimeOut(true);  
              }, 90000); 
          
               await createPodcastConversationRequest(requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests,setBlockProcess, textLanguage,setPdfError).then((response) => {
                clearTimeout(timeoutId);
          
              if (response.ok) {
                  setWaitingResponse(false);
              }
                setLoading(false);
              
              });
          
              
              
          } catch (error) {
            setLoading(false);

            setPdfError(true);
          }
        }  
           }
         }
         setBlockProcess(false);
     setWaitingResponse(false);
      }},
 "chooseVoice": ({setSelectedItem,setFragenGeneration, }) => {
   setSelectedItem("Charakter");
   setFragenGeneration(false);
 },
 "createQuestions": ({setSelectedItem, setFragenModal, setProcessCompleted, setLoading}) => {
   setSelectedItem("Fragen");
   setFragenModal(true);
   setProcessCompleted(false);
   setLoading(false);
 },
 "chooseCharacter": ({setSelectedItem, setFragenGeneration, myScenes, setMyScenes }) => {
   setSelectedItem("Charakter");
   setFragenGeneration(false);
   const updatedScenes = myScenes.map((scene) => ({
     ...scene,
     sceneChapters: scene.sceneChapters.map((chapter, index) => ({
       ...chapter,
       position:
         index === 0
           ? "first"
           : index === scene.sceneChapters.length - 1
           ? "last"
           : "middle",
     })),
   }));

   setMyScenes(updatedScenes);
 },
 'generate': async ({clickedType, myScenes, avatars, setVideo, setVideos,setTimeOut, textLanguage}) => {
   if (clickedType === "dialog") {
     for (const scene of myScenes) {
       for (const chapter of scene.sceneChapters) {
         const requestData = {
           backgroundImage: scene.sceneLocation,
           imageRight: avatars.avatarLeft.name,
           imageLeft: avatars.avatarRight.name,
           voice1: avatars.avatarRight.voiceName,
           voice2: avatars.avatarLeft.voiceName,
           title: chapter.title,
           conversation: chapter.content.join("\n"),
           position: chapter.position,
           sceneName: scene.sceneTitle,
           lang_code: textLanguage,

         };

         try {
           const response = await createVideoDialog(requestData, setVideo, setVideos, setTimeOut);

           console.log("video", response);
         } catch (error) {
           console.error("Error creating video:", error);
         }
       }
     }
   } else if (clickedType === "monolog") {
     for (const scene of myScenes) {
       for (const chapter of scene.sceneChapters) {
         const requestData = {
           backgroundImage: scene.sceneLocation,
           speaker: avatars.avatarRight.name,
           title: chapter.title,
           sceneName: scene.sceneTitle,
           voice: avatars.avatarRight.voiceName,
           speech: chapter.content,
           position: chapter.position,
           lang_code: textLanguage,

         };
         try {
           const response = await createVideoMonodialogRequest(
             requestData, setVideo, setVideos, setTimeOut
           );
           console.log("video", response);
         } catch (error) {
           console.error("Error creating video:", error);
         }
       }
     }
   } else if (clickedType === "podcast"){
     for (const scene of myScenes) {
       for (const chapter of scene.sceneChapters) {
         const requestData = {
           speaker: avatars.avatarRight.name,
           title: chapter.title,
           sceneName: scene.sceneTitle,
           voice: avatars.avatarRight.voiceName,
           speech: chapter.content,
           position: chapter.position,
           lang_code: textLanguage,

         };
         try {
           const response = await sendPodcastRequest(requestData, setVideo, setVideos, setTimeOut);
           console.log("video", response);


         } catch (error) {
           console.error("Error creating podcast:", error);
         }
       }
     }
   }
   else{
     for (const scene of myScenes) {
       for (const chapter of scene.sceneChapters) {
         const requestData = {
           title: chapter.title,
           sceneName: scene.sceneTitle,
           voice: avatars.avatarRight.voiceName,
           text: chapter.content,
           lang_code: textLanguage,

         };
         try {
           const response = await textReaderRequest(requestData, setVideo, setVideos, setTimeOut);
           console.log("video", response);


         } catch (error) {
           console.error("Error creating podcast:", error);
         }
       }
     }
   }
 },
};