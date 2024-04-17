
import React ,{useState,useEffect}from "react";
import "./PopupMultipleBtn.css"
const PopupMultipleBtn = ({text,btns, show}) => {
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;
   
  }, []);

  return (
<div className="modal modal-back" tabIndex="1" role="dialog" aria-hidden={!show} style={{ display: show ? 'block' : 'none'}}>
<div className="modal-dialog modal-dialog-centered" >
  <div className="modal-content popUpContent modal-body-container-style" >
    <div className="modal-body modal-body-style">
    <p className="text-center mb-4">{text}</p>
        <div className={` ${isArabic ? 'rtl' : 'ltr'}`} style={{ display: "flex", justifyContent: "space-around" }}>
            {
                btns.map((btn,index)=>{
                    return (<button
                      key={index}
                        onClick={btn.fn}
                        className="btn-remove-modal me-2" >
                       { btn.text}
                      </button>)
                })
            }
        </div>
    </div>
  </div>
</div>
</div>



    
  );
};

export default PopupMultipleBtn;
