import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBMAIePQ0AKEkn805pyc710O8yY8IE9X7A",
  authDomain: "trychai.firebaseapp.com",
  projectId: "trychai",
  storageBucket: "trychai.appspot.com",
  messagingSenderId: "556026713124",
  appId: "1:556026713124:web:50201dfa5cd8daa1e1b4b1"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export default app