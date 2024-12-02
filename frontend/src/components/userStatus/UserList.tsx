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
  users: User[];
}

function UserList({ users }: UserListProps) {
  if (!users || users.length === 0) {
    return <p>No users available.</p>;
  }

  // 온라인 상태인 사용자를 최상단으로 정렬
  const sortedUsers = [...users].sort(
    (a, b) => Number(b.online) - Number(a.online),
  );

  // 상위 5개의 사용자만 선택
  const limitedUsers = sortedUsers.slice(0, 5);

  return (
    <div className="user-list-box">
      {limitedUsers.map((user) => (
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
