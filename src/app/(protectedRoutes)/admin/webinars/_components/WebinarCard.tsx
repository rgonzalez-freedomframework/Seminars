'use client'

import { Webinar } from '@prisma/client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, GitFork, MoreVertical, Pencil, Trash2, XCircle } from 'lucide-react'
import { deleteWebinar, cancelWebinar } from '@/actions/webinarManagement'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

type Props = {
  webinar: Webinar
}

const WebinarCard = ({ webinar }: Props) => {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteWebinar(webinar.id)
      if (result.status === 200) {
        toast.success('Webinar deleted successfully')
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to delete webinar')
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const result = await cancelWebinar(webinar.id)
      if (result.status === 200) {
        toast.success('Webinar cancelled successfully')
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to cancel webinar')
    } finally {
      setIsLoading(false)
      setShowCancelDialog(false)
    }
  }
  return (
    <div className="flex gap-3 flex-col items-start w-full">
      <Link href={`/live-webinar/${webinar?.id}`} className="w-full max-w-[400px]">
        <Image
          src={webinar?.thumbnail || "/darkthumbnail.png"}
          alt="webinar"
          width={400}
          height={100}
          className="rounded-md w-[400px] object-cover"
        />
      </Link>
          <div className="w-full flex justify-between gap-3 items-center">
      <Link href={`/live-webinar/${webinar?.id}`} className="flex flex-col gap-2 items-start">
        <div>
          <p className="text-sm text-[#1D2A38] font-semibold">{webinar?.title}</p>
          <p className="text-xs text-gray-600">{webinar?.description}</p>
        </div>

        <div className="flex gap-2 justify-start items-center">
        <div className="flex gap-2 items-center text-xs text-gray-600">
          <Calendar size={15} className="text-[#1D2A38]" />
          <p>{format(new Date(webinar?.startTime), 'dd/MM/yyyy')}</p>
        </div>
      </div>
      </Link>

      <div className="flex gap-2 items-center">
        <Link
          href={`/admin/webinars/${webinar?.id}/pipeline`}
          className="flex px-4 py-2 rounded-md border-2 border-gray-300 bg-white shadow-md hover:shadow-lg hover:border-[#CCA43B] transition-all"
        >
          <GitFork className="w-4 h-4 text-[#1D2A38]" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-2 border-gray-300 bg-white shadow-md hover:shadow-lg hover:border-[#CCA43B]"
            >
              <MoreVertical className="w-4 h-4 text-[#1D2A38]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/webinars/${webinar.id}/edit`} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Webinar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {webinar.webinarStatus !== 'CANCELLED' && webinar.webinarStatus !== 'ENDED' && (
              <DropdownMenuItem
                onClick={() => setShowCancelDialog(true)}
                className="cursor-pointer text-orange-600"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Webinar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Webinar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Webinar</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{webinar.title}"? This action cannot be undone and will also delete it from Zoom if integrated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Cancel Confirmation Dialog */}
    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Webinar</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel "{webinar.title}"? This will mark it as cancelled and notify attendees.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>No, Keep It</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? 'Cancelling...' : 'Yes, Cancel Webinar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  )
}

export default WebinarCard