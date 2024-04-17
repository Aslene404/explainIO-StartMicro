/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import emptystar from "../../assets/star.png"
import fullStar from "../../assets/fullStar.png"
import './FeedBack.css'
import { firestore,auth  } from '../../Firebase';
import { collection, getDocs ,query, where, updateDoc , doc } from "firebase/firestore";
import PopupWarning from "../Popups/PopupWarning/PopupWarning"
import user from "../../assets/user.png"
import { useTranslation } from "react-i18next";

const FeedBack = () => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [showModal, setShowModal]= useState(false)
  const [feedback, setFeedback]= useState({
    rating:0,
    opinion:"",
    userId:auth.currentUser.uid,
    userEmail:auth.currentUser.email,
    courseId:id
  })
  const [allFeedbacks,setAllFeedbacks]= useState([])
  const { t } = useTranslation();

  useEffect(  ()=>{
    getFeedback()

},[])


const getFeedback= async()=>
{
  try {
    const feedbackCollection = collection(firestore, "Feedback");
    const q = query(feedbackCollection,  where("courseId", "==", id));
    const querySnapshot = await getDocs(q);
   let feedbacks=[]
    for (const doc of querySnapshot.docs) {
      const feedbackData = doc.data();
      if(feedbackData.userId===auth.currentUser.uid)
      {setFeedback(feedbackData)
        feedbacks.push(feedbackData);}
      else
      {
        feedbacks.push(feedbackData)
      }
    }
  setAllFeedbacks(feedbacks)
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

  const AddFeedback = async (Feedbackdata) => {
    try {
      const feedbackCollection = collection(firestore, "Feedback");
      const q = query(feedbackCollection, where("userId", "==", auth.currentUser.uid),  where("courseId", "==", id));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.docs.length>0)
      {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(firestore, "Feedback", docId), Feedbackdata);
        setShowModal(true);
        setTimeout(() => {
           setShowModal(false);
          }, 3000);
      } else
      {
        const feedbackCollection = firestore.collection("Feedback");
        const docRef=await feedbackCollection.add(Feedbackdata);
        if(docRef)
        {
          setShowModal(true);
          setTimeout(() => {
             setShowModal(false);
            }, 3000);
        }
      }
    } catch (error) {
      console.error('Error adding data to the collection: ', error);
    }
  };

    const handleTextChange = (e) => {
      const opinion = e.target.value;
      setFeedback({
        ...feedback,
        opinion: opinion,
      });
    };
    
    const handleStarClick =(rating)=>{
      if(feedback.rating === 1 && rating === 1)
      {
        setFeedback({
          ...feedback,
          rating: 0,
        });
      }else
      {
        setFeedback({
          ...feedback,
          rating: rating,
        });
      }
    } 

    const handleSaveFeedback = async (e) => {
      e.preventDefault();
      if (feedback.opinion==null || feedback.opinion==="") {
        setError("your opinion is required");
        setTimeout(() => {
          setError("");
        }, 3000);
        return;
      }
      try {
      AddFeedback(feedback)
      getFeedback()
      } catch (error) {      
        setError("error feedback :", error);
      }
    };



return (
  <div className="feedback-content">
    <div className={`feedback-page `}>
  <div className="global-container">
  <div  className='feedback-container '>
  <div className='Star-FeedBack'>
  {
    [1, 2, 3, 4, 5].map((star) => (
      <span key={star} onClick={() => handleStarClick(star)}>
        {
          star <= feedback.rating ?
            <img className='star' src={fullStar} alt="full star" /> :
            <img className='star' src={emptystar} alt="empty star" />
        }
      </span>
    )) 
  }
</div>
<div className='feedback-textarea'>
  <textarea onChange={handleTextChange}  value={feedback.opinion}/></div>
  <span className='error  ms-5'>{error && !feedback.opinion? error : ''}</span>
  <div className='btn-container'>
    <button className='send-btn' onClick={handleSaveFeedback}>
    {t('send')}
 </button>
      </div>
  </div>
  <div className='container-feedback mt-5'  >
  {
    allFeedbacks.map((feedback, index)=>{let name = "";
    let secondName = "";
    
    let pattern = /^([a-zA-Z]+)(?:\.([a-zA-Z]+))?@/;
    let match = feedback.userEmail.match(pattern);
    
    if (match) {
      name = match[1];
      secondName = match[2] || ""; 
    }
    
          return (
      <div className='person_feedback'  key={index}>
        <div className='person-feedback-container' >
        <div className=' person-feedback-content'style={{display: "flex", flexDirection: "row"}} >
         <img src={user} className='img'alt='user'/>
        
        {feedback.userId !== auth.currentUser.uid?
        <div className="" style={{color:"white" , padding: 10}}>
          
            <strong>{name+" "+secondName}</strong>
            
        </div>:<div className="" style={{color:"#e11b19", padding: 10}}>
            <strong>{t('you')}</strong>
            
        </div>}
        </div>
        <div style={{display:"flex",alignItems:"center",color:"#fff"}}><div style={{width:"100%"}}>{feedback.opinion}</div>
        <div className="col-md-4" style={{display:"flex",justifyContent:"end"}}>
         { Array.from({ length: 5 }, (_, index) => (
          <span  key={index} className={index < Math.floor(feedback.rating) ? 'filled' : index < feedback.rating ? 'half-filled' : 'empty'}>&#9733;</span>
        ))}
        </div></div></div>
          </div>)
        
    })
    
  }
  </div>
  <PopupWarning show={showModal} text={t('feedbackSent')}/>
</div> 
<div className="version">
          V1.0.6

        </div>
</div>

</div>
 );
};

export default FeedBack;
