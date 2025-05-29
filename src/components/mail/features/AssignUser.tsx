'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toastHelper } from '@/lib/toastHelper';
import { AssignedUser } from './AssignedUser';
import { Member, ResponseType } from '@/lib/types';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUpdateEmailAssignee } from '@/hooks/email.hooks';

export function AssignUser({
  assignedTo,
  emailId,
  members,
  className,
}: {
  assignedTo:
    | { name?: string; id: number; imageUrl?: string | null }
    | undefined;
  emailId: number;
  members: Member[];
  className?: string;
}) {
  const [currentAssignee, setCurrentAssignee] = useState(assignedTo);
  const { mutateAsync, isPending } = useUpdateEmailAssignee();
  const handleAssignUser = async (member?: Member) => {
    setCurrentAssignee(
      member
        ? {
            name: `${member?.first_name} ${member?.last_name}`,
            id: member?.id!,
            imageUrl: member?.image_url,
          }
        : undefined
    );
    const res = await mutateAsync({
      emailId: emailId,
      assigneeId: member?.id,
    });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setCurrentAssignee(assignedTo);
    }
  };

  useEffect(() => {
    setCurrentAssignee(assignedTo);
  }, [assignedTo]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='cursor-pointer outline-none ring-0'>
        <AssignedUser
          assignedTo={currentAssignee?.name}
          imageUrl={currentAssignee?.imageUrl}
          className={className}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='text-sm' side='bottom' align='end'>
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => {
            handleAssignUser();
          }}
          disabled={isPending}
        >
          <Avatar className='text-sm flex items-center justify-center bg-sidebar size-6'>
            <AvatarImage src='/no-assignee.svg' className='size-5' />
          </Avatar>
          <p className='text-xs'>No assignee</p>
        </DropdownMenuItem>
        {members?.map((member) => (
          <DropdownMenuItem
            key={member.id}
            onClick={() => {
              handleAssignUser(member);
            }}
            className='cursor-pointer'
            disabled={isPending}
          >
            <Avatar className='flex items-center justify-center size-6'>
              <AvatarImage
                src={member.image_url || undefined}
                className='object-cover'
              />
              <AvatarFallback className='!text-xs'>
                {`${member.first_name} ${member.last_name}`
                  .split(' ')
                  .map((name) => name[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <p className='text-xs'>
              {member.first_name} {member.last_name}
            </p>
            {assignedTo?.id === member.id ? <Check className='size-4' /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
