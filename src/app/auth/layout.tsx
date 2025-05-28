import { currentUser } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user && !user.onboarded) {
    return redirect('/onboarding/intro');
  } else if (user && user.onboarded) {
    return redirect('/dashboard');
  }

  return <>{children}</>;
}
