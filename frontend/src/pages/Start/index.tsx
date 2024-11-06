import React from 'react';
import { Link } from 'react-router-dom';

/*
To do:
다른 사용자 목록 박스 : 사용자 db 연결, 본인 외 나머지
구글 로그인 버튼과 연결
메인 로고 설정
*/

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

export default function Start() {
  return (
    <div className="min-h-screen bg-light-green flex w-screen bg-[#b3ae56] justify-center items-center font-noto">
      {/* 중앙 배경화면 박스 */}
      <div className="fixed-box">
        {/* 오른쪽 고정 박스 */}
        <div className="flex flex-col gap-4 w-1/4 ml-auto">
          {/* 실시간 사용자 목록 박스 */}
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
        </div>

        {/* 화면 중앙에 로고와 구글 로그인 버튼 추가 */}
        <div className="flex flex-col items-center justify-center absolute inset-0 m-auto">
          {/* 프로그램 로고 */}
          <img src="/path/to/your/logo.png" alt="Game Logo" className="mb-4" />

          {/* 구글 로그인 버튼 */}
          <Link
            to="/Home"
            className="bg-white px-4 py-2 shadow-md rounded-md font-semibold"
          >
            Google Oauth Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
