import React from 'react'
import {  Link } from 'react-router-dom';
export default function HeaderLogo() {
  return (
    <Link to="/Home">
    <div
    className="relative z-50 top-[7%] left-[4%] w-[190px]  p-7"
    title="상단로고"
    aria-label="상단로고"
    
  >
    <img
      src="/images/headerlogo5.png"
      alt="상단로고"
      className="  ml-2 transform transition-transform hover:scale-110"
    />
  </div>
  </Link>
  )
}
