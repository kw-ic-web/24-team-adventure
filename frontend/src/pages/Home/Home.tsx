import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">환영합니다!</h1>
      {/* 게시판으로 이동하는 버튼 */}
      <Link
        to="/board"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        게시판으로 이동
      </Link>
    </div>
  );
};

export default Home;
