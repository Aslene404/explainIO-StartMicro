/*********************************************german************************************* */
import Bernd_de_DE from "../voices/voices_german/Bernd_de-DE.mp3";
import Conrad_de_DE from "../voices/voices_german/Conrad_de-DE.mp3";
import Elke_de_DE from "../voices/voices_german/Elke_de-DE.mp3";
import Kasper_de_DE from "../voices/voices_german/Kasper_de-DE.mp3";
import Klarissa_de_DE from "../voices/voices_german/Klarissa_de-DE.mp3";
import Maja_de_DE from "../voices/voices_german/Maja_de-DE.mp3";


import Bernd_0_de_DE from "../voices/voices_german/Bernd_0_de-DE.mp3";
import Conrad_0_de_DE from "../voices/voices_german/Conrad_0_de-DE.mp3";
import Elke_0_de_DE from "../voices/voices_german/Elke_0_de-DE.mp3";
import Kasper_0_de_DE from "../voices/voices_german/Kasper_0_de-DE.mp3";
import Klarissa_0_de_DE from "../voices/voices_german/Klarissa_0_de-DE.mp3";
import Maja_0_de_DE from "../voices/voices_german/Maja_0_de-DE.mp3";
/*********************************************english************************************* */
import Bernd_en_US from "../voices/voices_english/Bernd_en-US.mp3";
import Conrad_en_US from "../voices/voices_english/Conrad_en-US.mp3";
import Elke_en_US from "../voices/voices_english/Elke_en-US.mp3";
import Kasper_en_US from "../voices/voices_english/Kasper_en-US.mp3";
import Klarissa_en_US from "../voices/voices_english/Klarissa_en-US.mp3";
import Maja_en_US from "../voices/voices_english/Maja_en-US.mp3";

import Bernd_0_en_US from "../voices/voices_english/Bernd_0_en-US.mp3";
import Conrad_0_en_US from "../voices/voices_english/Conrad_0_en-US.mp3";
import Elke_0_en_US from "../voices/voices_english/Elke_0_en-US.mp3";
import Kasper_0_en_US from "../voices/voices_english/Kasper_0_en-US.mp3";
import Klarissa_0_en_US from "../voices/voices_english/Klarissa_0_en-US.mp3";
import Maja_0_en_US from "../voices/voices_english/Maja_0_en-US.mp3";
/*********************************************arabic************************************* */
import Bernd_ar_XA from "../voices/voices_arabic/Bernd_ar-XA.mp3";
import Conrad_ar_XA from "../voices/voices_arabic/Conrad_ar-XA.mp3";
import Elke_ar_XA from "../voices/voices_arabic/Elke_ar-XA.mp3";
import Kasper_ar_XA from "../voices/voices_arabic/Kasper_ar-XA.mp3";
import Klarissa_ar_XA from "../voices/voices_arabic/Klarissa_ar-XA.mp3";
import Maja_ar_XA from "../voices/voices_arabic/Maja_ar-XA.mp3";
/*********************************************frensh************************************* */
import Bernd_fr_Fr from "../voices/voices_frensh/Bernd_fr-FR.mp3";
import Conrad_fr_Fr from "../voices/voices_frensh/Conrad_fr-FR.mp3";
import Elke_fr_Fr from "../voices/voices_frensh/Elke_fr-FR.mp3";
import Kasper_fr_Fr from "../voices/voices_frensh/Kasper_fr-FR.mp3";
import Klarissa_fr_Fr from "../voices/voices_frensh/Klarissa_fr-FR.mp3";
import Maja_fr_Fr from "../voices/voices_frensh/Maja_fr-FR.mp3";

