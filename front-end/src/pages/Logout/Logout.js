// src/Logout.js
import React from "react";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket
  
} from "@fortawesome/free-solid-svg-icons";
import './Logout.css';
const Logout = () => {
  const navigation = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation("/");
      sessionStorage.removeItem('current_user');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  return <a  onClick={handleLogout}><FontAwesomeIcon
  icon={faRightFromBracket}
  size="2xl"
  className="pdf-container-nav-icon logout" 
  color="darkgray"
/></a>;
};

export default Logout;
