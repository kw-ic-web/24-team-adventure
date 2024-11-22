// src/hooks/useUserData.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../apis/axiosInstance';

// JWT 토큰을 헤더에 포함해서 서버로 요청
const fetchUserData = async () => {
  // 로컬 스토리지에서 JWT 토큰을 가져오기
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found in localStorage');
    throw new Error('No token found');
  }
  console.log('Sending request with token:', token);
  const response = await axiosInstance.get('/api/user', {
    headers: {
      Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
    },
  });
  console.log('Response from server:', response);
  return response.data.user; // 서버에서 반환된 사용자 정보
};

export const useUserData = () => {
  return useQuery({ queryKey: ['userData'], queryFn: fetchUserData });
};
