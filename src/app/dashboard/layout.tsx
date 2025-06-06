import { currentUser } from '@/actions/user';
import { routes } from '@/lib/routeHelpers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return redirect(routes.auth.signIn());
  } else if (user && !user.onboarded) {
    return redirect(routes.onboarding.intro());
  }
  return <>{children}</>;
}
