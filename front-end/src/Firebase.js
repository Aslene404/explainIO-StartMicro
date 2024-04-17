import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4v4j4VUbOgimWMzJxV5zDuq8V11ZodOQ",
  authDomain: "explain-io-temp.firebaseapp.com",
  projectId: "explain-io-temp",
  storageBucket: "explain-io-temp.appspot.com",
  messagingSenderId: "782812471668",
  appId: "1:782812471668:web:f4933a2ec72baf0ee64c21",
  measurementId: "G-LFG3VG001Z"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const auth = firebase.auth();
const firestore = firebase.firestore();

export { storage, firestore, auth };
export default firebase;
