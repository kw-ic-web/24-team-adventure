import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {
  fetchAllUserStatuses,
  updateUserStatus,
} from '../../utils/userStatusApi'; // API 함수 가져오기
import useGoogleAuthMutation from '../../hooks/auth/useGoogleAuthMutation';
import StartBackground from '../../components/ui/StartBackground';

interface User {
  id: number;
  name: string;
  online: boolean;
}

export default function Start() {
  const { mutate } = useGoogleAuthMutation();
  const [users, setUsers] = useState<User[]>([]);

  // Google Login 성공 핸들러
  const handleLoginSuccess = async (credentialResponse: any) => {
    const { credential } = credentialResponse;
    console.log('구글 로그인 성공:', credential);

    // 로그인 후 백엔드에 상태 업데이트 요청
    mutate(credential, {
      onSuccess: async (user) => {
        console.log('사용자 인증 성공:', user);

        // JWT 토큰 저장
        localStorage.setItem('authToken', user.token);

        // 사용자 상태를 온라인으로 설정
        try {
          await updateUserStatus(true, user.token); // online: true
          console.log('사용자 상태 업데이트 성공');
        } catch (error) {
          console.error('사용자 상태 업데이트 실패:', error);
        }
      },
      onError: (error) => {
        console.error('Google 로그인 인증 실패:', error);
      },
    });
  };

  // Google Login 실패 핸들러
  const handleLoginFailure = () => {
    console.error('Google login failed');
  };

  // 실시간 사용자 상태 가져오기
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await fetchAllUserStatuses(); // 사용자 상태 조회 API 호출
        setUsers(data); // 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch user statuses:', error);
      }
    };

    fetchStatuses(); // 초기 데이터 가져오기
    const interval = setInterval(fetchStatuses, 5000); // 5초마다 호출

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <div>
      <StartBackground />
      {/* 화면 중앙에 로고와 구글 로그인 버튼 추가 */}
      <div className="relative flex flex-col items-center justify-around pt-45 h-screen">
        {/* 프로그램 로고 */}
        <img
          src="/images/startlogo.png"
          alt="Game Logo"
          className="w-[900px] h-auto"
        />

        <div className="mt-[-150px]">
          {/* Google 로그인 버튼 */}
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            width={'220px'}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}
