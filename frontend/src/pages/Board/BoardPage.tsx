import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { BoardContext } from "../../context/BoardContext";
import Loader from "../../components/Loader";
import HomeButton from "../../components/HomeButton";

interface Post {
  geul_id: number;
  id: number;
  story_id: number;
  content: string;
  final_pic: string;
  title: string;
  uploaded_time: string;
  author: string;
}

const BoardPage: React.FC = () => {
  const { story_id } = useParams<{ story_id: string }>();
  const { posts, loading, error } = useContext(BoardContext);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log("BoardPage useEffect triggered");
    if (story_id) {
      const parsedStoryId = parseInt(story_id);
      console.log("Parsed story_id:", parsedStoryId);
      if (!isNaN(parsedStoryId)) {
        const filtered = posts.filter((post) => post.story_id === parsedStoryId);
        console.log("Filtered posts:", filtered);
        setFilteredPosts(filtered);
      } else {
        console.error("Invalid story_id:", story_id);
      }
    }
  }, [story_id, posts]);

  if (loading) {
    console.log("Loading state");
    return <Loader />;
  }

  if (error) {
    console.log("Error state:", error);
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  console.log("Rendering BoardPage with filteredPosts:", filteredPosts);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">게시물 목록 (Story ID: {story_id})</h1>
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <Link
              to={`/board/${post.story_id}/post/${post.geul_id}`}
              key={post.geul_id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
            >
              <h3 className="text-2xl font-semibold">{post.title}</h3>
              <p className="text-gray-700 mt-2">{post.content.substring(0, 100)}...</p>
              <div className="flex justify-between items-center mt-4 text-gray-500">
                <span>작성자: {post.author}</span>
                <span>업로드 시간: {new Date(post.uploaded_time).toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">게시물이 없습니다.</p>
      )}
      <HomeButton />
    </div>
  );
};

export default BoardPage;
