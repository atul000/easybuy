import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUkKMc3vaeSrCy-_--wUzeSU2ZFVHbeys",
  authDomain: "e-commerce-f6dad.firebaseapp.com",
  databaseURL: "https://e-commerce-f6dad.firebaseio.com",
  projectId: "e-commerce-f6dad",
  storageBucket: "e-commerce-f6dad.appspot.com",
  messagingSenderId: "797999851851",
  appId: "1:797999851851:web:b242c719fda8eea5b760ce",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
