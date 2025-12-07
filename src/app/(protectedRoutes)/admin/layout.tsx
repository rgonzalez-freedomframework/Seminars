import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const AdminLayout = async ({ children }: Props) => {
  const userExist = await onAuthenticateUser();

  if (!userExist.user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
};

export default AdminLayout;
