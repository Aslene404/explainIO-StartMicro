import { createContext } from "react";

const MyContext = createContext({
    chapters: null,
    scenes: null,
    avatars: null,
    clickedScene: null,
    clickedType: null,
    videos: null,
    isQuestionCanceled:false
  });
export default MyContext;