import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {children}
    </div>
  )
}

export default Layout