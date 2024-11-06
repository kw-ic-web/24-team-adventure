import React from "react";
import { Link } from "react-router-dom";

const HomeButton: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* 홈 페이지로 이동하는 링크 */}
      <Link to="/">
        <img
          src="/home-icon.png"
          alt="Home"
          className="w-12 h-12 hover:scale-110 transition-transform duration-200"
        />
      </Link>
    </div>
  );
};

export default HomeButton;
