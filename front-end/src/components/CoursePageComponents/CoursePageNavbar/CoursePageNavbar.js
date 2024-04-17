import React from "react";
import { useTranslation } from "react-i18next";


const CoursePageNavbar = ({ navButton, handleNavButton }) => {
  const { t } = useTranslation();

  return (
    <div>
    <div style={{ display: "flex" }}>
      <div
        className="fragen-nav-btn"
        style={{
          borderBottom:
            navButton === "fragen" ? "3px solid #e11b19" : "none",
          cursor: navButton === "fragen" ? "default" : "pointer",
        }}
        onClick={() => handleNavButton("fragen")}
      >
        {t('questions')}
      </div>
      <div
        className="fragen-nav-btn"
        style={{
          borderBottom:
            navButton === "results"
              ? "3px solid #e11b19"
              : "none",
          cursor: navButton === "results" ? "default" : "pointer",
        }}
        onClick={() => handleNavButton("results")}
      >
        {t('results')}
      </div>
    </div>
    <div className="div-fragen-bar"></div>
  </div>
  );
};

export default CoursePageNavbar;
