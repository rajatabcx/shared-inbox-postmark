import { invitationData } from '@/actions/invitation';
import { JoinForm } from '@/components/dashboard/member/JoinForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InvitationStatus } from '@/lib/types';
import Link from 'next/link';
import React from 'react';

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await invitationData(Number(slug));
  if (!data) {
    return (
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Invitation expired</CardTitle>
          <CardDescription>
            The invitation link has expired or is no longer valid.
          </CardDescription>
          <CardFooter>
            <Button asChild>
              <Link href='/dashboard'>Go to dashboard</Link>
            </Button>
          </CardFooter>
        </CardHeader>
      </Card>
    );
  } else if (data.status === InvitationStatus.ACCEPTED) {
    return (
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle>Invitation already accepted</CardTitle>
          <CardDescription>
            You have already accepted this invitation.
          </CardDescription>
          <CardFooter>
            <Button asChild>
              <Link href='/dashboard'>Go to dashboard</Link>
            </Button>
          </CardFooter>
        </CardHeader>
      </Card>
    );
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
