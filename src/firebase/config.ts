import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3_MpShNYnnMA9NyZvfaH6y1r4fwDIEew",
  authDomain: "reddit-clone-9ed6c.firebaseapp.com",
  projectId: "reddit-clone-9ed6c",
  storageBucket: "reddit-clone-9ed6c.appspot.com",
  messagingSenderId: "327355805276",
  appId: "1:327355805276:web:244e5d9f2e975896754099",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
