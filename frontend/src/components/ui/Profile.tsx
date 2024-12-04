import React from 'react';
import { Link } from 'react-router-dom';
import './CommonUi.css';
import { useUserData } from '../../hooks/auth/useUserData';
import Background from '../../components/ui/Background';

export default function Profile({ children }) {
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
      
      <div className="flex  items-center">
      
      <img
        src={userData?.icon || 'https://via.placeholder.com/100'}
        alt="프로필 사진"
        className="profile-icon "
      />
      <Link to="/MyPage">
      <h3 className="profile-name transform transition-transform hover:scale-110">{userData?.name}</h3>
      </Link>
      {children}
      </div>
<<<<<<< HEAD

=======
      
      
>>>>>>> 7335f24a569f92ffe2798b6c640fd70c6276b72a
    </div>
    
  );
}
