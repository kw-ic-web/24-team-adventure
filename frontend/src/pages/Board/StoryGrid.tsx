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
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  // 동화 목록 가져오기
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories');
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  // 게시물 목록 가져오기 (최신순)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts'); // 전체 게시물 가져오기
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // 특정 동화를 선택할 때 story_id 상태를 업데이트하는 함수
  const handleStorySelect = (storyId: number) => {
    setSelectedStoryId(storyId);
  };

  // 전체 게시물 보기를 위한 상태 초기화 함수
  const handleShowAllPosts = () => {
    setSelectedStoryId(null);
  };

  // 선택된 동화의 게시물만 필터링
  const filteredPosts = selectedStoryId
    ? posts.filter((post) => post.story_id === selectedStoryId)
    : posts;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Story Board</h1>

      {/* Story Cards */}
      <div className="grid grid-cols-6 gap-6">
        {stories.map((story) => (
          <div
            key={story.story_id}
            onClick={() => handleStorySelect(story.story_id)} // 동화 선택 이벤트 핸들러
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 text-center cursor-pointer"
          >
            <p className="text-gray-800 font-semibold mb-2">
              {story.story_title}
            </p>
            <img
              src={story.cover_pic}
              className="w-full h-40 object-cover rounded-md"
              alt={story.story_title}
            />
          </div>
        ))}
      </div>

      {/* Latest Posts */}
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">
        Latest Posts
      </h2>

      {/* 전체 보기 버튼 */}
      {selectedStoryId && (
        <div className="text-center mb-4">
          <button
            onClick={handleShowAllPosts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            전체 게시물 보기
          </button>
        </div>
      )}

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.geul_id}
            to={`/board/${post.story_id}/post/${post.geul_id}`} // 게시물 상세 페이지로 이동
            className="block bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition"
          >
            <h3 className="text-xl font-semibold">{post.geul_title}</h3>
            <p className="text-gray-700">{post.geul_content}</p>
            <p className="text-gray-500 text-sm">
              업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;
// sd
