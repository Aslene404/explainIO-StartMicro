
import React,{useEffect, useState} from "react";
import "./MiniWarningPopup.css"
const MiniWarningPopup = ({text, show}) => {
    const [showModel,setShowModel]=useState(false)
  useEffect(()=>{
if(show){
    setShowModel(true)
    setTimeout(()=>{setShowModel(false)},2000)
}
  },[show])

  return (
    <div>
    <div
      className={`modal ${showModel ? 'show' : ''}`}
      tabIndex="1"
      role="dialog"
      aria-hidden={!showModel}
      style={{ display: showModel ? 'block' : 'none', bottom: '0' }}
    >
      <div className="modal-dialog p-0" >
        <div className="modal-content popUpContent" style={{padding:"10px"}} >
          <div className="modal-body" style={{padding:"0px",display: "flex", justifyContent: "center", alignItems: "center", color: "#ffffff", fontSize:"14px" }}>
          {text}
          </div>
        </div>
      </div>
    </div>
  </div>
    
  );
};

export default MiniWarningPopup;
