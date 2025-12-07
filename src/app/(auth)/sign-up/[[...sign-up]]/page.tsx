import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1D2A38] via-[#3A4750] to-[#1D2A38]">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Get Started Free</h1>
        <p className="text-gray-400">Create your account to access exclusive content</p>
      </div>
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/home"
      />
    </div>
  )
}

export default Signup