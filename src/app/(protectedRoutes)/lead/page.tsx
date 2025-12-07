import PageHeader from '@/components/ReusableComponent/PageHeader';
import { Webcam, GitFork, Users } from 'lucide-react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { prismaClient } from '@/lib/prismaClient';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';

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
              title: true,
              presenterId: true,
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
              <TableHead className="text-sm text-muted-foreground">Name</TableHead>
              <TableHead className="text-sm text-muted-foreground">Email</TableHead>
              <TableHead className="text-sm text-muted-foreground">Phone</TableHead>
              <TableHead className="text-sm text-muted-foreground">Business</TableHead>
              <TableHead className="text-sm text-muted-foreground">Description</TableHead>
              <TableHead className="text-right text-sm text-muted-foreground">Webinars</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.length > 0 ? (
              attendees.map((attendee) => (
                <TableRow key={attendee.id} className="border-0">
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.phone || '-'}</TableCell>
                  <TableCell>{attendee.businessName || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{attendee.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    {attendee.Attendance.map((attendance, idx) => (
                      <Badge key={idx} variant="outline" className="ml-1">
                        {attendance.webinar.title}
                      </Badge>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
