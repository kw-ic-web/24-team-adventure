import React from 'react'
import {  Link } from 'react-router-dom';
export default function HeaderLogo() {
  return (
    
    <div
    className="absolute z-50 top-[0%] left-[13%] w-[190px]  p-7"
    title="상단로고"
    aria-label="상단로고"

  >
    <Link to="/Home">
    <img
      src="/images/headerlogo11.png"
      alt="상단로고"
      className="  ml-2 transform transition-transform hover:scale-110"
    />
    </Link>
  </div>
  
  )
}
