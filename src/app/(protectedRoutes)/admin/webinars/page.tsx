import { onAuthenticateUser } from '@/actions/auth'
import { getWebinarByPresenterId, getAllWebinars } from '@/actions/webinar'
import { checkAndUpdateExpiredWebinars } from '@/actions/webinarManagement'
import PageHeader from '@/components/ReusableComponent/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import { Webcam,HomeIcon, Handshake, XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import WebinarCard from './_components/WebinarCard'
import { Webinar } from '@prisma/client'
import { currentUser } from '@clerk/nextjs/server'

const Page = async () => {
  const checkUser = await onAuthenticateUser()
  if (!checkUser.user) {
    redirect('/')
  }
  
  // Check and update any webinars that should have ended
  await checkAndUpdateExpiredWebinars()
  
  // Check if user is admin
  const user = await currentUser()
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
    user?.emailAddresses.some(email => 
      email.emailAddress === 'rgonzalez@freedomframework.us' ||
      email.emailAddress === 'janellesam2020@gmail.com' ||
      email.emailAddress === 'jsam@freedomframework.us' ||
      email.emailAddress === 'sroth@freedomframework.us'
    )
  
  // Admins see all webinars, non-admins see only their own
  const webinars = isAdmin 
    ? await getAllWebinars()
    : await getWebinarByPresenterId(checkUser?.user?.id)
  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3" />}
        mainIcon={<Webcam className="w-12 h-12" />}
        rightIcon={<Handshake className="w-4 h-4" />}
        heading="The home to all your webinars"
        placeholder="Search option..."
      >
      <TabsList className="!bg-transparent space-x-3 h-auto p-0">
        <TabsTrigger
            value="all"
            className="!bg-white !border-2 !border-gray-300 !text-[#1D2A38] data-[state=active]:!bg-[#CCA43B] data-[state=active]:!text-[#1D2A38] data-[state=active]:!border-[#CCA43B] px-8 py-4 font-semibold shadow-sm"
        >
            All
        </TabsTrigger>
        <TabsTrigger
            value="upcoming"
            className="!bg-white !border-2 !border-gray-300 !text-[#1D2A38] data-[state=active]:!bg-[#CCA43B] data-[state=active]:!text-[#1D2A38] data-[state=active]:!border-[#CCA43B] px-8 py-4 font-semibold shadow-sm"
        >
            Upcoming
        </TabsTrigger>
                <TabsTrigger
                    value="ended"
                    className="!bg-white !border-2 !border-gray-300 !text-[#1D2A38] data-[state=active]:!bg-[#CCA43B] data-[state=active]:!text-[#1D2A38] data-[state=active]:!border-[#CCA43B] px-8 py-4 font-semibold shadow-sm"
                >
                    Ended
                </TabsTrigger>
                <TabsTrigger
                    value="cancelled"
                    className="!bg-white !border-2 !border-gray-300 !text-[#1D2A38] data-[state=active]:!bg-red-100 data-[state=active]:!text-red-800 data-[state=active]:!border-red-400 px-8 py-4 font-semibold shadow-sm flex items-center gap-2"
                >
                    <XCircle className="w-4 h-4" />
                    Cancelled / Deleted
                </TabsTrigger>
        </TabsList>
        </PageHeader>
        <TabsContent
        value="all"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start px-6 md:px-8 lg:px-10 xl:px-12 gap-y-10 gap-x-6"
        >
        {webinars?.length > 0 ? (
            webinars.map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
            ))
        ) : (
            <div className="w-full h-[200px] flex justify-center items-center text-[#1D2A38] font-semibold text-2xl col-span-12">
            No Webinar found
            </div>
        )}
</TabsContent>
        <TabsContent
        value="upcoming"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start px-6 md:px-8 lg:px-10 xl:px-12 gap-y-10 gap-x-6"
        >
        {webinars?.filter((w: Webinar) => 
            new Date(w.startTime) > new Date() && 
            w.webinarStatus !== 'ENDED' && 
            w.webinarStatus !== 'CANCELLED'
        )
        ?.length > 0 ? (
            webinars
                .filter((w: Webinar) => 
                    new Date(w.startTime) > new Date() && 
                    w.webinarStatus !== 'ENDED' && 
                    w.webinarStatus !== 'CANCELLED'
                )
                .map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
            ))
        ) : (
            <div className="w-full h-[200px] flex justify-center items-center text-[#1D2A38] font-semibold text-2xl col-span-12">
            No Upcoming Webinars
            </div>
        )}
        </TabsContent>
        <TabsContent
        value="ended"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start px-6 md:px-8 lg:px-10 xl:px-12 gap-y-10 gap-x-6"
        >
        {webinars?.filter((w: Webinar) => w.webinarStatus === 'ENDED')?.length > 0 ? (
            webinars.filter((w: Webinar) => w.webinarStatus === 'ENDED').map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
            ))
        ) : (
            <div className="w-full h-[200px] flex justify-center items-center text-[#1D2A38] font-semibold text-2xl col-span-12">
            No Ended Webinars
            </div>
        )}
        </TabsContent>
        <TabsContent
        value="cancelled"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-start place-content-start px-6 md:px-8 lg:px-10 xl:px-12 gap-y-10 gap-x-6"
        >
        {webinars?.filter((w: Webinar) => w.webinarStatus === 'CANCELLED')?.length > 0 ? (
            webinars.filter((w: Webinar) => w.webinarStatus === 'CANCELLED').map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
            ))
        ) : (
            <div className="w-full h-[200px] flex justify-center items-center text-[#1D2A38] font-semibold text-2xl col-span-12">
            No Cancelled or Deleted Webinars
            </div>
        )}
        </TabsContent>
    </Tabs>
  )
}

export default Page