import { InviteUser } from '@/components/dashboard/member/InviteUser';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { usePendingInvitations } from '@/hooks/invitation.hooks';
import { useOrganizationMembers } from '@/hooks/organization.hooks';
import { cn } from '@/lib/utils';
import { ArrowLeft, EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

export default function Members() {
  const { data: pendingInvites, isLoading: isPendingInvitesLoading } =
    usePendingInvitations();
  const { data: orgMembers, isLoading: isOrgMembersLoading } =
    useOrganizationMembers();
  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 min-h-screen flex flex-col gap-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-x-2'>
            <Link
              className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
              href='/dashboard'
            >
              <ArrowLeft className='size-4' />
            </Link>
            <div>
              <h1 className='text-2xl font-bold'>Team Members</h1>
              <p className='text-sm text-muted-foreground'>
                Every active member of your organization is listed below.
              </p>
            </div>
          </div>
        </div>
        <div>
          <InviteUser />
        </div>
      </div>

      <div className='flex flex-col gap-y-6'>
        <div>
          {isOrgMembersLoading ? (
            <div>Loading...</div>
          ) : !orgMembers?.length ? (
            <p className='text-sm text-muted-foreground'>No team members</p>
          ) : (
            <div className='flex flex-col gap-y-2'>
              {orgMembers.map((member) => (
                <div
                  key={member.id}
                  className='border-b flex items-center justify-between py-2'
                >
                  <div className='flex items-center gap-x-2'>
                    <Avatar className='size-10'>
                      <AvatarFallback>
                        {member.first_name.charAt(0)}
                        {member.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>
                        {member.first_name} {member.last_name}
                      </p>
                      <span className='text-sm text-muted-foreground'>
                        {member.email}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button variant='ghost'>
                      <EllipsisVertical className='size-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className='text-lg font-bold mb-4'>Pending Invitations</h2>

          {isPendingInvitesLoading ? (
            <div>Loading...</div>
          ) : !pendingInvites?.length ? (
            <p className='text-sm text-muted-foreground'>
              No pending invitations
            </p>
          ) : (
            <div className='flex flex-col gap-y-2 border-b'>
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className='border-b flex items-center justify-between py-2'
                >
                  <div className='flex items-center gap-x-2'>
                    <Avatar className='size-10'>
                      <AvatarFallback>
                        {invite.email.charAt(0).toUpperCase()}
                        {invite.email.charAt(1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='font-medium'>{invite.email}</p>
                      <span className='text-sm text-muted-foreground'>
                        {invite.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button variant='ghost'>
                      <EllipsisVertical className='size-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
