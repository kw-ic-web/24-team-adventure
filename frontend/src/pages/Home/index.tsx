import React from 'react';
import { Link } from 'react-router-dom';

/*
To do:
동화선택 화면과 연결, 호버 기능
프로필 박스: 사용자 db 연결, 본인 뜰 수 있도록
다른 사용자 목록 박스 : 사용자 db 연결, 본인 외 나머지
최신 게시글 박스: 게시판 상세 페이지로 연결, 최신순 글들만 표시
로그아웃 버튼: (현재: Start으로 가는 link)
*/

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

// 예시 사용자 데이터
const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
  // 추가 사용자 데이터...
];

// 예시 게시글 데이터
const posts: Post[] = [
  { id: 1, category: 'tail1', title: '첫 번째 게시글입니다.' },
  { id: 2, category: 'tail2', title: '두 번째 게시글입니다.' },
  // 추가 게시글 데이터...
];

export default function Home() {
  return (
    <div className="min-h-screen bg-light-green flex w-screen bg-[#b3ae56] justify-center items-center font-noto">
      {/* 중앙 배경화면 박스 */}
      <div className="fixed-box">
        {/* 오른쪽 고정 박스들 */}
        <div className="flex flex-col gap-4 w-1/4 ml-auto">
          {/* 프로필 박스 */}
          <Link to="/MyPage" className="profile-box">
            <span role="img" aria-label="user-profile" className="profile-icon">
              👤
            </span>
            <span className="profile-name">사용자 이름</span>
          </Link>

          {/* 다른 사용자 목록 박스 */}
          <div className="user-list-box">
            {users.map((user) => (
              <div key={user.id} className="user-list-item">
                <div className="flex items-center space-x-2">
                  <span
                    role="img"
                    aria-label="user-profile"
                    className="text-xl"
                  >
                    👤
                  </span>
                  <span>{user.name}</span>
                </div>
                <div
                  className={`status-dot ${user.online ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              </div>
            ))}
          </div>

          {/* 게시판 이동 버튼 */}
          <Link to="/Board" className="board-link-button">
            게시판 이동하기
          </Link>

          {/* 최신 게시글 박스 */}
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
        </div>

        {/* 로그아웃 버튼 */}
        <Link to="/" className="logout-button">
          로그아웃
        </Link>
      </div>
    </div>
  );
}
