import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserList from '../../components/ui/Userlist';
import Background from '../../components/ui/Background';
import Profile from '../../components/ui/Profile';
import HeaderLogo from '../../components/ui/HeaderLogo';

import '../../components/ui/CommonUi.css';

interface User {
  id: number;
  name: string;
  online: boolean;
}

interface Post {
  geul_id: number;
  story_id: number;
  geul_title: string;
}

// 예시 사용자 데이터
const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
];

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const maxVisiblePosts = 5; // 박스 안에 표시할 최대 게시물 수

  useEffect(() => {
    // 게시물 데이터를 가져오는 함수
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/posts'); // 게시물 API 호출
        const data = await response.json();
        setPosts(data); // 게시물 상태 업데이트
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    console.log('로그아웃 완료: JWT 토큰 삭제됨');
    navigate('/');
  };

  return (
    <div className="">
      <Background />
      <div>
        <HeaderLogo />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-2/3 -translate-y-1/2">
        <img
          src="/images/GameStart3.png"
          alt="Game Start"
          onClick={() => navigate('/games')}
          style={{ width: '500px', height: 'auto', cursor: 'pointer' }}
          className="transform transition-transform hover:scale-110"
        />
      </div>

      <div className="boxes-align">
        {/* Profile Box */}
        <Profile>
          <button onClick={handleLogout}>
            <img
              src="/images/xBtn.png"
              alt="Log out"
              style={{ width: '20px', height: 'auto', cursor: 'pointer' }}
              className="ml-7 transform transition-transform hover:scale-110"
            />
          </button>
        </Profile>

        {/* Userlist Box */}
        <UserList users={users} />

        {/* Board Button */}
        <Link to="/Board" className="board-link-button">
          게시판 이동하기
        </Link>

        {/* Board Box */}
        <div className="post-list-box">
          {posts.slice(0, maxVisiblePosts).map((post) => (
            <div key={post.geul_id} className="post-list-item">
              <Link
                to={`/board/${post.story_id}/post/${post.geul_id}`}
                className="truncate"
                title={post.geul_title}
              >
                {post.geul_title.length > 15
                  ? `${post.geul_title.slice(0, 15)}...`
                  : post.geul_title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
