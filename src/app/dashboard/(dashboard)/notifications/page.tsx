import React from 'react';

import { notificationsPrefetch } from '@/hooks/notification.hooks';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { NotificationList } from '@/components/notification/NotificationList';

export default async function NotificationPage() {
  const queryClient = await notificationsPrefetch();

  return (
    <div className='container px-4 sm:px-6 mx-auto py-6 h-screen flex flex-col gap-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Notifications</h1>
        <p className='text-sm text-muted-foreground'>
          Updates from all the emails you have subscribed to.
        </p>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotificationList />
      </HydrationBoundary>
    </div>
  );
}
