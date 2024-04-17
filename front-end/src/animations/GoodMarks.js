import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import image7 from '../assets/animations/image7.png';
import image8 from '../assets/animations/image8.png';
import image9 from '../assets/animations/image9.png';
import image10 from '../assets/animations/image10.png';
import image11 from '../assets/animations/image11.png';
import image12 from '../assets/animations/image12.png';

const images = [image7, image8, image9, image10, image11, image12];

const GoodMarks = () => {
  const imageSize = {
    width: '100px',
    height: '100px',
  };

  const animationVariants = {
    hidden: { y: '87vh', scale: 0.5, opacity: 0 },
    visible: { y: 0, scale: 1, opacity: 1 ,transitionEnd: { opacity: 0 }},
  };

  const paddingBetweenPictures = 20;

  const [animationKeys, setAnimationKeys] = useState({});

  useEffect(() => {
    const newAnimationKeys = {};
    images.forEach((_, index) => {
      newAnimationKeys[index] = Math.random();
    });
    setAnimationKeys(newAnimationKeys);
  }, []);

  const handleAnimationComplete = (index) => {
    const timer = setTimeout(() => {
      setAnimationKeys((prevKeys) => ({
        ...prevKeys,
        [index]: Math.random(),
      }));
    }, 500); // Adjust the delay based on your animation duration
    return () => clearTimeout(timer);
  };

  return (
    <div
      className="overlay-container"
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {images.map((imageUrl, index) => (
        <motion.div
          key={index}
          style={{ ...imageSize, marginLeft: index > 0 ? paddingBetweenPictures : 0 }}
        >
          <motion.img
            key={animationKeys[index]}
            src={imageUrl}
            alt={`Animated Picture ${index}`}
            className="animated-picture"
            initial="hidden"
            animate="visible"
            variants={animationVariants}
            transition={{ duration: 1.5, delay: index * 0.5 }}
            style={imageSize}
            onAnimationComplete={() => handleAnimationComplete(index)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default GoodMarks;
