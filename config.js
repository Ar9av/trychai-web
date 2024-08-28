import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyC0zaLxT65Ur3DXJWNxQU6sPBRWV7MZb14",
    authDomain: "trychai-auth-3345f.firebaseapp.com",
    projectId: "trychai-auth-3345f",
    storageBucket: "trychai-auth-3345f.appspot.com",
    messagingSenderId: "822921027181",
    appId: "1:822921027181:web:aadbfc6c18ee085aa06964",
    measurementId: "G-XRV3RVNWP3"
  };

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export default app