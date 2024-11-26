import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import UserList from '../../components/ui/Userlist';
import useGoogleAuthMutation from '../../hooks/auth/useGoogleAuthMutation';
import StartBackground from '../../components/ui/StartBackground';


/*
To do:
다른 사용자 목록 박스 : 사용자 db 연결, 본인 외 나머지
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
    <div> <StartBackground />
      {/* 실시간 사용자 목록 박스 */}
      <div>
        <UserList users={users} />
      </div>
      {/* 화면 중앙에 로고와 구글 로그인 버튼 추가 */}
      <div className="relative flex flex-col items-center justify-around pt-45 h-screen ">
        {/* 프로그램 로고 */}

        <img src="/images/startlogo.png" alt="Game Logo"  className="w-[900px] h-auto" />

        <div className="mt-[-150px]" >
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
