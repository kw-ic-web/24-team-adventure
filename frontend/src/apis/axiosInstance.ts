import axios from 'axios';
import { BASE_URL } from '../constants/url';

// axiosInstance 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL, // 백엔드 서버의 기본 URL
  headers: {
    'Content-Type': 'application/json', // 요청 헤더 기본값 설정
  },
});

export default axiosInstance;
