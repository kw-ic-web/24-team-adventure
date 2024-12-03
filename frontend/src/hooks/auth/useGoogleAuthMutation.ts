import { useMutation } from '@tanstack/react-query';
import { authenticateWithGoogle } from '../../apis/googleAuth';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../components/Toast';

// Google OAuth2 인증을 위한 Mutation 훅
const useGoogleAuthMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (token: string) => {
      console.log('구글 인증 요청 중...'); // 서버로 토큰을 보내기 전에 로그
      return authenticateWithGoogle(token);
    },
    onSuccess: (data) => {
      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', data.token);
      console.log('로그인 성공:', data);

      // Show appropriate toast message
      if (data.isNewUser) {
        showToast('회원 가입이 완료되었습니다!.', 'success');
        navigate('/home');
      } else {
        showToast('로그인이 완료되었습니다!.', 'success');
        navigate('/home');
      }

      // 로그인 성공 후 /home 경로로 이동
       navigate('/home');
    },
    onError: (error) => {
      console.log('로그인 실패:', error);
    },
  });
};

export default useGoogleAuthMutation;
