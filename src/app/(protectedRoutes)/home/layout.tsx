import { onAuthenticateUser } from "@/actions/auth";
import Sidebar from "@/components/ReusableComponent/LayoutComponents/Sidebar";
import Header from "@/components/ReusableComponent/LayoutComponents/Header";
import React from 'react'

type Props = {
  children: React.ReactNode
}

const HomeLayout = async ({ children }: Props) => {
  const userExist = await onAuthenticateUser()

  // Home is accessible to everyone, but show different UI based on auth status
  return (
    <div className="flex w-full min-h-screen">
      {/* Only show sidebar if user is authenticated (admin) */}
      {userExist.user && <Sidebar/>}
      <div className="flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto">
        {userExist.user && <Header user={userExist.user}/>}
        {children}
      </div>
    </div>
  )
}

export default HomeLayout
