import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Signin = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1D2A38] mb-2">Welcome Back</h1>
        <p className="text-gray-700 text-sm md:text-base">Sign in to access your dashboard</p>
      </div>
      <div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl w-full bg-white border-2 border-gray-300 p-6 md:p-10",
              formButtonPrimary: "bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold",
              footerActionLink: "text-[#1D2A38] hover:text-[#CCA43B]",
              formFieldInput: "border-2 border-gray-300 text-base",
              headerTitle: "text-2xl",
              headerSubtitle: "text-base"
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