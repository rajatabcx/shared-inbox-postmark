import { DashboardSidebar } from '@/components/dashboard/sidebar/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className='flex-1 bg-background w-full'>{children}</main>
    </SidebarProvider>
  );
}
