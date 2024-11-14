// frontend/src/store/useAuthStore.ts
//일단 넣어놓은 코드.
import { create } from 'zustand';

interface User {
  id: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'), // 토큰 유무로 초기 상태 설정
  user: null,

  // 로그인 함수
  login: (token, user) => {
    localStorage.setItem('token', token); // 토큰을 localStorage에 저장
    set({ isAuthenticated: true, user });
  },

  // 로그아웃 함수
  logout: () => {
    localStorage.removeItem('token'); // 토큰 제거
    set({ isAuthenticated: false, user: null });
  },
}));

export default useAuthStore;
