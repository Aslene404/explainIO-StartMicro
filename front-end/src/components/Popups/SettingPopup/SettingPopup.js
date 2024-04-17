
import React,{useEffect, useState} from "react";
import "./SettingPopup.css"
import { languages } from "../../../Data/languages";
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const SettingPopup = ({text, show, onClose}) => {
  
    const [language,setLanguage]=useState(sessionStorage.getItem("language"))

    const handleLanguage=(event)=>{
        setLanguage(event.target.value)
        sessionStorage.setItem("language",event.target.value)
    }

    useEffect(()=>{
  sessionStorage.setItem("language",language)
    },[language])

//   useEffect(()=>{
// if(show){
//   setShowModel(true)
//     console.log("show is true")
//     // setTimeout(()=>{setShowModel(false)},2000)
// } else
// {
//   console.log("show is false")
// }
//   },[showModel])

  // Function to handle click outside of the popup
  const handleClickOutside = (event) => {
 
      const sideBar = document.querySelector('.side_bar');
      const menu = document.querySelector('.menu-button');

    if (show==true && !event.target.closest('.modal-content') && !sideBar.contains(event.target) &&  !menu.contains(event.target)) {
      console.log("parampam")
      onClose();
    }
  };

  useEffect(() => {
    // Attach event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Detach event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [show]); // Re-run effect when showModel changes




  return (
    <div>
    <div
      className={`modal ${show ? 'show' : ''}`}
      tabIndex="1"
      role="dialog"
      aria-hidden={!show}
      style={{ display: show ? 'block' : 'none' }}
    >
      <div className="modal-dialog p-0" style={{ height:"100%" , display:"flex", alignItems:"center" }}>
        <div className="modal-content popUpContent" style={{padding:"10px", backgroundColor:"rgba(0,0,0,0.7)", height:"35%" }} >
          <div className="modal-body" style={{padding:"0px",display: "flex", justifyContent: "center", alignItems: "center", color: "#ffffff", fontSize:"14px" }}>
          <div className="modal-body settings-modal-body" >
        <div onClick={()=>{onClose()}} >
      <FontAwesomeIcon icon={faCog} className="setting-icon"  />
    </div>
    <div style={{marginTop:"40px"}}>
        language
    </div>
        <div style={{paddingTop:"20px"}}>
        {languages.map((country) => (
            <div className="flag-container"  key={country.country}>
             <div style={{ display: 'flex', alignItems:"center" }}>
             <div>
                <img className="flag" src={country.flagImg} alt={`${country.country} Flag`} />
              </div>
              <div className="country-name">
                {country.country}
              </div>
            </div>
            <label className="nice-radio">
            <input value={country.language}  checked={language === country.language} type="radio" name="radioGroup" onChange={handleLanguage}
             />
  <span className="radio-dot"></span>

</label>
            </div>
          ))}
        </div>
        </div>
          </div>
        </div>
      </div>
    </div>
 </div> 




    
  );
};

export default SettingPopup;
