import { useMutation } from '@tanstack/react-query';
import { authenticateWithGoogle } from '../apis/googleAuth';

// Google OAuth2 인증을 위한 Mutation 훅
const useGoogleAuthMutation = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      return authenticateWithGoogle(token);
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log('로그인 실패:', error);
    },
  });
};

export default useGoogleAuthMutation;
