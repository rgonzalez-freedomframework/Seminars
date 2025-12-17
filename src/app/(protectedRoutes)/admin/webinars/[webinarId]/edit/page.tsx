import { onAuthenticateUser } from '@/actions/auth'
import { getWebinarById } from '@/actions/webinar'
import { redirect } from 'next/navigation'
import React from 'react'
import EditWebinarForm from './_components/EditWebinarForm'
import { currentUser } from '@clerk/nextjs/server'

type Props = {
  params: Promise<{ webinarId: string }>
}

const Page = async ({ params }: Props) => {
  const { webinarId } = await params
  const checkUser = await onAuthenticateUser()
  
  if (!checkUser.user) {
    redirect('/')
  }

  // Determine if this user is an admin
  const clerkUser = await currentUser()
  const isAdmin =
    clerkUser?.publicMetadata?.role === 'admin' ||
    clerkUser?.emailAddresses.some((email) =>
      email.emailAddress === 'rgonzalez@freedomframework.us' ||
      email.emailAddress === 'janellesam2020@gmail.com' ||
      email.emailAddress === 'jsam@freedomframework.us' ||
      email.emailAddress === 'sroth@freedomframework.us'
    )

  const webinar = await getWebinarById(webinarId)

  if (!webinar) {
    redirect('/admin/webinars')
  }

  // Ensure user owns this webinar, unless they are an admin
  if (!isAdmin && webinar.presenterId !== checkUser.user.id) {
    redirect('/admin/webinars')
  }

  return (
    <div className="w-full min-h-screen bg-[#F6F7F4] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1D2A38] mb-2">Edit Webinar</h1>
          <p className="text-gray-600">Update your webinar details. Changes will sync with Zoom if integrated.</p>
        </div>
        <EditWebinarForm webinar={webinar} />
      </div>
    </div>
  )
}

export default Page
