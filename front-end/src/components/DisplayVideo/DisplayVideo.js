import React, { useState, useEffect, useRef ,useContext} from "react";
import "./DisplayVideo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faPlay, faPause, faForward } from "@fortawesome/free-solid-svg-icons";
import { storage } from '../../Firebase';
import MyContext from "../../Provider/MyContext";
import checked from "../../assets/checked.png";
import unchecked from "../../assets/unchecked.png";
import ReactPlayer from 'react-player';
import ProgressBar from 'react-bootstrap/ProgressBar';
import notification from '../../voices/notification.mp3';
import { useTranslation } from "react-i18next";

const DisplayVideo = ({ video,sideButton,setGenerationCompleted }) => {

  const [audioSrc, setAudioSrc] = useState(notification);
  const audioRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoButton, setVideoButton] = useState("pause");
  const [videoUrl, setVideoUrl] = useState("");
  const [played, setPlayed] = useState(0);
  const [audioplayed, setAudioPlayed] = useState(false);
  const [videos, setVideos] = useState([]);
const playerRef = useRef(null);
const {fragen, clickedType,myScenes,textLanguage} = useContext(MyContext);
const [hoveredSegment, setHoveredSegment] = useState(null);
const [videoHoveredUrl, setVideoHoveredUrl] = useState("");
const [chapterTimes, setChapterTimes] = useState([]); 
const [elapsedTime, setElapsedTime] = useState(0);
const [progress, setProgress] = useState(0);
const [remainingTime, setRemainingTime] = useState("");
const { t } = useTranslation();

  let totalChapters = 0;

  myScenes.forEach(scene => {
  totalChapters += scene.sceneChapters.length;
});

if (videos.length===totalChapters) {
  setGenerationCompleted(true)
}
const playAudio = () => {
  if (audioRef.current) {
    audioRef.current.play();
  }
};

