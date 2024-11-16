import React from 'react';
import { Link } from 'react-router-dom';
import './HomeButton.css';

const HomeButton: React.FC = () => {
  return (
    <div className="home-button-container">
      <Link to="/">
        <img
          src="/src/assets/images/homeBtn.png"
          alt="Home"
          className="home-button-image"
        />
      </Link>
    </div>
  );
};

export default HomeButton;
