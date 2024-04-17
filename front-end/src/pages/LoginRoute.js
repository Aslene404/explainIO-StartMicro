import React, { useEffect, useState } from "react";
import { auth } from "../Firebase";

import {useNavigate } from "react-router-dom";
const LoginRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
   
    const checkIsStudent=()=>{
    auth.onAuthStateChanged((user) => {
         if (user && auth.currentUser.email.endsWith('@velptec.academy')) {
          return true
         } else return false
       });
    }

    const checkUserToken = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {          
              setIsLoggedIn(true);
              if(checkIsStudent)
              {
                localStorage.setItem("activeButton", "start");
              } else
              {
                localStorage.setItem("activeButton", "Neues Projekt");
              }
              return navigate('/home');
            } else {
                setIsLoggedIn(false);
            }
          });
       
    }
    useEffect(() => {
            checkUserToken();
        });
    return (
        <React.Fragment>
            {
                !isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}
export default LoginRoute;