// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkLdaZh-RM518aVcd9x3jx9MbJsQG3i3k",
  authDomain: "streakedin-1c9c1.firebaseapp.com",
  projectId: "streakedin-1c9c1",
  storageBucket: "streakedin-1c9c1.firebasestorage.app",
  messagingSenderId: "326145009",
  appId: "1:326145009:web:89164abe71fae9cda12a50",
  measurementId: "G-6ERETG1VSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;