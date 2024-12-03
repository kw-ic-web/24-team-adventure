import React from 'react';
import './CommonUi.css'

export default function Background() {
  return (
    <div
      className="full-page-bg"
      style={{
        backgroundImage: "url('/images/수정배경3.jpg')",
        backgroundSize: '120%',
        backgroundPosition: 'center 70%',
        backgroundRepeat: "no-repeat",
        zIndex: -1, 
      }}
    ></div>
  );
}
