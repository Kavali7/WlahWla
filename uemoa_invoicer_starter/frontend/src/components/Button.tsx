import React from 'react'
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => (
  <button className="btn" {...props}>{children}</button>
)
