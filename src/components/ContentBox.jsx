import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostContainer from "./PostContainer";

export default function ContentBox() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        const postsList = await response.json();
        setPosts(postsList);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col rounded-sm p-3 m-2 text-macchiato-text">
      {posts.map((post) => (
        <Link key={post.id} to={`/post/${post.id}`} className="no-underline">
          <PostContainer
            title={post.title}
            date={post.date}
            summary={post.summary}
          />
        </Link>
      ))}
    </div>
  );
}
