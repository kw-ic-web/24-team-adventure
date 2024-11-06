import axios from "axios";

// Axios 인스턴스 생성 및 기본 설정
const api = axios.create({
  baseURL: "http://localhost:3000", // 백엔드 서버의 URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
