import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { auth,firestore } from "../../Firebase";
import LoginMicrosoft from "../LoginMicrosoft";
import PopupWarning from "../../components/Popups/PopupWarning/PopupWarning";
import { collection, getDocs ,query, where ,addDoc,} from "firebase/firestore";
import "./Login.css"
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../../assets/logoIcon.png";
import { setBackgroundImage} from '../../utils/helpers';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import translations from './Login.json';

const loadTranslations = async (language) => {
  await i18n.use(initReactI18next)
  .init({
    resources: translations,
    lng: language,
  });
};
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showModel,setShowModel]=useState(false)
  const { t } = useTranslation();
  useEffect(()=>{
    setBackgroundImage(false)
  },[])
  const [language, setLanguage]= useState('');

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
  
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language]);
  
  useEffect(()=>{
    const Warning =JSON.parse(localStorage.getItem('Warning'));
    if(Warning ===  true){
      setShowModel(true);
      setTimeout(()=>{
        setShowModel(false);
        localStorage.removeItem('Warning')},2000)
    } },[])

    const handleSubmit = async (e) => { 
      e.preventDefault();
      if (!email || !password) {
        setError(t("invalidCredentials"));
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }

      try {
        await auth.signInWithEmailAndPassword(email,password)
        .then(async () => {
        //   try {
        //     const userCollection = collection(firestore, "User");
        //     const q = query(userCollection, where("email", "==", email));
        //     const querySnapshot = await getDocs(q);
           
        // if (querySnapshot.empty) {

        //   const newUser = { email: email, nbEssay: 0, paymentStatus: false };
        //   await addDoc(userCollection, newUser);
        // } else { 
        //      console.log("User already exists:", querySnapshot.docs[0].data());
        //    }
        //   } catch (error) {
        //     console.error("Error fetching data:", error);
        //   }
   
        })
        .catch((error) => {
          console.error(error);
        });
       } catch (error) {
         setError(
           t("loginError")
         );
       }}
    

  return (
    <div
      className="container-fluid align-items-center login-container">
    <div className="row" >
        <div className=" d-flex justify-content-center align-items-center login-elements-Container">
          <div
            className="form-signin w-100 m-auto  login-signIn"
          >
   <div className="login-logo " >
            <img src={logo} className="rotating-image" alt="Logo" style={{
              width:"40px"
            }} />
            <span className="logo-name">EXPLAINIO</span>
          </div>
            <form className="login-form" >
              <h1 className="h3  fw-normal text-light">{t("pleaseLogIn")}</h1>
              <div
                className={`form-floating ${
                  error && !email ? "has-danger" : ""
                } login-error`}
              >
                <input
                  type="email"
                  className={`custom-input ${
                    error && !email ? "is-invalid" : ""
                  }`}
                  id="floatingInput"
                  placeholder=""
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                />
                <label className="label-login" htmlFor="floatingInput">E-Mail-Adresse</label>
                {error && !email && (
                  <div className="error_msg">
                    {t("emailIsRequired")}
                  </div>
                )}
              </div>
              <div
                className={`form-floating ${
                  error && !password ? "has-danger" : ""
                }`}
              >
                <input
                  type="password"
                  style={{color:"lightGray"}}
                  className={`custom-input ${
                    error && !password ? "is-invalid" : ""
                  }`}
                  id="floatingPassword"
                  placeholder=""
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                />
                 <label htmlFor="floatingPassword" className="label-login">Passwort</label>
                {error && !password && (
                  <div className="error_msg">
                    {t("passwordRequired")}
                  </div>
                )}
              </div>
        
            <div className="form-check text-start my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="remember-me"
                  id="flexCheckDefault"
                />
                <div className="form-check-label login-check-label" htmlFor="flexCheckDefault">
                  {t('rememberMe')}
                </div>
              </div>
              
          
              <button
                className="btn btn_submit w-100 py-2"
                type="submit"
                onClick={handleSubmit}
              >
                <strong>{t('login')}</strong>
              </button>
            
              {error && (
                <div className="error_msg m-2" role="alert">
                  {error}
                </div>
              )}
              <div className="mt-2">
                <LoginMicrosoft />
              </div>
              <div className="my-2" style={{display:"flex", justifyContent:"center"}}>
              <Link to="/signUp" style={{textDecoration:"none"}}>
              <div  className="create-account"  htmlFor="flexCheckDefault">
                {t('createAccount')}
                </div>
                </Link>
               
              </div>
              <p className="py-3 text-light login-company" >
                &copy; RaqmWave 2023
              </p>
            </form>
          </div>
        </div>
      </div>
      <PopupWarning  text={t('noPermission')} show={showModel}/>
      <div className="version">
          V1.0.6
        </div>
    </div>
  );
};
export default Login;