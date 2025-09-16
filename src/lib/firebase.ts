
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    "projectId": "studio-3202799668-b65bc",
    "appId": "1:628559568210:web:8da3e6f0274178795e2e8b",
    "storageBucket": "studio-3202799668-b65bc.firebasestorage.app",
    "apiKey": "AIzaSyB1S5xtLC4AM_jBv1QXkYELE_QaY7hzFSM",
    "authDomain": "studio-3202799668-b65bc.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "628559568210"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
