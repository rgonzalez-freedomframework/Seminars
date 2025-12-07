import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
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