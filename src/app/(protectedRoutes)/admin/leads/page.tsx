import PageHeader from '@/components/ReusableComponent/PageHeader';
import { Webcam, GitFork, Users, Download } from 'lucide-react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { prismaClient } from '@/lib/prismaClient';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import LeadWebinarBadges from './LeadWebinarBadges';
import { currentUser } from '@clerk/nextjs/server';

const page = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect('/');
  }

  // Determine if this user is an admin
  const clerkUser = await currentUser();
  const isAdmin = !!(
    clerkUser &&
    (
      clerkUser.publicMetadata?.role === 'admin' ||
      clerkUser.emailAddresses.some((email) =>
        email.emailAddress === 'rgonzalez@freedomframework.us' ||
        email.emailAddress === 'janellesam2020@gmail.com' ||
        email.emailAddress === 'jsam@freedomframework.us' ||
        email.emailAddress === 'sroth@freedomframework.us'
      )
    )
  );

  // Get all attendees who registered for webinars.
  // For non-admins, only include attendance records for their own webinars.
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
        where: isAdmin
          ? {}
          : {
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
        <div className="mt-4 flex justify-end">
          <a
            href="/api/admin/leads/export"
            className="inline-flex items-center gap-2 rounded-md border border-[#1D2A38]/20 bg-white px-3 py-1.5 text-xs font-medium text-[#1D2A38] shadow-sm hover:bg-[#F6F7F4]"
          >
            <Download className="h-3 w-3" />
            Download CSV
          </a>
        </div>
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
                      <TableCell className="text-right align-top">
                        <LeadWebinarBadges
                          attendances={attendee.Attendance as any}
                          attendeeInfo={{
                            id: attendee.id,
                            name: attendee.name,
                            email: attendee.email,
                            phone: attendee.phone || undefined,
                            businessName: attendee.businessName || undefined,
                            description: attendee.description || undefined,
                          }}
                          isAdmin={isAdmin}
                        />
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
