
import React, {useEffect } from "react";
import { BrowserRouter, Routes, Route ,Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";
import LoginRoute from "./pages/LoginRoute";
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage';
import ErrorPage from './pages/errorPage/ErrorPage';
import LoadScript from './pages/LoadScript/LoadScript';
import CoursePage from "./pages/CoursePage/CoursePage";

import MyContextProvider from "./Provider/MyContextProvider";
import SignUp from "./pages/SignUp/SignUp";
function App (){
  useEffect(() => {
    const setFavicon = (newFaviconPath) => {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = newFaviconPath;

      document.head.appendChild(link);
    };
    const newFaviconPath = '/logoicon.png';
  
    setFavicon(newFaviconPath);
  }, []); 

  useEffect(()=>{
    const val =sessionStorage.getItem("language")
if(val==null|| !val)
{
  switch(navigator.language)
  {
  case "en" : sessionStorage.setItem("language","en-US") ;
  break
  case "de" : sessionStorage.setItem("language","de-DE") ;
  break
  case "ar" : sessionStorage.setItem("language","ar-XA") ;
  break  
  case "fr-FR" : sessionStorage.setItem("language","fr-FR") ;
  break 
  
  default :
 
  
   } 
}
  },[sessionStorage.getItem("language")])
  return (
    <BrowserRouter>
      <MyContextProvider>
      <Routes>
       <Route path="/login" element={<LoginRoute><Login /></LoginRoute>}></Route>
       <Route path="/signUp" element={<LoginRoute><SignUp /></LoginRoute>}></Route>
       <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
       <Route path="/" element={<LandingPage />}></Route>
       <Route path="*" element={<ErrorPage />}></Route>
       <Route path="/loadScript" element={<ProtectedRoute><LoadScript /></ProtectedRoute>}></Route>
       <Route path="/coursePage/:id" element={<CoursePage/>}></Route>     
       <Route path="/coursePage/:id" element={<CoursePage/>}></Route>
       <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
        </MyContextProvider>
    </BrowserRouter>
  );
}

export default App;
