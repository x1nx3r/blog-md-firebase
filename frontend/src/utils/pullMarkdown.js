import axios from "axios";

export default async function pullMarkdown(url) {
  try {
    const response = await axios.get(url);
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("Error fetching markdown:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
