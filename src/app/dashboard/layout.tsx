import { currentUser } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return redirect('/auth/sign-in');
  } else if (user && !user.onboarded) {
    return redirect('/onboarding/intro');
  }
  return <>{children}</>;
}
