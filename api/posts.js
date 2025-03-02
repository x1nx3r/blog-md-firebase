import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { configDotenv } from "dotenv";

configDotenv();
// Use process.env instead of import.meta.env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch posts (same logic as before)
async function getPosts() {
  const postsCol = collection(db, "posts");
  const postsSnapshot = await getDocs(postsCol);
  const postsList = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return postsList;
}

// Fetch post by ID
async function getPostById(id) {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id, ...docSnap.data() };
  } else {
    throw new Error("Document not found");
  }
}

// Vercel Function Handler
export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (id) {
      const post = await getPostById(id);
      res.status(200).json(post);
    } else {
      const posts = await getPosts();
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
