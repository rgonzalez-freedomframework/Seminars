import React from 'react';

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return <div className="w-full container mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">{children}</div>;
};

export default layout;