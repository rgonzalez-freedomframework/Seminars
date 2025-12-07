import { SignIn } from '@clerk/nextjs'
import React from 'react'

const AdminSignIn = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-2">Admin Portal</h1>
        <p className="text-gray-700 text-sm md:text-base">Sign in to access administrative features</p>
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
