import PageHeader from '@/components/ReusableComponent/PageHeader';
import { Webcam, GitFork, Users } from 'lucide-react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prismaClient } from '@/lib/prismaClient';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

const page = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect('/');
  }

  // Get all attendees who registered for this presenter's webinars
  const attendees = await prismaClient.attendee.findMany({
    include: {
      Attendance: {
        include: {
          webinar: {
            select: {
              id: true,
              title: true,
              presenterId: true,
              startTime: true,
              zoomJoinUrl: true,
              zoomPassword: true,
            },
          },
        },
        where: {
          webinar: {
            presenterId: checkUser.user.id,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="w-full h-screen flex flex-col px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="w-full flex flex-col">
        <PageHeader
          leftIcon={<Webcam className="w-3 h-3" />}
          mainIcon={<Users className="w-12 h-12" />}
          rightIcon={<GitFork className="w-3 h-3" />}
          heading="The home to all your customers"
          placeholder="Search customer..."
        />
      </div>

      <div className="flex-grow overflow-y-auto mt-6"> 
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm text-gray-700 font-semibold">Name</TableHead>
              <TableHead className="text-sm text-gray-700 font-semibold">Email</TableHead>
              <TableHead className="text-sm text-gray-700 font-semibold">Phone</TableHead>
              <TableHead className="text-sm text-gray-700 font-semibold">Business</TableHead>
              <TableHead className="text-sm text-gray-700 font-semibold">Description</TableHead>
              <TableHead className="text-right text-sm text-gray-700 font-semibold">Webinars Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.length > 0 ? (
              attendees.map((attendee) => (
                <TableRow key={attendee.id} className="border-0">
                  <TableCell className="font-medium text-[#1D2A38]">{attendee.name}</TableCell>
                  <TableCell className="text-gray-700">{attendee.email}</TableCell>
                  <TableCell className="text-gray-700">{attendee.phone || '-'}</TableCell>
                  <TableCell className="text-gray-700">{attendee.businessName || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate text-gray-700">{attendee.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    {attendee.Attendance.length > 0 ? (
                      <div className="flex flex-col items-end gap-1">
                        {attendee.Attendance.map((attendance) => (
                          <div
                            key={attendance.id}
                            className="inline-flex flex-col items-end rounded-full bg-gray-50 px-3 py-1 border border-gray-200 max-w-xs text-right"
                          >
                            <span className="text-xs font-semibold text-[#1D2A38] truncate">
                              {attendance.webinar.title}
                            </span>
                            <span className="text-[11px] text-gray-600">
                              {format(new Date(attendance.webinar.startTime), 'MMM dd, yyyy • hh:mm a')}
                            </span>
                            {attendance.webinar.zoomJoinUrl && (
                              <span className="text-[11px] text-blue-700 truncate" title={attendance.webinar.zoomJoinUrl}>
                                Zoom: {attendance.webinar.zoomJoinUrl}
                              </span>
                            )}
                            {attendance.webinar.zoomPassword && (
                              <span className="text-[11px] text-gray-600">
                                Passcode: {attendance.webinar.zoomPassword}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-600">
                  No leads yet. Create a webinar and share the link to start collecting leads!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
