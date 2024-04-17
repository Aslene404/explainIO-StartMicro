import React from "react";
import firebase, { auth,firestore, } from "../Firebase";
import { useNavigate } from "react-router-dom";
import microsoft from "../assets/microsoft.png"
import { collection, getDocs ,query, where,  addDoc } from "firebase/firestore";
const MicrosoftLogin = () => {
  const navigation = useNavigate();
  const signInWithMicrosoft = async (e) => {
    e.preventDefault();
    const provider = new firebase.auth.OAuthProvider("microsoft.com");
    await auth
      .signInWithPopup(provider)
      .then(async (result) => {
        try {
          console.log("---------------------je l houni 1");
          const userCollection = collection(firestore, "User");
          const q = query(userCollection,  where("email", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(q);
         if(querySnapshot.docs.length===0)
         {   

          const userCollectionRef = collection(firestore, "User");
          console.log("je lehne ou nn ", userCollection);
          try {
            const docRef = await addDoc(userCollectionRef, {
              email: auth.currentUser.email,
              nbEssay: 0,
              paymentStatus: false
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
         }
         else
         { 
           console.log("user user querySnapshot.docs",querySnapshot.docs)
         }
        } catch (error) {
          console.error("Error fetching data:", error);
        }


        navigation("/home");
          // if (
          //   !auth.currentUser.email==="lhea.reinhold@futureself.education"||
          //   !auth.currentUser.email?.endsWith('@velptec.de') ||
          //   !auth.currentUser.email?.endsWith('@velptec.academy')
          // ) {
          //   auth.signOut();
          //   localStorage.setItem('Warning', true);
          //   navigation("/login");
          //   deleteUser(auth.currentUser).then(() => {
          //   }).catch((error) => {
          //     console.log("error :",error)
          //   });
          
          // } else {
          //   navigation("/home");
          // }      
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return  <button
  className="btn btn_microsoft p-1 w-100 py-2"
  type="submit"
  onClick={signInWithMicrosoft}
>
<img 
className="me-3"
src={microsoft}
   style={{
    width :"25px",
    height :"25px" }}
    alt="microsoft"/>

  <strong>Weiter mit Microsoft</strong>
  
  </button>
  

};

export default MicrosoftLogin;