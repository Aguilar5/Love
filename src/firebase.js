// src/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKbqxe0VLumcS1-sKGXpkdLsMp0Etjn9E",
  authDomain: "escaleritas-juego.firebaseapp.com",
  databaseURL: "https://escaleritas-juego-default-rtdb.firebaseio.com", // ¡Este dato es crucial!
  projectId: "escaleritas-juego",
  storageBucket: "escaleritas-juego.firebasestorage.app",
  messagingSenderId: "845803890565",
  appId: "1:845803890565:web:8f3faa73e496a5486846ec",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
