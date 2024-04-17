import React, { useState, useEffect, useRef } from 'react';
import './UpdateCourseSideBar.css';
import close from '../../assets/effacer.png';
import { storage } from '../../Firebase';
import voice from "../../assets/picture.png";
import trash from "../../assets/poubelle.png";
import PopupMultipleBtn from "../Popups/PopupMultipleBtn/PopupMultipleBtn"
import { useTranslation } from "react-i18next";

const UpdateCourseSideBar = ({
  type,
  onClose,
  videos,
  clickedVideoIndex,
  deletedVideoIndex,
}) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [durations, setDurations] = useState(Array(videos.length).fill(null));
  const videoRefs = useRef(Array(videos.length).fill(null));
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchImageUrlsAndDurations = async () => {
      const urls = await Promise.all(
        videos.map(async (video, index) => {
          try {
            const imageRef = storage.ref().child(`${video.name}-thumbnail`);
            const url = await imageRef.getDownloadURL();
            return url;
          } catch (error) {
            console.error('Error fetching image URL:', error);
            return null;
          }
        })
      );

      setImageUrls(urls);
    };

    fetchImageUrlsAndDurations();
  }, [videos]);

  useEffect(() => {
    const fetchVideoUrls = async () => {
      const urls = await Promise.all(
        videos.map(async (video) => {
          try {
            const videoRef = storage.ref().child(`${video.name}`);
            const url = await videoRef.getDownloadURL();
            return url;
          } catch (error) {
            console.error('Error fetching video URL:', error);
            return null;
          }
        })
      );

      setVideoUrls(urls);
    };

    if (videos.length !== 0) {
      fetchVideoUrls();
    }
  }, [videos]);

  const handleVideoClick = (index) => {
    setScrollIndex(index);
    clickedVideoIndex(index);
  };

  const handleDeleteClick = (index) => {
    setVideoToDelete(index);
    setShowConfirmationModal(true);
  };

  const onConfirm = () => {
    deletedVideoIndex(videoToDelete);
    setShowConfirmationModal(false);
    setVideoToDelete(null);
  };
  
  const onCancel = () => {
    setShowConfirmationModal(false);
    setVideoToDelete(null);
  };
  

  const handleLoadedMetadata = (index) => (event) => {
    const duration = event.target.duration;
    setDurations((prevDurations) => [
      ...prevDurations.slice(0, index),
      duration,
      ...prevDurations.slice(index + 1),
    ]);
  };

  if (scrollIndex > videos.length - 1) {
    clickedVideoIndex(scrollIndex - 1);
    setScrollIndex(scrollIndex - 1);
  }
  const formatDuration = (duration) => {
    console.log("warini e duration trah", duration);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="UpdateCourseSideBar-container">
      <div onClick={onClose} style={{ cursor: 'pointer' }}>
        <img
          src={close}
          style={{ width: 35, height: 35, left: 10, position: 'absolute' }}
          alt="close"
        />
      </div>

      <div className="video-cards-container">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`video-card ${index === scrollIndex ? 'selected' : ''}`}
            onClick={() => handleVideoClick(index)}
            style={{
              width: index === scrollIndex ? '280px' : '240px',
              height: index === scrollIndex ? '180px' : '150px',
              border: index === scrollIndex ? '5px solid white' : 'none',
            }}
          >
            {(type === 'podcast'||type==="textReader") ? (
              <img
                src={voice}
                alt={video.name}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <>
                {imageUrls[index] && (
                  <img
                    src={imageUrls[index]}
                    alt={video.name}
                    style={{ width: '100%', height: '100%' }}
                  />
                )}
                
              </>
            )}
            {videoUrls[index] && (
                  <video
                    ref={(ref) => (videoRefs.current[index] = ref)}
                    onLoadedMetadata={handleLoadedMetadata(index)}
                    style={{ display: 'none' }}
                  >
                    <source src={videoUrls[index]} type="video/mp4" />
                  </video>
                )}
            {videos.length > 1 && index === scrollIndex && (
              <div className="delete-button" onClick={() => handleDeleteClick(index)}>
                <img
                  src={trash}
                  alt="trash"
                  className="trash-image"
                  style={{ width: 40, height: 40 }}
                />
              </div>
            )}
            <div className='time-element'>
              {durations[index] ? formatDuration(durations[index]) : t('loading')+'...'}
            </div>
          </div>
        ))}
      </div>

      <PopupMultipleBtn  
           show={showConfirmationModal}
           text={t('deleteChapterConfirmation')}
           btns={[
            {text:"Ok",fn:onConfirm},
            {text:"Cancel",fn:onCancel}]} />
    </div>
  );
};



export default UpdateCourseSideBar;
