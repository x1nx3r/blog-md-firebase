const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Initialize Firebase Admin SDK
// The service account credentials are parsed from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com", // Replace with your Firebase project URL
});

const db = admin.firestore();

// Function to extract metadata from markdown content
// This function takes the content of the markdown file, the filename, and the download URL
function extractMetadata(content, filename, downloadUrl) {
  // Use gray-matter to parse the front matter from the markdown content
  const { data } = matter(content);

  // Extract the first 20 words from the content for the summary
  const summary = content.split(/\s+/).slice(0, 20).join(" ") || filename;

  // Construct the metadata object
  const metadata = {
    author: "Mega Nugraha", // Hardcoded author name
    title: filename, // Use the filename as the title
    contentUrl: downloadUrl, // URL to the raw markdown file on GitHub
    published: true, // Hardcoded published status
    summary: summary, // Summary of the content
    date: data.date || new Date().toISOString().split("T")[0], // Use the date from front matter or current date
  };

  return metadata;
}

// Function to push metadata to Firebase
// This function takes an array of metadata objects and writes them to Firestore
async function pushMetadataToFirebase(metadata) {
  const batch = db.batch(); // Create a batch to perform multiple writes as a single atomic operation

  metadata.forEach((data, index) => {
    const docRef = db.collection("posts").doc(`post-${index}`); // Create a reference to a document in the "posts" collection
    batch.set(docRef, data); // Add the set operation to the batch
  });

  await batch.commit(); // Commit the batch
}

// Main function to sync posts
// This function reads the markdown files from the "src/posts" directory, extracts metadata, and pushes it to Firestore
async function syncPosts() {
  try {
    const postsDir = path.join(__dirname, "src", "posts"); // Path to the "src/posts" directory
    const files = fs
      .readdirSync(postsDir) // Read the contents of the directory
      .filter((file) => file.endsWith(".md")); // Filter for markdown files

    // Map over the files and create an array of promises to extract metadata
    const metadataPromises = files.map((file) => {
      const filePath = path.join(postsDir, file); // Path to the markdown file
      const content = fs.readFileSync(filePath, "utf8"); // Read the content of the file
      const downloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${directory}/${file}`; // Construct the download URL
      const metadata = extractMetadata(content, file, downloadUrl); // Extract metadata
      return metadata;
    });

    const metadata = await Promise.all(metadataPromises); // Wait for all metadata extraction promises to resolve
    await pushMetadataToFirebase(metadata); // Push the metadata to Firestore
    console.log("Metadata successfully pushed to Firebase");
  } catch (error) {
    console.error("Error syncing posts:", error); // Log any errors that occur
  }
}

// Run the syncPosts function
syncPosts();
