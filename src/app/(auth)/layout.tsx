import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white px-4 sm:px-6 md:px-8 relative" style={{background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 50%, #FFFFFF 100%)'}}>
      {children}
    </div>
  )
}

export default Layout