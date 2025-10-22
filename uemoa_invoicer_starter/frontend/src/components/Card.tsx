import React from 'react'
export const Card: React.FC<React.PropsWithChildren<{title?:string}>> = ({title, children}) => (
  <div className="card p-4">
    {title && <h3 className="font-medium mb-2">{title}</h3>}
    {children}
  </div>
)
