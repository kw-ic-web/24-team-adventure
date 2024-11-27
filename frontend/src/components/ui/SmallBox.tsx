import './CommonUi.css'
import React from 'react'

export default function SmallBox({ children }: { children: React.ReactNode }) {
  return (
    <div className='small-main-box'>{children}</div>
  )
}
