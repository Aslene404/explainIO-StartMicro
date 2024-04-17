/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PaypalPopUp.css";
import PayPalIntegration from "../../PaypalBtn/PaypalBtn"
import { useTranslation } from "react-i18next";

function PaypalPopUp({ show}) {
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;
   
  }, []);


  const handleMouseDown = (e) => {
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });

      const modal = document.getElementById("chapterModal");
      modal.style.left = modal.offsetLeft + deltaX + "px";
      modal.style.top = modal.offsetTop + deltaY + "px";
    }
  };
const handleCancel=()=>{
  localStorage.setItem("activeButton", "start");
  window.location.reload()
}


  return (
    <div className={`${show ? "backdrop-chapter " : ""}  ${isArabic ? 'rtl' : 'ltr'} `}>
      <div
        id="chapterModal"
        className={`modal ${show ? "show" : ""} `}
        tabIndex="1"
        role="dialog"
        aria-hidden={!show}
        style={{ display: show ? "block" : "none" }}
        onMouseMove={handleMouseMove}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onMouseDown={handleMouseDown}
        >
          <div className="modal-content popUpContent">
            <div className="modal-body">
             
            <div>
    <p className="text-style text-center mb-4">{t('PaypalMsg')}</p>
   </div>

            <PayPalIntegration />
           <div style={{display:"flex", justifyContent:"center"}}>
           <button
                onClick={handleCancel}
                className="btn-remove-modal me-2" >
               cancel
              </button>
           </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaypalPopUp;