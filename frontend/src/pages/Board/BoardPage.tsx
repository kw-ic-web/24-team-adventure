import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import HomeButton from '../../components/HomeButton';
import './BoardPage.css';

interface Post {
  geul_id: number;
  user_id: string;
  story_id: number;
  geul_content: string;
  final_pic: string;
  geul_title: string;
  uploaded_time: string;
}

const BoardPage: React.FC = () => {
  const { story_id } = useParams<{ story_id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/board/${story_id}`,
        );
        setPosts(response.data);
        setError('');
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
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="board-page">
      <h1 className="board-title">게시물 목록 (Story ID: {story_id})</h1>
      {posts.length > 0 ? (
        <div className="post-grid">
          {posts.map((post) => (
            <Link
              to={`/board/${post.story_id}/post/${post.geul_id}`}
              key={post.geul_id}
              className="post-card"
            >
              <h3 className="post-title">{post.geul_title}</h3>
              <p className="post-content">
                {post.geul_content.substring(0, 100)}...
              </p>
              <div className="post-meta">
                <span>작성자 ID: {post.user_id}</span>
                <span>
                  업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-posts-message">게시물이 없습니다.</p>
      )}
      <HomeButton />
    </div>
  );
};

export default BoardPage;
