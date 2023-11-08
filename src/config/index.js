import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrOJPptRSC751n8sMTEBC7QijY1q078Rw",
  authDomain: "ittemdesk.firebaseapp.com",
  projectId: "ittemdesk",
  storageBucket: "ittemdesk.appspot.com",
  messagingSenderId: "699458144548",
  appId: "1:699458144548:web:893ae02a21d169e38d8bb1",
  measurementId: "G-JQV649KD29"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export {database };