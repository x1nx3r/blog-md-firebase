import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import pullMarkdown from "./utils/pullMarkdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // To render raw HTML
import "./index.css"; // Import the CSS file
import Header from "./components/Header";
import SidebarBox from "./components/SidebarBox";
import axios from "axios"; // Import axios

export default function PostView() {
  const { id } = useParams(); // Get the id parameter from the URL
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        // Fetch post data from the /api/posts/:id endpoint
        const response = await axios.get(`/api/posts/${id}`);
        const post = response.data; // Assuming post data is returned in response.data

        const data = await pullMarkdown(post.contentUrl); // Fetch the markdown content from the contentUrl
        setMarkdown(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }

    fetchPost();
  }, [id]); // Re-run the effect when the id changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-macchiato-base text-macchiato-text">
      <div className="flex flex-col min-w-3xl max-w-4xl items-center m-5 p-5 mx-20 mb-8 px-8 pb-8 rounded-sm bg-macchiato-crust">
        <Header />
        <div className="max-w-4xl min-w-3xl w-full flex flex-row justify-between items-start">
          <div className="max-w-4xl min-w-3xl w-full markdown-body">
            <Markdown
              className=""
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {markdown}
            </Markdown>
          </div>
          <SidebarBox />
        </div>
      </div>
    </div>
  );
}
