import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Signin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1D2A38] mb-2">Welcome Back</h1>
        <p className="text-gray-700">Sign in to access your dashboard</p>
      </div>
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/home"
      />
    </div>
  )
}

export default Signin