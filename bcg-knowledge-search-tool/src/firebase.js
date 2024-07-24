// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc7K2dnebgsC83DY6Sw1whDLF07kPTM2E",
  authDomain: "infomineo.firebaseapp.com",
  projectId: "infomineo",
  storageBucket: "infomineo.appspot.com",
  messagingSenderId: "220008405877",
  appId: "1:220008405877:web:4dcc72681f8e459276d13c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export { auth, db, signInWithGoogle };