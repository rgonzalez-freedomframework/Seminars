import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Signin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4">
      <div className="text-center mb-6 md:mb-8 max-w-md w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-2">Welcome Back</h1>
        <p className="text-gray-700 text-sm md:text-base">Sign in to access your dashboard</p>
      </div>
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl w-full bg-white border-2 border-gray-300",
              formButtonPrimary: "bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold",
              footerActionLink: "text-[#1D2A38] hover:text-[#CCA43B]"
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/home"
        />
      </div>
    </div>
  )
}

export default Signin