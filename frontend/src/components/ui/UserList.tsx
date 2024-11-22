import React from 'react';
import './CommonUi.css';

interface User {
  id: number;
  name: string;
  online: boolean;
}
// 예시 사용자 데이터
const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
  // 추가 사용자 데이터...
];




export default function UserList() {
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
