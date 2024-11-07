import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Story {
  story_id: number;
  story_title: string;
  cover_pic: string;
}

interface Post {
  geul_id: number;
  story_id: number;
  geul_title: string;
  geul_content: string;
  uploaded_time: string;
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts'); // 모든 게시물 불러오기
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchStories();
    fetchPosts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Story Board</h1>

      {/* Story selection grid */}
      <div className="grid grid-cols-6 gap-6 mb-10">
        {stories.map((story) => (
          <Link
            to={`/board/${story.story_id}`}
            key={story.story_id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 text-center"
          >
            <p className="text-gray-800 font-semibold mb-2">
              {story.story_title}
            </p>
            <img
              src={story.cover_pic}
              className="w-full h-40 object-cover rounded-md"
              alt={story.story_title}
            />
          </Link>
        ))}
      </div>

      {/* Latest posts section */}
      <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
      <div className="space-y-4">
        {posts
          .sort(
            (a, b) =>
              new Date(b.uploaded_time).getTime() -
              new Date(a.uploaded_time).getTime(),
          ) // 최신순 정렬
          .map((post) => (
            <div
              key={post.geul_id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <Link to={`/board/${post.story_id}/post/${post.geul_id}`}>
                <h3 className="text-xl font-bold">{post.geul_title}</h3>
                <p className="text-gray-700 mt-2">
                  {post.geul_content.substring(0, 100)}...
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
                </p>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StoryGrid;
