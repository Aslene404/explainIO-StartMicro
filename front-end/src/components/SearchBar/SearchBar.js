/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import date from "../../assets/icons/date.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchBar.css";
import { useTranslation } from "react-i18next";
import { auth } from "../../Firebase";

const SearchBar = ({ setFilteredCourses, courses, setNoResult }) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const { t } = useTranslation();
  const [searchMode, setSearchMode] = useState("name");
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => {
    const storedLanguage = sessionStorage.getItem("language");
    setIsArabic(storedLanguage === 'ar-XA') ;

  }, []);


  useEffect(() => {
    const filtered = courses.filter((course) => {
      const isOwner = course.courseOwner === getCurrentUserName();
    const isPrivate = course.CoursePrivacy;
      const titleMatch =
        course.Title &&
        course.Title.toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch =
        course.courseOwner &&
        course.courseOwner.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch =
        filterType === "all" ||
        (course.type && course.type.toLowerCase() === filterType.toLowerCase());
      const dateMatch =
        course.creationDate &&
        new Date(formatDate(course.creationDate)).toLocaleDateString() ===
          new Date(searchDate).toLocaleDateString();
      return searchDate
        ? (titleMatch || authorMatch) && dateMatch && typeMatch && (isOwner || isPrivate)
        : (titleMatch || authorMatch) && typeMatch && (isOwner || isPrivate);
    });
    if(filtered.length!==0){
      setNoResult(true)
    }
    setFilteredCourses(filtered);
  }, [searchTerm, filterType, courses, searchDate, searchMode]);

  const getCurrentUserName=()=>{

    const user = auth.currentUser.email;
    const extractedUsername = user.split("@")[0];
    const usernameWithSpace = extractedUsername.replace(".", " ");
    return usernameWithSpace ;
  }

  function formatDate(dateString) {
    const parts = dateString.split("-");
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    return formattedDate;
  }

  const handleDateChange = (date) => {
    setSearchDate(date);
  };

  return (
    <div  className={`search-container   ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="container-search">
        <div className="search-mode-big">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />

        <input
          className="search-input"
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-input-container">
          <div className="input-with-icon">
            <img src={date} alt="calendar" className="calendar-icon" />
            <DatePicker
              selected={searchDate ? new Date(searchDate) : null}
              onChange={handleDateChange}
              dateFormat="dd-MM-yyyy"
              className={`search-input form-control ${
                searchDate ? "" : "empty"
              }`}
              locale="de"
              isClearable
              placeholderText={t("date")}
              maxDate={new Date()}
            />
          </div>
        </div>
        <select
          className='select-search-bar'  
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">{t("all")}</option>
          <option value="dialog">{t("dialogue")}</option>
          <option value="podcast">{t("podcast")}</option>
          <option value="monolog">{t("monologue")}</option>
          <option value="textReader">{t("TextReader")}</option>

        </select></div>
        <div className="search-mode">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />

        {searchMode === "name" && (
          <input
            className="search-input"
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        {searchMode === "date" && (
          <div className="search-input-container">
            <div className="input-with-icon">
              <img src={date} alt="calendar" className="calendar-icon" />
              <DatePicker
                selected={searchDate ? new Date(searchDate) : null}
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy"
                className={`search-input form-control ${
                  searchDate ? "" : "empty"
                }`}
                locale="de"
                isClearable
                placeholderText={t("date")}
                maxDate={new Date()}
              />
            </div>
          </div>
        )}
        {searchMode === "type" && (
          <select
            className='select-search-bar '     
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">{t("all")}</option>
            <option value="dialog">{t("dialogue")}</option>
            <option value="podcast">{t("podcast")}</option>
            <option value="monolog">{t("monologue")}</option>
            <option value="textReader">TextReader</option>

          </select>
        )}
        </div>
        <select
          className="search-mode-buttons"
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}>
          <option value="name"> {t("name")}</option>
          <option value="date">{t("date")}</option>
          <option value="type"> {t("type")}</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
