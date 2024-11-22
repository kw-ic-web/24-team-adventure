import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 토스트 팝업을 띄우는 함수
export const showToast = (
  message: string,
  type: 'success' | 'error',
  options?: ToastOptions,
) => {
  if (type === 'success') {
    toast.success(message, options);
  } else if (type === 'error') {
    toast.error(message, options);
  }
};

// ToastContainer 설정
const Toast: React.FC = () => {
  return (
    <ToastContainer
      position="top-right" // 토스트 위치 설정
      autoClose={3000} // 자동 닫힘 시간
      hideProgressBar={true} // 프로그레스 바 숨기기
      newestOnTop={false} // 새로운 메시지를 위에 표시하지 않음
      closeOnClick // 클릭 시 닫힘
      rtl={false} // 오른쪽에서 왼쪽으로 읽는 언어 지원 안 함
    />
  );
};

export default Toast;
