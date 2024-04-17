
import React,{useEffect, useState} from "react";
import "./PopupWarning.css"
const PopupWarning = ({text, show}) => {
  
    const [showModel,setShowModel]=useState(false)

  useEffect(()=>{
if(show){
    setShowModel(true)
    setTimeout(()=>{setShowModel(false)},3000)
}
  },[show])

  return (
      <div className="modal modal-back" tabIndex="1" role="dialog" aria-hidden={!showModel} style={{ display: showModel ? 'block' : 'none'}}>
  <div className="modal-dialog modal-dialog-centered" >
    <div className="modal-content popUpContent modal-body-container-style" >
      <div className="modal-body modal-body-style text-center">
        {text}
      </div>
    </div>
  </div>
</div>
    
  );
};

export default PopupWarning;
