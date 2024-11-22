import React from 'react';
import './CommonUi.css'

export default function Background() {
  return (
    <div
      className="full-page-bg"
      style={{
        backgroundImage: "url('/images/bg_withyellow.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'left 70%',
        backgroundRepeat: "no-repeat",
        zIndex: -1, 
      }}
    ></div>
  );
}
