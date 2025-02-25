import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// Get a list of posts from your database
async function getPosts() {
  const postsCol = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCol);
  const postsList = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("Posts fetched from Firestore:", postsList); // Debugging log
  return postsList;
}

// Get a post by its ID
async function getPostById(id) {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("No such document!");
  }
}

export { db, getPosts, getPostById };
