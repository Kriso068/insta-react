// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFjgLMdTpQjOkB4PDp77PecRHHLjrwOpc",
  authDomain: "insta-react-b70ec.firebaseapp.com",
  projectId: "insta-react-b70ec",
  storageBucket: "insta-react-b70ec.appspot.com",
  messagingSenderId: "451117510755",
  appId: "1:451117510755:web:0b8f1238a0e2d69f674856",
  measurementId: "G-73725JLRTD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export {app, auth, firestore, analytics, storage};