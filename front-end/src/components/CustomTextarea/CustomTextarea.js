import React, { useEffect,useState,useContext} from "react";
import MyContext from "../../Provider/MyContext"; 

const CustomTextarea = ({
    SubIndex,
    MotherIndex,
    GrandMother,
    frage,
    prop_key,
    type,
    value,
    focusedLine,
    setFocusedLine,
    changeHandle,
    id
  }) => {
   const [content, setContent]= useState("") 
   const {textLanguage} = useContext(MyContext);
   useEffect(() => {
        const textarea = document.getElementById(id);
        if (textarea) {
          textarea.style.border =
            focusedLine &&
            focusedLine.MotherIndex === MotherIndex &&
            focusedLine.SubIndex === SubIndex
              ? "1px solid white"
              : "none";
        }
      }, [focusedLine,GrandMother,MotherIndex,SubIndex]);

  
    const autoAdjustTextareaHeight = () => {
        const textarea = document.getElementById(id);
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
  };
  useEffect(()=>{
  autoAdjustTextareaHeight()
},[  changeHandle,  ])
 
  const handleTextareaFocus = () => {
    if(GrandMother!==undefined&&GrandMother!=null){setFocusedLine({
        GrandMother: GrandMother,
        MotherIndex: MotherIndex,
        SubIndex: SubIndex,
      })} else {setFocusedLine({
        MotherIndex: MotherIndex,
        SubIndex: SubIndex,
      })}
  };
  
  const handleTextareaBlur = () => {
    setFocusedLine(null);
  };
    return (
      <textarea
      id={id}
      rows={type==="Monolog"||type==="Podcast"? value.split(/[.!?]+/).length:2}
      value={value}
      onChange={(e) => { 
        setContent(e.target.value)
          if(type==="Dialog")
          {
            changeHandle(MotherIndex,SubIndex,e.target.value)
          }
          if(type==="Monolog")
          {
            changeHandle(SubIndex,e.target.value)
          }
          if(type==="FrgagenOption")
          { 
            changeHandle(prop_key, e.target.value)
          }
          if(type==="Frage"||type==="Chapters")
          {
            changeHandle(e.target.value)
          }
          if(type==="FrgagenOptionUpdate")
          {
            
            changeHandle(frage,prop_key,e.target.value)
          }
          if(type==="FrageModeUpdate")
          {
            changeHandle(value,e.target.value)
          }
      }}
      onFocus={() => handleTextareaFocus(MotherIndex, SubIndex)}
      onBlur={() => handleTextareaBlur()}
      onInput={() => autoAdjustTextareaHeight()}
      style={{
        textAlign:textLanguage === 'ar-XA'? "right":"left",
        height: "auto",
        color: "white",
        padding:"0px", 
        boxShadow: "none",
        textAlign: "start",
        outline: "none",
        background: "transparent",
        width: "92.1%",
        overflow: "hidden",
        resize: "none",
        borderRadius: "4px",
      }}
    />
    );
  };

  export default CustomTextarea;