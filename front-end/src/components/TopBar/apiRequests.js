

import axios from "axios";

const createDialogRequest = async (
  requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests, setBlockProcess, setPdfError) => {
  setWaitingResponse(true);

  
  try {
    const response = await 
      fetch("http://127.0.0.1:5000/api/create_conversation_fast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

    console.log("-------------------RESPONSE F WEST CREATE--------------------------",response);

    const responseData = await response.json();
    setResponseData(responseData);
    setWaitingResponse(false);
    setProcessCompleted(true);
    reloadNumber++;

    if (totalRequests === reloadNumber) {
      setBlockProcess(false);
      setWaitingResponse(false);
    }

    return { response};
  } catch (error) {
    if (error.message === 'Network response was not ok') {
      setWaitingResponse(false);
    } else {
      console.error('Error:', error.message);
      setWaitingResponse(false);
    }
  }
};



  const createPodcastConversationRequest = async (requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests,setBlockProcess, setPdfError) => {

    setWaitingResponse(true);
   
      try {
        const response = await 
          fetch("http://127.0.0.1:5000/api/create_conversation_mono_podcast", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

      if (response.ok) {
        const responseData = await response.json();
        setResponseData(responseData);
        setWaitingResponse(false);
        setProcessCompleted(true);
        reloadNumber++;
        if (totalRequests === reloadNumber) {
          setBlockProcess(false);
          setWaitingResponse(false);
        }

        return { response: "ok" };
      }
    } catch (error) {
      setPdfError(true);

      if (error.message === 'Network response was not ok') {
        setWaitingResponse(false);
      } else {
        setWaitingResponse(false);
      }
    }
  };



  const sendPodcastRequest = async (requestData, setVideo, setVideos) => {
      try {
        const response = await 
          fetch("http://127.0.0.1:5000/api/create_podcast_mono", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

      if (response.ok) {
        const responseData = await response.json();
        setVideo(responseData);
        setVideos((prevVideos) => [...prevVideos, responseData]);
      }
    } catch (error) {
      if (error.message === 'Network response was not ok') 
      {       
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  const textReaderRequest = async (requestData, setVideo, setVideos) => {
    try {
      const response = await 
        fetch("http://127.0.0.1:5000/api/create_text_reader", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    if (response.ok) {
      const responseData = await response.json();
      setVideo(responseData);
      setVideos((prevVideos) => [...prevVideos, responseData]);
    }
  } catch (error) {
    if (error.message === 'Network response was not ok') 
    {       
    } else {
      console.error('Error:', error.message);
    }
  }
};

  const createConversationMonodialogRequest = async (requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests, setBlockProcess, setPdfError) => {


      try {
        const response = await 
          fetch("http://127.0.0.1:5000/api/create_conversation_mono_fast", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      if (response.ok) {
        const responseData = await response.json();
        setResponseData(responseData);
        setProcessCompleted(true);
        setWaitingResponse(false);
        reloadNumber++;
        if (totalRequests === reloadNumber) {
          setBlockProcess(false);
        }
        return { response: "ok" };
      }
    } catch (error) {
      setPdfError(true);

      if (error.message === 'Network response was not ok' ) 
      { 
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const createVideoMonodialogRequest = async (requestData, setVideo, setVideos) => {
      try {
        const response = await 
          fetch("http://127.0.0.1:5000/api/create_video_mono", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
         
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

      if (response.ok) {
        const responseData = await response.json();
        setVideo(responseData);
        setVideos((prevVideos) => [...prevVideos, responseData]);
      }
    } catch (error) {
      if (error.message === 'Network response was not ok')
       {       
      } else {
        console.error('Error:', error.message);
      }
    }
  };



  const createVideoDialog = async (requestData, setVideo, setVideos) => {

      try {
        const response = await 
          fetch("http://127.0.0.1:5000/api/create_video", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

      if (response.ok) {
        const responseData = await response.json();

        setVideo(responseData);
        setVideos((prevVideos) => [...prevVideos, responseData]);
      }
    } catch (error) {
      if (error.message === 'Network response was not ok'){       
        // setError(true);

      } else {
        console.error('Error:', error.message);
        //setError(true);
      }
    }
  };

  const fetchQuestions = async (sc_count, mc_count,wf_count, setLoading,setBlockProcess, chapters, setFragen,setCurrentFrage,setFragenUpdatedAfterSelection, setFragenGeneration, textLanguage) => {
    console.log("-------------------- text language ---------------------------",textLanguage);
    try {
      
       
      setLoading(true);
      setBlockProcess(true);
      const resData = await axios.post("http://127.0.0.1:5000/api/create_questions_fast", {
        sc_count: parseInt(sc_count),
        mc_count: parseInt(mc_count),
        wf_count: parseInt(wf_count),
        scenarios: chapters,
        lang_code:  textLanguage
      });
      if (resData) {
        setLoading(false);
        setFragenGeneration(true);
        setBlockProcess(false);
        setFragenUpdatedAfterSelection(false);
        setFragen(correctGivenFragen(resData.data.questions));
        setCurrentFrage(resData.data.questions[0]);
        return resData;        
      }
    }  catch (error) {
      if (error.message === 'Network response was not ok') {

      } else {
        console.error('Error:', error.message);
        //setError(true);
      }
    }
  };

  const correctGivenFragen=(fragen)=>{
    const newFrgagen= fragen.map((frage)=>{
      let newFrage=frage;
    if(Array.isArray(frage.correct_answers) &&frage.correct_answers.length === 0)
    { 
      newFrage.answers=[...newFrage.answers,"keine Antwort"]
      newFrage.correct_answers=[...newFrage.correct_answers,"keine Antwort"]
    }
    return newFrage
  })
  return newFrgagen;
  }

  const reloadQuestions = async (count, timeOutQuestions, questions, fragen,setFragen, setCurrentFrage, setFragenGeneration, setLoading, setBlockProcess, setCount, chapters, textLanguage) => {
    console.log("-------------------- text language ---------------------------",textLanguage);
    console.log("here is all chapters :", chapters)
    const sc = localStorage.getItem("sc_count");
    const mc = localStorage.getItem("mc_count");
    const wf = localStorage.getItem("wf_count");
    const sc_count = JSON.parse(sc);
    const mc_count = JSON.parse(mc);
    const wf_count = JSON.parse(wf);
   
      try {
       
        setLoading(true);
        setBlockProcess(true);
        const resData = await axios.post("http://127.0.0.1:5000/api/create_questions_fast", {
          sc_count: parseInt(sc_count),
          mc_count: parseInt(mc_count),
          wf_count: parseInt(wf_count),
          scenarios: chapters,
          lang_code: textLanguage
        });
        if (resData) {
          setLoading(false);
          setBlockProcess(false);
          setFragen(correctGivenFragen(resData.data.questions));
          
          setCurrentFrage({...resData.data.questions[0],frageIndex:0});
        }
      } catch (error) {
        if (error.message === 'Network response was not ok') {
          

        } else {
          console.error('Error:', error.message);
          
        }
      }
   
    setCount(count + 1);
  };


  const handleRequestDialogAgain = async (setWaitingResponse, setReloadOrNot, clickedType, setBlockProcess
    ,setResponseData,setProcessCompleted, reloadNumber, totalRequests, setError, chapters, textLanguage
    ) => {
      const languageMappings = {
        'ar-XA': "الشخصية",
        'fr-FR': "Personnage",
        'de-DE': "Charakter",
        'en-US': "Character"
      };
    
      
      const speakerName = languageMappings[textLanguage];
    setWaitingResponse(true);
    setReloadOrNot(true);
    if (clickedType === "dialog") {
      const storedData = localStorage.getItem("scenes");
      const parsedData = JSON.parse(storedData);
      setBlockProcess(true);
      for (const chap of chapters) {
          const requestData = {
            speaker1: speakerName+"1",
               speaker2: speakerName+"2",
            scenarios: [chap],
            sceneName: chap.sceneTitle,
            lang_code: textLanguage,

          };
          console.log(" reload dialog request Data ",requestData)
          try {
            await createDialogRequest(requestData, setWaitingResponse,setResponseData,setProcessCompleted,
               reloadNumber, totalRequests,setBlockProcess, setError);
          } catch (error) {
            console.error("Error creating conversation:", error);
            //setError(true);

          }
      }
      setReloadOrNot(false);
      setBlockProcess(false);
      setWaitingResponse(false);
    } else if (clickedType === "monolog") {
      const storedData = localStorage.getItem("monoScenes");
      const parsedData = JSON.parse(storedData);
      setBlockProcess(true);
      for (const chap of chapters) {
          const requestData = {
            speaker1: "Charakter 1",
            sceneName: chap.sceneTitle,
            lang_code: textLanguage,

            scenarios: [chap],
          };
          try {
            let timeoutId = setTimeout(() => {
                alert("Response time exceeded");
            }, 90000); 
        
            const response = await createConversationMonodialogRequest(requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests, setBlockProcess, setError);
        
            clearTimeout(timeoutId);
        
            if (response.ok) {
                setWaitingResponse(false);
            }
        } catch (error) {
            console.error("Error creating conversation:", error);
            //setError(true);
        }
        
      }
      setReloadOrNot(false);
      setBlockProcess(false);
      setWaitingResponse(false);
    } else if (clickedType === "podcast") {
      const storedData = localStorage.getItem("monoScenes");
      const parsedData = JSON.parse(storedData);
      setBlockProcess(true);
      for (const chap of chapters) {
          const requestData = {
            speaker: "Charakter",
            sceneName: chap.sceneTitle,
            scenarios: [chap],
            lang_code: textLanguage,

          };
          try {
            let timeoutId = setTimeout(() => {
                alert("Response time exceeded");
            }, 90000); 
        
            const response = await createPodcastConversationRequest(requestData, setWaitingResponse, setResponseData, setProcessCompleted, reloadNumber, totalRequests,setBlockProcess);
        
            clearTimeout(timeoutId);
        
            if (response.ok) {
                setWaitingResponse(false);
            }
        } catch (error) {
            console.error("Error creating conversation:", error);
            //setError(true);
        }
      }
      setReloadOrNot(false);
      setBlockProcess(false);
      setWaitingResponse(false);
    }
  };
  

  export { createDialogRequest,
           createConversationMonodialogRequest, 
           createPodcastConversationRequest,
           sendPodcastRequest,
           createVideoDialog,
           createVideoMonodialogRequest,
           fetchQuestions,
           reloadQuestions,
           handleRequestDialogAgain,
           textReaderRequest
            } ;