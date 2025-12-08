'use client'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { Zap } from 'lucide-react'
import PurpleIcon from '../PurpleIcon'
import CreateWebinarButton from '../CreateWebinarButton'
type Props = { user: User }

//TODO: Stripe Subscription, Assistant,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Header = ({ user }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="w-full px-6 md:px-8 lg:px-10 xl:px-12 pt-10 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="flex items-center gap-4">
        <Link href="/?view=landing" className="text-xl md:text-2xl font-bold text-[#1D2A38] hover:text-[#CCA43B] transition-colors">
          Freedom Framework™
        </Link>
        {pathname.includes('pipeline') ? (
          <Button
              className="bg-white border-2 border-[#1D2A38] text-[#1D2A38] hover:bg-[#1D2A38] hover:text-white rounded-xl font-semibold"
              variant={'outline'}
              onClick={() => router.push('/webinars')}
          >
              <ArrowLeft /> Back to Webinars
          </Button>
        ) : (
          <div className="px-4 py-2 flex justify-center text-bold items-center rounded-xl bg-white border-2 border-gray-300 text-[#1D2A38] font-semibold animate-in fade-in slide-in-from-top-2 duration-500">
              {pathname.split('/')[1] === 'admin' ? 'Admin View v1.4.0' : pathname.split('/')[1]}
          </div>
        )}
      </div>
      <div className='flex gap-6 items-center flex-wrap'>
          <Link href="/?view=landing">
            <Button
              className="!bg-white !border-2 !border-[#1D2A38] !text-[#1D2A38] hover:!bg-[#1D2A38] hover:!text-white rounded-xl font-semibold transition-all"
              variant={'outline'}
            >
              View Landing Page
            </Button>
          </Link>
          <CreateWebinarButton/>
      </div>
    </div>
  )
}

export default Header