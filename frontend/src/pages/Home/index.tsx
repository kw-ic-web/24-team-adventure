
import React from 'react';
import { Link } from 'react-router-dom';

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
//#f3efe4;

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-green flex 
    w-screen bg-[#b3ae56] justify-center items-center inline-flex">
      {/* 중앙 아이보리 박스 */}
      <div className="bg-ivory w-5/6 max-w-10xl p-5 bg-[#f3efe4] shadow-lg rounded-lg flex relative">
        
        {/* 오른쪽 고정 박스들 */}
        <div className="flex flex-col gap-4 w-1/4 ml-auto">
          {/* 프로필 박스 */}
          <Link to="/MyPage" className="bg-white p-4 shadow-md rounded-md flex items-center space-x-3">
            <span role="img" aria-label="user-profile" className="text-2xl">👤</span>
            <span className="text-lg font-semibold">사용자 이름</span>
          </Link>

          {/* 다른 사용자 목록 박스 */}
          <div className="bg-white p-4 shadow-md rounded-md h-48 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span role="img" aria-label="user-profile" className="text-xl">👤</span>
                  <span>{user.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
            ))}
          </div>

          {/* 게시판 이동 버튼 */}
          <Link to="/Board" className="bg-white p-4 shadow-md rounded-md text-center text-lg font-semibold">
            게시판 이동하기
          </Link>

          {/* 최신 게시글 박스 */}
          <div className="bg-white p-4 shadow-md rounded-md h-48 overflow-hidden">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{post.category}</span>
                <Link to={`/Board/${post.id}`} className="ml-2 truncate" title={post.title}>
                  {post.title.length > 15 ? `${post.title.slice(0, 15)}...` : post.title}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button className="absolute bottom-4 left-4 bg-white px-4 py-2 shadow-md rounded-md">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Home;
