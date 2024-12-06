import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import Background from '../../components/ui/Background';
import Profile from '../../components/ui/Profile';
import HeaderLogo from '../../components/ui/HeaderLogo';
import UserList from '../../components/userStatus/UserList';
import UserStatusUpdater from '../../components/userStatus/UserStatusUpdater';
import { logoutUser } from '../../utils/userStatusApi';

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

const decodeJWT = (token: string): any => {
  try {
    const payload = token.split('.')[1]; // JWT의 두 번째 부분 (Payload)
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // Base64 URL 디코딩
    return JSON.parse(decodedPayload); // JSON 파싱
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

export default function Home(user_id: string | number) {
  console.log(`로그아웃 요청 user_id: ${user_id}`);
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const maxVisiblePosts = 5; // 박스 안에 표시할 최대 게시물 수

  useEffect(() => {
    // 게시물 데이터를 가져오는 함수
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://223.194.46.67:20590/posts'); // 게시물 API 호출
        const data = await response.json();
        setPosts(data); // 게시물 상태 업데이트
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token'); // JWT 토큰 가져오기

    if (!token) {
      console.error('로그아웃 실패: token이 없습니다.');
      return;
    }

    // JWT 디코딩
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.user_id) {
      console.error('로그아웃 실패: JWT에서 user_id를 추출할 수 없습니다.');
      return;
    }

    const user_id = decodedToken.user_id;

    if (user_id) {
      await logoutUser(user_id, token); // logoutUser에 user_id와 token 전달
      localStorage.removeItem('token'); // 토큰 삭제
      localStorage.removeItem('user_id'); // user_id 삭제
      console.log('로그아웃 완료: JWT 토큰 및 user_id 삭제됨');
      navigate('/');
    } else {
      console.error('로그아웃 실패: user_id가 없습니다.');
    }
  };

  return (
    <div className="h-screen w-screen">
      <Background />
      <HeaderLogo />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-[-2%]">
        <img
          src="/images/GameStart7.png"
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
        {/* 사용자 상태 업데이트 */}
        <UserStatusUpdater onUpdate={setUsers} />
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
