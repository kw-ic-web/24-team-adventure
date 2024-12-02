import React from 'react';

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

function UserList({ users }: UserListProps) {
  // 데이터가 없을 경우 처리
  if (!users || users.length === 0) {
    return <p>No users available.</p>;
  }

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.online ? 'Online' : 'Offline'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
