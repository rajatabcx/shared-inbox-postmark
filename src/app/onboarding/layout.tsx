import { currentUser } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return redirect('/auth/sign-in');
  } else if (user && user.onboarded) {
    return redirect('/dashboard');
  }

  return (
    <div className='container mx-auto py-10 min-h-screen flex items-center justify-center'>
      {children}
    </div>
  );
}
