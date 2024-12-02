// frontend/src/apis/axiosInstance.ts

import axios from 'axios';
import { BASE_URL } from '../constants/url';

// axiosInstance 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL, // 백엔드 서버의 기본 URL
  headers: {
    'Content-Type': 'application/json', // 요청 헤더 기본값 설정
  },
});

// 요청 인터셉터 설정: 모든 요청에 JWT 토큰을 자동으로 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 JWT 토큰 가져오기
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 JWT 토큰 추가
      console.log('Request headers:', config.headers); // 요청 헤더 로그 추가
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터 설정: 모든 응답과 에러를 로그로 출력
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response); // 응답 로그
    return response;
  },
  (error) => {
    console.error('Response error:', error); // 응답 에러 로그
    return Promise.reject(error);
  },
);

export default axiosInstance;
