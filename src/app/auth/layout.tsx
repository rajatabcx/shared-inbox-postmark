import { currentUser } from '@/actions/user';
import { routes } from '@/lib/routeHelpers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user && !user.onboarded) {
    return redirect(routes.onboarding.intro());
  } else if (user && user.onboarded) {
    return redirect(routes.dashboard.root());
  }

  return <>{children}</>;
}
