import React,{useState,useEffect} from 'react';
import './Greeting.css';
import { auth } from '../../Firebase';
import { useTranslation } from "react-i18next";

function Greeting() {
  const { t } = useTranslation();
  const now = new Date();
  const currentHour = now.getHours();
  const user = auth.currentUser.email;
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {

    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;

   
  }, []);
  const extractedUsername = user.includes('.')
        ? user.split('@')[0].split('.')[0]
        : user.split('@')[0];

  const capitalizedUsername =
        extractedUsername.charAt(0).toUpperCase() + extractedUsername.slice(1);


  return (
    <div className={` ${isArabic ? 'rtl' : 'ltr'}`}>
      {(currentHour >= 0 && currentHour < 12) &&
      <p className="greeting">{t('morning')} {capitalizedUsername}</p>
      }
      {(currentHour >= 12 && currentHour < 15) &&
      <p className="greeting">{t('afternoon')} {capitalizedUsername}</p>
      }
      {(currentHour >= 15 && currentHour < 20) &&
      <p className="greeting">{t('evening')} {capitalizedUsername}</p>
      }
      {(currentHour >= 20 && currentHour < 24) &&
      <p className="greeting">{t('night')} {capitalizedUsername}</p>
      }
    </div>
  );
}

export default Greeting;
