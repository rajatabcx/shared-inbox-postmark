import React from 'react';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { emailDetailsPrefetch } from '@/hooks/email.hooks';
import { EmailPage } from '@/components/mail/mail-details/EmailPage';

export default async function Email({
  params,
}: {
  params: Promise<{ slug: string; email: string }>;
}) {
  const { email, slug } = await params;
  const queryClient = await emailDetailsPrefetch(Number(email));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmailPage emailId={Number(email)} inboxId={Number(slug)} />
    </HydrationBoundary>
  );
}
