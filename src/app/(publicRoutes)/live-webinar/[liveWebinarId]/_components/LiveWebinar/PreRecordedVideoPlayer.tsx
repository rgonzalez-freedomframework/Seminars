'use client'
import React from 'react'
import { WebinarWithPresenter } from '@/lib/type'
import { User } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video } from 'lucide-react'

type Props = {
  webinar: WebinarWithPresenter
  user: User | null
}

const PreRecordedVideoPlayer = ({ webinar, user }: Props) => {
  if (!webinar.videoUrl) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-600 text-white">
              <Video className="w-3 h-3 mr-1" />
              Pre-Recorded
            </Badge>
            {webinar.tags && webinar.tags.length > 0 && (
              <>
                {webinar.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-[#1D2A38] border-[#1D2A38]">
                    {tag}
                  </Badge>
                ))}
              </>
            )}
          </div>
          <h1 className="text-4xl font-bold text-[#1D2A38] mb-3">{webinar.title}</h1>
          {webinar.description && (
            <p className="text-gray-700 text-lg max-w-3xl">{webinar.description}</p>
          )}
          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(webinar.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            {webinar.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {webinar.duration} minutes
              </div>
            )}
          </div>
        </div>

        {/* Video Player */}
        <Card className="bg-white border-2 border-gray-300 mb-8">
          <CardContent className="p-0">
            <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <video
                controls
                className="absolute top-0 left-0 w-full h-full"
                controlsList="nodownload"
                poster={webinar.thumbnail || undefined}
              >
                <source src={webinar.videoUrl} type="video/mp4" />
                <source src={webinar.videoUrl} type="video/webm" />
                <source src={webinar.videoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>

        {/* Presenter Info */}
        {webinar.presenter && (
          <Card className="bg-white border-2 border-gray-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#1D2A38] mb-4">About the Presenter</h3>
              <div className="flex items-center gap-4">
                {webinar.presenter.profileImage && (
                  <img
                    src={webinar.presenter.profileImage}
                    alt={webinar.presenter.name || 'Presenter'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#CCA43B]"
                  />
                )}
                <div>
                  <p className="font-semibold text-[#1D2A38] text-lg">
                    {webinar.presenter.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600">Webinar Host</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default PreRecordedVideoPlayer
