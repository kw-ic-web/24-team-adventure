import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import HomeButton from '../../components/HomeButton';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('Fetching posts for story_id:', story_id);

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/board/${story_id}`,
        );
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
        setError(''); // Clear any existing errors
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시물을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (story_id) {
      fetchPosts();
    }
  }, [story_id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        게시물 목록 (Story ID: {story_id})
      </h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <Link
              to={`/board/${post.story_id}/post/${post.geul_id}`}
              key={post.geul_id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
            >
              <h3 className="text-2xl font-semibold">{post.title}</h3>
              <p className="text-gray-700 mt-2">
                {post.content.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center mt-4 text-gray-500">
                <span>작성자: {post.author}</span>
                <span>
                  업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
                </span>
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
