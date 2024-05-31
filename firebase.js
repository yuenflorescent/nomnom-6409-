// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCigU63kn2Fjjn0mzKkF4-oWJyeCsdKWrs",
  authDomain: "nomnom-authentification.firebaseapp.com",
  projectId: "nomnom-authentification",
  storageBucket: "nomnom-authentification.appspot.com",
  messagingSenderId: "136424992640",
  appId: "1:136424992640:web:55eb07d9a24fb0f454db65",
  measurementId: "G-CJV6SDRKML"
};

// Initialize Firebase

// let app;
const app = firebase.initializeApp(firebaseConfig);
// if (firebase.apps.length === 0) {
//     app = firebase.initializeApp(firebaseConfig)
// } else {
//     app = firebase.app();
// }

const auth = getAuth();

export { auth };