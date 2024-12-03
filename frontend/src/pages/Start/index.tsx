import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import useGoogleAuthMutation from '../../hooks/auth/useGoogleAuthMutation';
import StartBackground from '../../components/ui/StartBackground';



export default function Start() {
 

  // TanStack Query의 useMutation을 사용하여 구글 로그인 후 인증 요청 처리
  const { mutate } = useGoogleAuthMutation();
  
  const handleLoginSuccess = (credentialResponse: any) => {
    const { credential } = credentialResponse;
    mutate(credential);
  };

  const handleLoginFailure = () => {
    console.error('Google login failed');
  };

  
  

 

  return (
    <div>
      <StartBackground />
      <div className="flex flex-col items-center justify-around mt-[9%]">
        <img
          src="/images/startlogo_marble.png"
          alt="Game Logo"
          className="w-[70%] h-auto mt-[-70px]" // startlogo 위치 아래로 이동
        />

        
        
          <div className="flex justify-center items-center mt-[1%]">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              width={'200px'}
              useOneTap
            />
          </div>
        
        
      </div>
    </div>
  );
}
