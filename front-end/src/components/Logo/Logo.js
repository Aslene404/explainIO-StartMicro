import React ,{useContext} from "react";
import logo from "../../assets/logoIcon.png";
import MyContext from "../../Provider/MyContext";
import './Logo.css';
import { Link} from "react-router-dom";
const Logo = ({generation,handleOpenQuiteCourseCreationModal}) => {

    const { processOn  } = useContext(MyContext);

return  <>
   {generation || processOn ? (
    <div className="logo-container"
      
      onClick={handleOpenQuiteCourseCreationModal}>
      <img src={logo} alt="Logo" className="logo-container-img" />
      <span className="logo-name logo-container-name">EXPLAINIO</span>
    </div>
  ) : (
    <Link
      to="/home"
      className="logo-link"
    >
      <div
       className="logo-content"
      >
        <img  src={logo} alt="Logo" />
        <span className="logo-name">EXPLAINIO</span>
      </div>
    </Link>
  )}
  </>

  

};

export default Logo;
