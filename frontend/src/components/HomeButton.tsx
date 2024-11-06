import React from "react";
import { Link } from "react-router-dom";
import "./HomeButton.css"; // 홈 버튼 스타일링 CSS

const HomeButton: React.FC = () => {
  return (
    <div className="home-button">
      {/* 홈 페이지로 이동하는 링크 */}
      <Link to="/">
        <img src="/home-icon.png" alt="Home" />
      </Link>
    </div>
  );
};

export default HomeButton;
