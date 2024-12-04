import './CommonUi.css'
import React from 'react'

export default function BigBox_NoScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className='big-main-box'>{children}</div>
  )
}

