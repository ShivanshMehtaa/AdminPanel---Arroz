import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrQa9c7J-EkEmT35uK6HXizrnZwPGLVGw",
  authDomain: "adminpanel-arroz.firebaseapp.com",
  projectId: "adminpanel-arroz",
  storageBucket: "adminpanel-arroz.appspot.com",
  messagingSenderId: "272046664657",
  appId: "1:272046664657:web:0d7f1abb2945806770cef0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);