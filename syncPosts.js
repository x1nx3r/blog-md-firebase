const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

const db = admin.firestore();

// Function to extract metadata from markdown content
function extractMetadata(content, filename, downloadUrl) {
  const { data } = matter(content);
  const summary = content.split(/\s+/).slice(0, 20).join(" ") || filename;
  const metadata = {
    author: "Mega Nugraha",
    title: filename,
    contentUrl: downloadUrl,
    published: true,
    summary: summary,
    date: data.date || new Date().toISOString().split("T")[0],
  };
  return metadata;
}

// Function to push metadata to Firebase
async function pushMetadataToFirebase(metadata) {
  const batch = db.batch();
  metadata.forEach((data, index) => {
    const docRef = db.collection("posts").doc(`post-${index}`);
    batch.set(docRef, data);
  });
  await batch.commit();
}

// Main function to sync posts
async function syncPosts() {
  try {
    const postsDir = path.join(__dirname, "src", "posts");
    const files = fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith(".md"));
    const metadataPromises = files.map((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      const downloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${directory}/${file}`;
      const metadata = extractMetadata(content, file, downloadUrl);
      return metadata;
    });
    const metadata = await Promise.all(metadataPromises);
    await pushMetadataToFirebase(metadata);
    console.log("Metadata successfully pushed to Firebase");
  } catch (error) {
    console.error("Error syncing posts:", error);
  }
}

// Run the syncPosts function
syncPosts();
