import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { dirname } from "path";

const owner = "x1nx3r";
const repo = "blog-md-firebase";
const directory = "src/posts";
const branch = "main";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blog-db-thingies.firebaseio.com",
});

const db = admin.firestore();

function extractMetadata(content, filename, downloadUrl) {
  const { data } = matter(content);
  const summary = content.split(/\s+/).slice(0, 20).join(" ") || filename;
  return {
    author: "Mega Nugraha",
    title: filename,
    contentUrl: downloadUrl,
    published: true,
    summary: summary,
    date: data.date || new Date().toISOString().split("T")[0],
  };
}

async function syncPosts() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const postsDir = path.join(__dirname, directory);

    const files = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".md"));

    const metadata = files.map((file) => {
      const content = fs.readFileSync(path.join(postsDir, file), "utf8");
      const downloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${directory}/${encodeURIComponent(file)}`;
      return {
        id: path.parse(file).name, // Use filename (without extension) as document ID
        ...extractMetadata(content, file, downloadUrl),
      };
    });

    const batch = db.batch();
    const repoDocIds = metadata.map((data) => data.id);

    // Step 1: Add or update documents
    metadata.forEach((data) => {
      const docRef = db.collection("posts").doc(data.id);
      const { id, ...rest } = data;
      batch.set(docRef, rest, { merge: true });
    });

    // Step 2: Fetch all existing docs in Firestore and find orphans
    const snapshot = await db.collection("posts").get();
    snapshot.forEach((doc) => {
      if (!repoDocIds.includes(doc.id)) {
        console.log(`Deleting orphan post: ${doc.id}`);
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    console.log("Two-way sync complete.");
  } catch (error) {
    console.error("Sync error:", error);
  }
}

syncPosts();
