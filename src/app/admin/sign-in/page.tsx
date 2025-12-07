import { SignIn } from '@clerk/nextjs'
import React from 'react'

const AdminSignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1D2A38] via-[#3A4750] to-[#1D2A38]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
        <p className="text-gray-400">Sign in to access administrative features</p>
      </div>
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
        routing="path"
        path="/admin/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/admin/webinars"
      />
    </div>
  )
}

export default AdminSignIn
