import React, { useEffect, useState } from "react";
import { auth } from "../Firebase";

import { useNavigate } from "react-router-dom";
const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    

    const checkUserToken = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
              
              setIsLoggedIn(true);
            } else {
                
                setIsLoggedIn(false);
                return navigate('/login');
              
            }
          });
       
    }
    useEffect(() => {
            checkUserToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isLoggedIn]);
    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}
export default ProtectedRoute;