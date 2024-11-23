import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function HomeBtn() {
    const navigate = useNavigate();
  return (
    <button
    onClick={() => navigate('/home')}
    className="absolute bottom-[30px] right-[10px] w-[100px] h-[200px] p-4 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
    title="홈으로 이동"
    aria-label="홈으로 이동"
  >
    <img
      src="/images/homeBtn.png"
      alt="홈으로 이동"
      className="w-30 h-30"
    />
  </button>
  )
}
