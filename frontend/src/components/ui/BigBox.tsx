import './CommonUi.css'
import React from 'react'

export default function BigBox({ children }: { children: React.ReactNode }) {
  return (
    <div className='big-main-box overflow-auto'>{children}</div>
  )
}

