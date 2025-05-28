import React from 'react';
import type { Metadata } from 'next';
import { invitationData } from '@/actions/invitation';
import { InvitationStatus } from '@/lib/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await invitationData(Number(slug));

  if (!data) {
    return {
      title: 'Invitation Expired | Replyas',
      description: 'This invitation link has expired or is no longer valid.',
    };
  }

  if (data.status === InvitationStatus.ACCEPTED) {
    return {
      title: 'Invitation Already Accepted | Replyas',
      description: 'This invitation has already been accepted.',
    };
  }

  return {
    title: `Join ${data.organization.name} on Replyas`,
    description: `You've been invited to join ${data.organization.name}'s shared inbox on Replyas. Accept your invitation to start collaborating on team emails.`,
  };
}

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