import Bernd_0_fr_Fr from "../voices/voices_frensh/Bernd_0_fr-FR.mp3";
import Conrad_0_fr_Fr from "../voices/voices_frensh/Conrad_0_fr-FR.mp3";
import Elke_0_fr_Fr from "../voices/voices_frensh/Elke_0_fr-FR.mp3";
import Kasper_0_fr_Fr from "../voices/voices_frensh/Kasper_0_fr-FR.mp3";
import Klarissa_0_fr_Fr from "../voices/voices_frensh/Klarissa_0_fr-FR.mp3";
import Maja_0_fr_Fr from "../voices/voices_frensh/Maja_0_fr-FR.mp3";
/*****************************************avatars images**************************************** */
import av_1 from "../assets/avatars/av_1.png";
import av_2 from "../assets/avatars/av_2.png";
import av_3 from "../assets/avatars/av_3.png";
import av_4 from "../assets/avatars/av_4.png";
import av_5 from "../assets/avatars/av_5.png";
import av_6 from "../assets/avatars/av_6.png";

 export  const languagevoices =(language)=>{
    let avatars
switch(language)
{
    case  "en-US" :
        avatars= [
            { image: av_4, voices: [ Klarissa_en_US,Klarissa_0_en_US] ,name: "Clara",voicesName: ["Klarissa","Klarissa_0"],sexe:"woman"},
            { image: av_6, voices: [Maja_en_US,Maja_0_en_US] ,name: "Sofia",voicesName:  ["Maja","Maja_0"],sexe:"woman"},
            { image: av_3, voices: [Elke_en_US,Elke_0_en_US] , name: "Marie", voicesName: ["Elke","Elke_0"],sexe:"woman" },
            { image: av_1, voices: [Bernd_en_US,Bernd_0_en_US] ,name: "Maximilian",voicesName: ["Bernd","Bernd_0"],sexe:"man"},
            { image: av_2, voices: [Conrad_en_US,Conrad_0_en_US], name: "Lukas",voicesName:["Conrad","Conrad_0"],sexe:"man" },
            { image: av_5, voices: [Kasper_en_US,Kasper_0_en_US], name: "Felix", voicesName: ["Kasper","Kasper_0"],sexe:"man"},
           
          ]
    break;
    case "ar-XA" :avatars=
    [
        { image: av_4, voices: [ Klarissa_ar_XA] ,name: "Clara",voicesName: ["Klarissa","Klarissa_0"],sexe:"woman"},
        { image: av_6, voices: [Maja_ar_XA] ,name: "Sofia",voicesName:  ["Maja","Maja_0"],sexe:"woman"},
        { image: av_3, voices: [Elke_ar_XA] , name: "Marie", voicesName: ["Elke","Elke_0"],sexe:"woman" },
        { image: av_1, voices: [Bernd_ar_XA] ,name: "Maximilian",voicesName: ["Bernd","Bernd_0"],sexe:"man"},
        { image: av_2, voices: [Conrad_ar_XA], name: "Lukas",voicesName:["Conrad","Conrad_0"],sexe:"man" },
        { image: av_5, voices: [Kasper_ar_XA], name: "Felix", voicesName: ["Kasper","Kasper_0"],sexe:"man"},
       
      ]
    break;
    case  "de-DE" :  avatars=
        [
            { image: av_4, voices: [ Klarissa_de_DE,Klarissa_0_de_DE] ,name: "Clara",voicesName: ["Klarissa","Klarissa_0"],sexe:"woman"},
            { image: av_6, voices: [Maja_de_DE,Maja_0_de_DE] ,name: "Sofia",voicesName:  ["Maja","Maja_0"],sexe:"woman"},
            { image: av_3, voices: [Elke_de_DE,Elke_0_de_DE] , name: "Marie", voicesName: ["Elke","Elke_0"],sexe:"woman" },
            { image: av_1, voices: [Bernd_de_DE,Bernd_0_de_DE] ,name: "Maximilian",voicesName: ["Bernd","Bernd_0"],sexe:"man"},
            { image: av_2, voices: [Conrad_de_DE,Conrad_0_de_DE], name: "Lukas",voicesName:["Conrad","Conrad_0"],sexe:"man" },
            { image: av_5, voices: [Kasper_de_DE,Kasper_0_de_DE], name: "Felix", voicesName: ["Kasper","Kasper_0"],sexe:"man"},
           
          ]
    break;
    case "fr-FR" : avatars=   [
        { image: av_4, voices: [ Klarissa_fr_Fr,Klarissa_0_fr_Fr] ,name: "Clara",voicesName: ["Klarissa","Klarissa_0"],sexe:"woman"},
        { image: av_6, voices: [Maja_fr_Fr,Maja_0_fr_Fr] ,name: "Sofia",voicesName:  ["Maja","Maja_0"],sexe:"woman"},
        { image: av_3, voices: [Elke_fr_Fr,Elke_0_fr_Fr] , name: "Marie", voicesName: ["Elke","Elke_0"],sexe:"woman" },
        { image: av_1, voices: [Bernd_fr_Fr,Bernd_0_fr_Fr] ,name: "Maximilian",voicesName: ["Bernd","Bernd_0"],sexe:"man"},
        { image: av_2, voices: [Conrad_fr_Fr,Conrad_0_fr_Fr], name: "Lukas",voicesName:["Conrad","Conrad_0"],sexe:"man" },
        { image: av_5, voices: [Kasper_fr_Fr,Kasper_0_fr_Fr], name: "Felix", voicesName: ["Kasper","Kasper_0"],sexe:"man"},
       
      ]
    break;
    default: 
}
return avatars
  }