import { invitationData } from '@/actions/invitation';
import { JoinForm } from '@/components/dashboard/member/JoinForm';
import { InvitationStatus } from '@/lib/types';
import React from 'react';

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await invitationData(Number(slug));
  if (!data) {
    return <div>Invitation expired</div>;
  } else if (data.status === InvitationStatus.ACCEPTED) {
    return <div>Invitation already accepted</div>;
  }

  return (
    <JoinForm
      orgName={data.organization.name}
      email={data.email}
      role={data.role}
      invitationId={Number(slug)}
    />
  );
}
