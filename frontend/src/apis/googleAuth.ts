import axiosInstance from './axiosInstance';
// 구글 인증 토큰을 서버로 보내는 함수
export const authenticateWithGoogle = async (token: string) => {
  try {
    const response = await axiosInstance.post('/api/auth/google', { token });
    return response.data; // 서버에서 반환한 { success: boolean } 데이터
  } catch (error) {
    throw new Error('Google authentication failed');
  }
};

// 구글 로그인 후 서버에서 사용자 정보 가져오는 함수
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/user/me');
    return response.data; // 로그인한 사용자 정보 반환
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};