const fetchVideoUrl = async (name) => {
  try {
    const videoRef = storage.ref().child(`${name}`);
    const url = await videoRef.getDownloadURL();
    setVideoUrl(url);
  } catch (error) {
    console.error('Error fetching video URL:', error);
  }
};

    if (videos.length === 1) {
      fetchVideoUrl(videos[currentVideoIndex].name);
    
    }

  useEffect(() => {
    if (video && video.file_name) {
      playAudio();
      if (!videos.some((v) => v.name === video.file_name)) {
        setVideos((prevVideos) => [
          ...prevVideos,
          { name: video.file_name, scene: video.sceneName },
        ]);
      }
    }
  }, [video, videos]);
  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().play();
    }
    setVideoButton("play");
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().pause();
    }
    setVideoButton("pause");
  };

  const handleSwitchVideo = () => {
    if (videos.length > 0) {
      setAudioPlayed(false)
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      const nextVideo = videos[nextIndex];
  
      if (nextVideo) {
        setCurrentVideoIndex(nextIndex);
        fetchVideoUrl(nextVideo.name);
        setPlayed(0);
        setVideoButton("pause");
      }
    }
  };

  const handlePreviousVideo = () => {
    setAudioPlayed(false)
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    fetchVideoUrl(videos[currentVideoIndex-1].name);
    setPlayed(0);
    setVideoButton("pause");
  };
  const handleSeekChange = (value) => {
    setPlayed(parseFloat(value));
  };

  const handleMouseEnter = async (index) => {
    setHoveredSegment(index);
    try {
      const videoRef = storage.ref().child(`${videos[index].name}`);
      const url = await videoRef.getDownloadURL();
      setVideoHoveredUrl(url);
    } catch (error) {
      console.error("Error fetching video URL:", error);
    }
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  const handleVideo = (index) => {
    setVideoButton("pause");
    setCurrentVideoIndex(index);
    fetchVideoUrl(videos[index].name);
  };

  
  const getEstimatedTime = async (text) => {
    
    try {
      if (clickedType==="dialog") {
          const response = await 
        fetch('http://127.0.0.1:5000/api/get_estimated_time_dual', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({ text }),
        });
        const data = await response.json();
        return data.total_seconds;
      }
      else{
        const response = await 
      fetch('http://127.0.0.1:5000/api/get_estimated_time_mono', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      return data.total_seconds;
      }
      
    } catch (error) {
      console.error('Error fetching estimated time:', error);
      return null;
    }
  };

  const fetchChapterTimes = async () => {
 const times = [];
    for (const scene of myScenes) {
      for (const chapter of scene.sceneChapters) {
        if (Array.isArray(chapter.content) && chapter.content.length > 1) {
          const chapterText = chapter.content.join("\n");
  
          const estimatedTime = await getEstimatedTime(chapterText);
  
          times.push({ chapter, estimatedTime });
        }
        else{
          const estimatedTime = await getEstimatedTime(chapter.content);
          times.push({ chapter, estimatedTime });
        }
      }
    }
  
    setChapterTimes(times);
  };

  
  useEffect(() => {
    if (clickedType==="dialog" || clickedType==="monolog") {
    fetchChapterTimes();}
  }, [myScenes]);

 

  useEffect(() => {
    if ((clickedType==="dialog" || clickedType==="monolog")) {
    const startTime = new Date().getTime();
   setElapsedTime(startTime);
  } }, []);

 const startProgress = () => {
      setInterval(() => {
        
        if (chapterTimes.length > 0 && chapterTimes[0].estimatedTime) {
          const currentTime = new Date().getTime();
          const elapsedSeconds = Math.floor((currentTime - elapsedTime) / 1000);
          const time = (chapterTimes[0].estimatedTime)-elapsedSeconds
          const remainingMinutes = Math.floor(time / 60);
          const remainingSeconds = Math.floor(time % 60);
          setRemainingTime(`${t("You still have")} ${remainingMinutes} ${t("Minutes and")} ${remainingSeconds} ${t("Seconds Time")}`)
          const newProgress =  Math.floor((elapsedSeconds / chapterTimes[0].estimatedTime) * 100);
          if (newProgress<100) {
            setProgress(newProgress);
          }
          else{
            setProgress(100);
          }
        }
        

        
      }, 2000);
    };

    const delayId = setTimeout(() => {
      if (clickedType==="dialog" || clickedType==="monolog") {
      startProgress();
      clearTimeout(delayId); }
    }, 1000);

  return (
    <div  className="displayVideo-container">
   {sideButton==="szene" &&
    <div className="displayVideo-scene">
    {(clickedType==="dialog" || clickedType==="monolog") ?
      (!videos.length ? (
        <div className="spinner-container spinner-progress">
           <ProgressBar variant="danger" className="spinner-video" animated now={progress} label={`${progress  }%`} />
           {progress  === 100 ?  (
            <div className="text-progress">{t("Finalization")}</div>
            ): <div className="text-progress">{remainingTime}</div>}

           
        </div>
      ) : (
        <div className="displayScene-content">
          <div className="scene-name">
            {videos[currentVideoIndex].scene}
          </div>
          <ReactPlayer
             controls={true}
             ref={playerRef}
             width="85%"
             height="auto"
             url={videoUrl}
             onPlay={handlePlay}
             onPause={handlePause}
             onEnded={handleSwitchVideo} 
             played={played}
         onChange={handleSeekChange}
          />
           {videos?.length>2&&
           <div className="timeline-bar">
                  {
                    videos.map((_, index) => (
                      <div
                        key={index}
                        className={`timeline-segment ${
                          index === currentVideoIndex ? "active" : ""
                        } ${index === hoveredSegment ? "hovered" : ""}`}
                        onClick={() => handleVideo(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="tooltip">
                          <ReactPlayer
                            url={videoHoveredUrl}
                            playing={index === hoveredSegment}
                            height="80%"
                            width="100%"
                            controls={false}
                            volume={0}
                          />
                          <div className="toolTip-container">
                            <div className="tooltip-title"> 
                            {videos[index].scene}</div>, 
                            <div className="tooltip-title"> { videos[index].name.split("_")[1].split("-")[0]}</div>
                          </div> 
                        </div>
                      </div>
                    ))}
                </div>}
          <div className="displayVideo-buttons-container">
            <div className="displayVideo-buttons">
              <button onClick={handlePreviousVideo} disabled = {currentVideoIndex === 0} className="videoButton" >
                <FontAwesomeIcon className="videoButton-icon " icon={faBackward} style={{ "--fa-secondary-opacity": "1", marginRight: "2px" }} />
              </button>
              <div>
                {videoButton === "pause" ? 
              <button onClick={handlePlay} className="videoButton" style={{ background: videoButton === "play" ? "#e11b19" : "" }}>
                <FontAwesomeIcon className="videoButton-icon" icon={faPlay} style={{ marginLeft: "3px" }} />
              </button>:
              <button onClick={handlePause} className="videoButton" style={{ background: videoButton === "play" ? "#e11b19" : "" }}>
              <FontAwesomeIcon className="videoButton-icon" icon={faPause} />
            </button>}
            </div>
              <button onClick={handleSwitchVideo} disabled = {currentVideoIndex === (videos.length)-1} className="videoButton" style={{ 
              color:currentVideoIndex<videos.length  ? "":"#aaaaaa"}}>
                {currentVideoIndex===videos.length-1 && videos.length<totalChapters ?
               <div className="d-flex align-items-center justify-content-center">
               <div className="dot1 bg-dark rounded-circle ">
               </div>
               <div className="dot2 bg-dark rounded-circle m-1">
               </div>
               <div className="dot3 bg-dark rounded-circle">
               </div>
           </div>:
                <FontAwesomeIcon className="videoButton-icon" icon={faForward} style={{ "--fa-secondary-opacity": "1", marginLeft: "3px" }} />
                }
              </button>
            </div>

          </div>
        </div>
      )) :  (!videos.length ? (
        <div className="spinner-container">
          <div className="spinner" ></div>
        </div>
      ) : (
         <div className="displayVideo-division">
         <div  className="scene-name">
            {videos[currentVideoIndex].scene}
          </div>
          <div className="audio-visualizer">
      {[...Array(100)].map((_, index) => (
        <div key={index} className={ audioplayed?"audio-bar":"audio-bar-pause"}></div>
      ))}
    </div>
              <audio
                src={videoUrl}
                controls
                autoPlay={false}
                onPlay={() => setAudioPlayed(true)}
                onPause={() => setAudioPlayed(false)}
                style={{ width: "50VW", height: "70px",marginTop:20 }}
              />        
          <div>
    </div>          <div style={{ marginTop: "10px", textAlign: "center", display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <button onClick={handlePreviousVideo} disabled = {currentVideoIndex === 0} className="videoButton" >
                <FontAwesomeIcon className="videoButton-icon " icon={faBackward} style={{ "--fa-secondary-opacity": "1", marginRight: "2px" }} />
              </button>
              <div>
            </div>
              <button onClick={handleSwitchVideo} disabled = {currentVideoIndex === (videos.length)-1} className="videoButton" style={{ 
              color:currentVideoIndex<videos.length  ? "":"#aaaaaa"}}>
                   {currentVideoIndex===videos.length-1 && videos.length<totalChapters ?
               <div className="d-flex align-items-center justify-content-center">
               <div className="dot1 bg-dark rounded-circle ">
               </div>
               <div className="dot2 bg-dark rounded-circle m-1">
               </div>
               <div className="dot3 bg-dark rounded-circle">
               </div>
           </div>:
                <FontAwesomeIcon className="videoButton-icon" icon={faForward} style={{ "--fa-secondary-opacity": "1", marginLeft: "3px" }} />
                }
              </button>
              
            </div>

          </div>
          
        </div>
      )) }
    </div>}
    {sideButton==="fragen"&&  
    <div  style={{ height: "100%", width: "100%", marginTop: "4vh" }}>
    <div className="container-fluid ps-4 " style={{ color: "#FFF" }}>
       {
      fragen.map((question, index) => (
        <div key={index} className={`question pb-3 ${textLanguage=== 'ar-XA' ? 'fragenRtl' : 'ltr'}`}>
          <span>{index + 1}. {question.question}</span>
          <div style={{ margin: "30px 20px" }}>
               {question.answers.map((option, key) => {
                const imageUrl =
                    Array.isArray(question.correct_answers) && question.correct_answers.includes(option)
                        ? checked
                        : unchecked;
              return (
                <div className="row mb-1" key={key}>
                  <div
                    className="col-md-7 d-flex"
                    style={{ width: "63%" }}
                  >
                    {key+") "}
                    {question.answers[key].substring(0, 2)}
                    {question.answers[key].slice(2)}
                  </div>
                  <div
                    className="col-md-2"
                    style={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <img alt="" src={imageUrl} />
                  </div>
                </div>
              );
            })}
            
          </div>
        </div>
      ))
      } 
    </div>
  </div>}
  <audio ref={audioRef} src={audioSrc} style={{display: "none"}} />
    </div>
  );
};

export default DisplayVideo;
