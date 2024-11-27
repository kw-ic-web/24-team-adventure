import React from 'react';
import './CommonUi.css'
import bg_withpink from './bg_withpink.jpg';

export default function StartBackground() {
  return (
    <div
      className="full-page-bg"
      style={{
        backgroundImage:   `url(${bg_withpink})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left 70%',
        backgroundRepeat: "no-repeat",
        zIndex: -1, 
      }}
    ></div>
  );
}