import React from 'react';
import '../ui/CommonUi.css';

// 사용자 데이터 타입 정의
interface User {
  id: number;
  name: string;
  online: boolean;
}

// props 타입 정의
interface UserListProps {
  users: User[]; // `users` prop의 타입
}

// 컴포넌트 정의
function UserList({ users }: UserListProps) {
  // 데이터가 없을 경우 처리
  if (!users || users.length === 0) {
    return <p>No users available.</p>;
  }

  return (
    <div className="user-list-box">
      {users.map((user) => (
        <div key={user.id} className="user-list-item">
          <div className="user-item-flex">
            <span role="img" aria-label="user-profile" className="text-xl">
              👤
            </span>
            <span>{user.name}</span>
          </div>
          <div className="status-dot">
            <img
              src={
                user.online
                  ? '/images/online_icon.png'
                  : '/images/offline_icon.png'
              }
              alt="status"
              className="status-icon"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
