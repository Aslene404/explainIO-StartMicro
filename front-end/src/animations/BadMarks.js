import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import image1 from '../assets/animations/image1.png';
import image2 from '../assets/animations/image2.png';
import image3 from '../assets/animations/image3.png';
import image4 from '../assets/animations/image4.png';
import image5 from '../assets/animations/image5.png';
import image6 from '../assets/animations/image6.png';

const images = [image1, image2, image3, image4, image5, image6];

const BadMarks = () => {
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

export default BadMarks;
