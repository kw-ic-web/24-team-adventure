import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
  id: number;
  category: string;
  title: string;
}

// 예시 게시글 데이터
const posts: Post[] = [
  { id: 1, category: 'tail1', title: '첫 번째 게시글입니다.' },
  { id: 2, category: 'tail2', title: '두 번째 게시글입니다.' },
  // 추가 게시글 데이터...
];
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
          style={{ width: '200px', height: 'auto', cursor: 'pointer' }}
          className=" transform transition-transform hover:scale-110"
        />
      </div>
      {/* Profile Box */}
      <Link to="/MyPage">
        <Profile />
      </Link>
      {/* Userlist Box */}
      <div>
        {/* 사용자 상태 업데이트 */}
        <UserStatusUpdater onUpdate={setUsers} />
        <UserList users={users} />
      </div>
      {/* Board Button */}
      <Link to="/Board" className="board-link-button">
        &nbsp;게시판 이동하기
      </Link>
      {/* Board Box */}
      <div className="post-list-box">
        {posts.slice(0, 5).map((post) => (
          <div key={post.id} className="post-list-item">
            <span className="text-sm font-semibold">{post.category}</span>
            <Link
              to={`/Board/${post.id}`}
              className="ml-2 truncate"
              title={post.title}
            >
              {post.title.length > 15
                ? `${post.title.slice(0, 15)}...`
                : post.title}
            </Link>
          </div>
        ))}
      </div>
      {/* 로그아웃 버튼 */}
      <button className="logout-button" onClick={handleLogout}>
        <img src="/images/logoutBtn.png" alt="로그아웃 버튼" />
        <span className="logout-text">&nbsp;로그아웃</span>
      </button>
    </div>
  );
}
