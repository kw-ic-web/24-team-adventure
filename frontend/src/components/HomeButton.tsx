import React from 'react';
import { useNavigate } from 'react-router-dom';
import homeBtnImg from '../assets/images/homeBtn.png';

const HomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/home')}
      className="absolute bottom-4 right-4 p-2 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-200 rounded-full"
      title="홈으로 이동"
      aria-label="홈으로 이동"
    >
      <img src={homeBtnImg} alt="홈으로 이동" className="w-10 h-10" />
    </button>
  );
};

export default HomeButton;
