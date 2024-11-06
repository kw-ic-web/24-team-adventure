// frontend/src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>환영합니다!</h1>
      <p>동화별 게시판에 오신 것을 환영합니다.</p>
      <Link to="/board">
        <button className="start-button">게시판으로 이동</button>
      </Link>
    </div>
  );
};

export default Home;
