import React from 'react';
import './CommonUi.css';
import { useUserData } from '../../hooks/auth/useUserData';
import Background from '../../components/ui/Background';

export default function Profile() {
  const { data: userData, isLoading: userLoading } = useUserData();
  // 로딩 상태 처리
  if (userLoading) {
    return (
      <div>
        <Background />
        <div className="text-center">
          <div className="loader" />
          <p className="mt-50 text-gray-600">로딩 중입니다...</p>
        </div>
      </div>
    );
  }
  // 사용자 데이터가 없을 때
  if (!userData) {
    return (
      <div>
        {' '}
        <Background />
        <div className="profile-box">
          <p className="text-gray-500">사용자 정보 찾을 수 없음.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-box">
      <img
        src={userData?.icon || 'https://via.placeholder.com/100'}
        alt="프로필 사진"
        className="profile-icon"
      />
      <h3 className="profile-name">{userData?.name}</h3>
      <h3 className="profile-email text-sm ">{userData?.email}</h3>
    </div>
  );
}
