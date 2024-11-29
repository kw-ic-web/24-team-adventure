import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import Background from '../../components/ui/Background';
import SmallBox from '../../components/ui/SmallBox';
import Profile from '../../components/ui/Profile';
import UserList from '../../components/ui/Userlist';

import HeaderLogo from '../../components/ui/HeaderLogo';
import './BoardPage.css';

//db연결 전 **임시** 사용자 정보
interface User {
  id: number;
  name: string;
  online: boolean;
}
const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
  // 추가 사용자 데이터...
];

// 게시물 데이터 타입 정의
interface Post {
  geul_id: number;
  story_id: number;
  geul_title: string;
  geul_content: string;
  uploaded_time: string;
  user: { name: string }; // 작성자 이름 추가
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
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시물을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (story_id) fetchPosts();
  }, [story_id]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          다시 시도
        </button>
      </div>
    );

  return (
    <div>
      <Background />
      <div>
        <HeaderLogo />
      </div>
      <SmallBox>

      <h1 className="board-title">게시물 목록</h1>
      <div className="post-grid">
        {posts.map((post) => (
          <Link
            key={post.geul_id}
            to={`/board/${post.story_id}/post/${post.geul_id}`}
            className="post-card"
          >
            <h3>{post.geul_title}</h3>
            <p>{post.geul_content.substring(0, 100)}...</p>
            <p>작성자: {post.user.name}</p> {/* 작성자 이름 표시 */}
            <p>업로드 시간: {new Date(post.uploaded_time).toLocaleString()}</p>
          </Link>
        ))}
      </div>
      </SmallBox>
      <div className="boxes-align">
      <Profile/>
        <UserList users={users} />
      </div>
    </div>
  );
};

export default BoardPage;
