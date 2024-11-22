import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

import useGoogleAuthMutation from '../../hooks/auth/useGoogleAuthMutation';

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
  // TanStack Query의 useMutation을 사용하여 구글 로그인 후 인증 요청 처리
  const { mutate } = useGoogleAuthMutation();
  const handleLoginSuccess = (credentialResponse: any) => {
    const { credential } = credentialResponse;
    console.log('구글 로그인 성공:', credential);
    // 백엔드에 credential을 전달
    mutate(credential);
  };

  // 구글 로그인 실패 시 호출되는 함수 (error 파라미터를 받음)
  const handleLoginFailure = () => {
    console.error('Google login failed');
  };

  return (
    <div className="full-page-bg">
        {/* 실시간 사용자 목록 박스 */}
        <div className="user-list-box">
          {users.map((user) => (
            <div key={user.id} className="user-list-item">
              <div className="flex items-center space-x-2">
                <span role="img" aria-label="user-profile" className="text-xl">
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
      

      {/* 화면 중앙에 로고와 구글 로그인 버튼 추가 */}
      <div className="relative flex flex-col items-center justify-center absolute inset-0 m-auto">
        {/* 프로그램 로고 */}
       
          <img
            src="/images/startlogo.png"
            alt="Game Logo"
            style={{ position: 'absolute', top: '25%', left: '50%',transform: 'translateX(-50%)', maxHeight: '90%'  }}
          />
      
      <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(45%, 1600%)'  }}>
        {/* 구글 로그인 버튼 */}
        <GoogleLogin
          onSuccess={handleLoginSuccess} // 로그인 성공 시 호출되는 함수
          onError={handleLoginFailure} // 로그인 실패 시 호출되는 함수
          width={'220px'}
          useOneTap // One Tap 로그인 기능을 활성화
        />
      </div>
      </div>
    </div>
  );
}
