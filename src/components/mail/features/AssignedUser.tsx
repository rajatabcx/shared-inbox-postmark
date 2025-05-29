'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function AssignedUser({
  assignedTo,
  imageUrl,
  className,
}: {
  assignedTo?: string;
  imageUrl?: string | null;
  className?: string;
}) {
  return (
    <Avatar
      className={cn(
        'text-sm flex items-center justify-center bg-sidebar size-6',
        className
      )}
    >
      <AvatarImage
        src={assignedTo ? imageUrl || undefined : '/no-assignee.svg'}
        className={cn('object-cover', assignedTo ? '' : 'size-5')}
      />
      <AvatarFallback className='text-xs'>
        {assignedTo
          ?.split(' ')
          .map((name) => name[0])
          .join('')}
      </AvatarFallback>
    </Avatar>
  );
}
