import { auth } from "../Firebase";

const setBackgroundImage = (condition) => {
    const body = document.querySelector('body');
    if (condition) {
      body.style.backgroundImage = 'url("/backgroudImage.png")';
    } else {
      body.style.backgroundImage = 'url("/landing.png")';
    }
  };

const getCurrentDate=()=>{
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const dateString = `${day}-${month}-${year}`;
      return dateString;
}

const getCurrentUserName=()=>{

      const user = auth.currentUser.email;
      const extractedUsername = user.split("@")[0];
      const usernameWithSpace = extractedUsername.replace(".", " ");
      return usernameWithSpace ;
}


const arraysAreEqual=(arr1, arr2)=> {
  if (arr1.length !== arr2.length) {
      return false;
  }

  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
          return false;
      }
  }
  return true;
}

  export { setBackgroundImage ,getCurrentDate, getCurrentUserName, arraysAreEqual} ;