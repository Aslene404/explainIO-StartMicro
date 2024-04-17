import React, { useState, useRef, useEffect, useContext } from "react";
import { storage, firestore } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc 
} from "firebase/firestore";
import {
  faBackward,
  faPlay,
  faPause,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import ReactPlayer from "react-player";
import "./DisplayScene.css"
import UpdateCourseSideBar from "../UpdateCourseSideBar/UpdateCourseSideBar";
import MyContext from "../../Provider/MyContext";
import settings from '../../assets/parametres.png'
const VideoPlayer = ({ type }) => {
  const [isPlayed, setIsPlayed] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);
  const [videoButton, setVideoButton] = useState("pause");
  const [videos, setVideos] = useState([]);
  const {updateMode, course, setCourse, showSideBar, setShowSideBar}= useContext(MyContext);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (course && course.Scenes) {
      const videoList = course.Scenes.map((scene) => {
        return {
          name: scene.file_name,
          scene: scene.sceneName,
        };
      });

      setVideos(videoList);
    }
  }, [ course]);


  const fetchVideoUrl = async (name) => {
    try {
      const videoRef = storage.ref().child(`${name}`);
      const url = await videoRef.getDownloadURL();
      setVideoUrl(url);
    } catch (error) {
      console.error("Error fetching video URL:", error);
    }
  };
  

  if (videos.length !== 0) {
    fetchVideoUrl(videos[currentVideoIndex]?.name);
  }
  
  const handleSwitchVideo = () => {
    setIsPlayed(false);
    if (videos.length > 0) {
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
  
  const handleSeekChange = (value) => {
    setPlayed(parseFloat(value));
  };

  const handlePreviousVideo = () => {
    setIsPlayed(false);
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
    fetchVideoUrl(videos[currentVideoIndex - 1].name);
    setPlayed(0);
    setVideoButton("pause");
  };

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().play();
    }
    setIsPlayed(true);
    setVideoButton("play");
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().pause();
    }
    setVideoButton("pause");
    setIsPlayed(false);
  };
  const handleShowSideBar = () =>{
    setShowSideBar(true);
  }
  const handleCloseSIdeBar = () => {
    setShowSideBar(false);
  }
  const handleSlectedVideoIndex = (index) =>{
       setCurrentVideoIndex(index);
  }

  const handleDeletedVideoIndex = async (index) => {
    if(index === videos.length-1)
    {
      setCurrentVideoIndex(index-1);
    }

 
     
     const coursesCollection = collection(firestore, "Courses");
  const course_query = query(coursesCollection, where("courseId", "==", course.courseId));
  try {
    const updatedScenes = [...course.Scenes];
         
         updatedScenes.splice(index, 1);
         
        
    const querySnapshot = await getDocs(course_query);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref; 
       await updateDoc(docRef, {
        Scenes: updatedScenes,
      });
      getCourseById()

    });
  } catch (error) {
    console.error("Error deleting course:", error);
  }

 
     setVideos((prevVideos) => {
       const updatedVideos = [...prevVideos];
       updatedVideos.splice(index, 1);
       return updatedVideos;
     });
 
     
     
   }
   const getCourseById= async() => {
    const coursesCollection = collection(firestore, "Courses");
      const course_query = query(coursesCollection, where("courseId", "==", course.courseId));
      try {
        const querySnapshot = await getDocs(course_query);
        setCourse(querySnapshot.docs[0].data())
      } catch (error) {
        console.error("Error getting course:", error);
      }
      }

      useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    

  return (
    <div className="scenes-container">
      {!videos.length ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className={`scenes-container ${showSideBar ? 'with-sidebar' : 'without-sidebar'}`}>
          <div className={`scene-name ${showSideBar ? 'scene-name-withSideBar' : ''}`}>{videos[currentVideoIndex]?.scene}</div>
          {(type === "podcast" ||type==="textReader")&& (
            <div className="audio-visualizer">
              {[...Array(100)].map((_, index) => (
                <div
                  key={index}
                  className={isPlayed ? "audio-bar" : "audio-bar-pause"}
                ></div>
              ))}
            </div>
          )}
          <ReactPlayer
            ref={playerRef}
            controls={true}
            style={{
              marginTop: 20,
              marginBottom: (course.type === "podcast" ||course.type==="textReader") ? 20 : 0,
            }}
            width={screenWidth <= 775 ? '80vw' : '50vw'}
            height={(type === "podcast" || type==="textReader") ? "70px" : "auto"}
            url={videoUrl}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleSwitchVideo}
            played={played}
            onChange={handleSeekChange}
          />

          <div className="scene-btns-container">
            <div className={`scene-btns ${showSideBar ? 'scene-btns-withSideBar' : 'scene-btns-withoutSideBar'}`} >
              <button
                onClick={handlePreviousVideo}
                disabled={currentVideoIndex === 0}
                className="videoButton"
              >
                <FontAwesomeIcon
                  className="videoButton-icon  back-icon"
                  icon={faBackward}
                />
              </button>
              <div>
                {videoButton === "pause" ? (
                  <button
                    onClick={handlePlay}
                    className="videoButton"
                  >
                    <FontAwesomeIcon
                      className="videoButton-icon play-icon"
                      icon={faPlay}
                    />
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="videoButton"
                    style={{
                      background: videoButton === "play" ? "#e11b19" : "",
                    }}
                  >
                    <FontAwesomeIcon
                      className="videoButton-icon"
                      icon={faPause} 
                    />
                  </button>
                )}
              </div>
              <button
                onClick={handleSwitchVideo}
                disabled={currentVideoIndex === videos.length - 1}
                className="videoButton"
              >
                <FontAwesomeIcon
                  className="videoButton-icon forward-icon"
                  icon={faForward}
                />
              </button>
              {updateMode && <div onClick={handleShowSideBar}className="rotating-image" style={{top:60, right:60, position:  "absolute", cursor: "pointer"}}><img src={settings} alt="settings" style={{width:60, height:60}}/></div>}

            </div>
            {showSideBar &&(
              <UpdateCourseSideBar  setVideoButton={setVideoButton} type={type} onClose={handleCloseSIdeBar} videos={videos} clickedVideoIndex={handleSlectedVideoIndex} deletedVideoIndex={handleDeletedVideoIndex}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
