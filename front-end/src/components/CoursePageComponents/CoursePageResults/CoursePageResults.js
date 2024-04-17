import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import * as noResultAnimation from '../../../assets/LottieAnimations/noResultAnimation2.json';
import Lottie from 'react-lottie';

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import './CoursePageResults.css';
import { firestore } from "../../../Firebase";
import { useTranslation } from "react-i18next";

const CoursePageResults = ({id}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [testResults, setTestResults] = useState([]);
  const { t } = useTranslation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

 
  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const testsCollection = collection(firestore, "Tests");
        const testsQuery = query(testsCollection, where("courseId", "==", id));
        const testsSnapshot = await getDocs(testsQuery);

        const results = [];
        testsSnapshot.forEach((doc) => {
          const data = doc.data();
          results.push({
            userName: data.userEmail,
            resultPercentage: data.result,
            date: data.timestamp.toDate().toLocaleDateString(),
          });
        });

        setTestResults(results);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };
    fetchTestResults();
  }, [id]);
  const defaultOptions2 = {
    loop: true,
    autoplay: true, 
    animationData: noResultAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    },
  };



  const filteredResults = testResults.filter((result) => {
    const fullName = result.userName;
    const nameMatches = fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (
      resultFilter === "all" ||
      (resultFilter === "passed" && result.resultPercentage >= 50) ||
      (resultFilter === "failed" && result.resultPercentage < 50)
    ) {
      return nameMatches;
    }

    return false;
  });

  const sortedResults = filteredResults.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="coursePageResults-container" >
    <div
     className="coursePageResults-elements"
    >
      {screenWidth>=425 &&<h3>{t('testResults')}</h3>}
      <div
        className="coursePageResults-row"
      >
        <div className="result-search">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-icon"
          />
          <input
            className="result-search-input"
            type="text"
            placeholder={t('searchByName')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-result"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
          size="1"
        >
        <option value="all">{t('all')}</option>
        <option value="passed">{t('passed')}</option>
        <option value="failed">{t('failed')}</option>

        </select>
      </div>{" "}
    </div>
   {sortedResults?.length>0? 
   <table className="result-table">
      <thead>
        <tr>
        <th>{t('name')}</th>
        {screenWidth>=425 &&<th>{t('email')}</th>}
        {screenWidth>=425 &&<th>{t('result')}</th>}
        <th>{t('percentage')}</th>
        <th>{t('date')}</th>

        </tr>
      </thead>
      <tbody>
        {sortedResults.map((result, index) => {
          let name = "";
          let secondName = "";

          let pattern = /^([a-zA-Z]+)(?:\.([a-zA-Z]+))?@/;
          let match = result.userName.match(pattern);

          if (match) {
            name = match[1];
            secondName = match[2] || "";
          }

          return (
            <tr key={index}>
              <td>{name + " " + secondName}</td>
              {screenWidth>=425 && <td>{result.userName}</td>}
            {screenWidth>=425 &&  <td
                style={{
                  color:
                    result.resultPercentage >= 50
                      ? "#008000"
                      : "#e11b19",
                }}
              >
                {result.resultPercentage >= 50
                  ? t('passed')
                  : t('failed')}
              </td>}
              <td style={{
                  color:screenWidth<=425 ?
                    (result.resultPercentage >= 50   
                      ? "#008000"
                      : "#e11b19"):""
                }}>{result.resultPercentage}%</td>
              <td>{result.date}</td>
            </tr>
          );
        })}
      </tbody>
    </table>:(<div className="no-result"><Lottie options={defaultOptions2}
              height={300}
              width={200}
              speed={1} 
              isStopped={false}
              isPaused={false}
              /></div>)}
  </div>
  );
};

export default CoursePageResults;
