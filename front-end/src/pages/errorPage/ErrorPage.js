import React from 'react'
import './ErrorPage.css';
import logo from '../../assets/logoIcon.png';
import content from '../../assets/Vector.png'
import { setBackgroundImage } from "../../utils/helpers"
const ErrorPage = () => {
  setBackgroundImage(false);

  return (
    <div  >
      <div className='error-content-logo'>
        <img className='error-content-image' src={logo} alt="logoExplainIO" />
        <h6  className='error-content-title'>EXPLAINIO</h6>
      </div>
      <div className='error-content'>
      <div className='error-content-content'>
        <img  className='content-picture'src={content} alt="errorPicture" />
        <p className='content-phrase'>ExplainIO wird gerade gewartet und ist voraussichtlich bis zum 01.01.2024 nicht verfügbar. Wir danken dir für dein Verständnis. Bei Fragen: info@raqmwave.com</p>
      </div>
      </div>
      <div className="version">
          V1.0.6

        </div>
      
    </div>
  )
}

export default ErrorPage