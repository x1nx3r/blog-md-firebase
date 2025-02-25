import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Output the environment variable to the console
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
console.log("FIREBASE_SERVICE_ACCOUNT_KEY:", serviceAccountPath);
