// src/pages/VideoChatEndPage.tsx
import React from 'react';
import exitImg from '../../assets/images/exitBtn.png';

export default function VideoChatEndPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-600 to-emerald-700">
      {/* 화상채팅 페이지와 동일한 크기의 고정 크기 흰색 박스 */}
      <div className="w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg h-[80vh] flex flex-col items-center justify-center relative">
        {/* X 버튼 */}
        <button className="absolute top-2 right-2 p-1">
          <img src={exitImg} alt="닫기" className="w-8 h-8" />
        </button>

        {/* 안내 텍스트 */}
        <p className="text-lg font-semibold my-4">
          화상 채팅이 종료되었습니다.
        </p>
        <p className="text-gray-500 mb-6">다른 사용자의 스토리가 궁금하다면?</p>

        {/* 게시판 바로가기 버튼 */}
        <button className="bg-teal-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-teal-300 transition-all duration-200">
          게시판 바로가기
        </button>
      </div>
    </div>
  );
}
