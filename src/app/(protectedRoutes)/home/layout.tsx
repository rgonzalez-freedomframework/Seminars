import React from 'react'

type Props = {
  children: React.ReactNode
}

const HomeLayout = ({ children }: Props) => {
  // Home is a clean user dashboard - no admin sidebar
  return (
    <div className="w-full min-h-screen">
      {children}
    </div>
  )
}

export default HomeLayout
