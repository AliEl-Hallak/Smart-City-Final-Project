// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth,signOut } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// Your web app's Firebase configuration
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCGTqEI4-5UsBX-ST4YhoyMsC5DIwPxSjg",
  authDomain: "hellofirebase-16ac9.firebaseapp.com",
  databaseURL: "https://hellofirebase-16ac9-default-rtdb.firebaseio.com",
  projectId: "hellofirebase-16ac9",
  storageBucket: "hellofirebase-16ac9.appspot.com",
  messagingSenderId: "333111288367",
  appId: "1:333111288367:web:52b5c75c2422e55009dcda",
 };

  // FirebasseConfig.js içinde
export const logoutUser = (navigation) => {
  const auth = getAuth();
  signOut(auth).then(() => {
      console.log('Kullanıcı çıkış yaptı');
      navigation.navigate('Login'); // Kullanıcıyı giriş ekranına yönlendir
  }).catch((error) => {
      console.error('Çıkış yapılırken hata oluştu:', error);
  });
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const database = getDatabase(FIREBASE_APP);

export { database };