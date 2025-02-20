import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostContainer from "./PostContainer";
import { getPosts, db } from "../utils/firebaseInit";

export default function ContentBox() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsList = await getPosts(db);
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
