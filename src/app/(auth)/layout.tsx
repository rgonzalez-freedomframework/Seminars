import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-white via-gray-50 to-gray-100 px-4 sm:px-6 md:px-8 relative">
      {/* Top gradient bar for mobile status bar area */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10" />
      
      {/* Bottom gradient bar for mobile gesture area */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
      
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}

export default Layout