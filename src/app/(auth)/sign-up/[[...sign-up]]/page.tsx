import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 sm:px-6 md:px-8">
      <div className="text-center mb-6 md:mb-8 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-2">Get Started Free</h1>
        <p className="text-gray-700 text-sm md:text-base">Create your account to access exclusive content</p>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full flex justify-center",
              card: "shadow-xl w-full !max-w-none bg-white border-2 border-gray-300 p-8 md:p-12",
              formButtonPrimary: "bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold",
              footerActionLink: "text-[#1D2A38] hover:text-[#CCA43B]",
              formFieldInput: "border-2 border-gray-300 text-base",
              headerTitle: "text-2xl",
              headerSubtitle: "text-base"
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/home"
        />
      </div>
    </div>
  )
}

export default Signup