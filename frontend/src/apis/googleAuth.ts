import axiosInstance from './axiosInstance';
// 구글 인증 토큰을 서버로 보내는 함수
export const authenticateWithGoogle = async (token: string) => {
  try {
    console.log('구글 인증 요청 중...'); // 구글 인증 요청이 시작된 시점
    const response = await axiosInstance.post('/api/auth/google', { token });
    console.log('구글 인증 성공:', response.data); // 서버에서 받은 데이터 로그 출력
    return response.data;
  } catch (error) {
    throw new Error('Google authentication failed');
  }
};
