import React from 'react';
import './CommonUi.css'
import bg_onlygreen from './bg_onlygreen.jpg';

export default function StartBackground() {
  return (
    <div
      className="full-page-bg"
      style={{
        backgroundImage:   `url(${bg_onlygreen})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left 70%',
        backgroundRepeat: "no-repeat",
        zIndex: -1, 
      }}
    ></div>
  );
}

//bg_withyellow2
//bg_onlygreen

//bg_withyellow


//bg_onlypink