'use client';
import React from 'react';
import { useNotifications } from '@/hooks/notification.hooks';
import { format, formatDistanceToNow } from 'date-fns';
import { UserNotificationType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/user.hooks';
import { AtSign, MessageSquare, UserPlus, UserMinus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationList() {
  const { data, isLoading } = useNotifications();
  const { data: currentUser } = useCurrentUser();

  return isLoading ? (
    <div className='flex flex-col gap-4'>
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className='w-full h-20' />
      ))}
    </div>
  ) : (
    <div className='space-y-4'>
      {data?.map((notification) => {
        const actionByUser = notification.action_by;
        const actionByFullName = `${actionByUser.first_name} ${actionByUser.last_name}`;
        const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
          addSuffix: true,
        });

        const renderMessage = () => {
          switch (notification.event_type) {
            case UserNotificationType.ASSIGNED:
              return {
                text: `${actionByFullName} assigned you to an email`,
                icon: <UserPlus className='w-4 h-4' />,
                suffix: (
                  <div className='text-sm text-muted-foreground'>
                    {notification.emails.subject}
                  </div>
                ),
              };
            case UserNotificationType.UNASSIGNED:
              return {
                text: `${actionByFullName} unassigned you from an email`,
                icon: <UserMinus className='w-4 h-4' />,
                suffix: (
                  <div className='text-sm text-muted-foreground'>
                    {notification.emails.subject}
                  </div>
                ),
              };
            case UserNotificationType.MENTIONED:
              return {
                text: `${actionByFullName} mentioned you in a comment`,
                icon: <AtSign className='w-4 h-4' />,
                suffix: (
                  <div className='text-sm text-muted-foreground'>
                    {notification.chat?.message}
                  </div>
                ),
              };
            case UserNotificationType.REPLIED:
              return {
                text: `${actionByFullName} replied to an email`,
                icon: <MessageSquare className='w-4 h-4' />,
                suffix: (
                  <div className='text-sm text-muted-foreground'>
                    {notification.emails.subject}
                  </div>
                ),
              };
            default:
              return { text: `${actionByFullName} did something` };
          }
        };

        const { text, icon, suffix } = renderMessage();

        return (
          <div
            key={notification.id}
            className='flex items-start space-x-3 text-xs text-muted-foreground p-4 bg-sidebar rounded-md'
          >
            <Avatar className='size-8'>
              <AvatarImage
                src={actionByUser.image_url || undefined}
                className='object-cover'
              />
              <AvatarFallback className='text-xs'>
                {actionByFullName
                  .split(' ')
                  .map((name) => name[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='flex items-center self-center'>
              <div className='flex items-center gap-2'>
                {icon} {text}
                {suffix}
              </div>
              <span className='text-muted-foreground h-4 w-3 flex items-center justify-center'>
                ·
              </span>
              <Tooltip>
                <TooltipTrigger className='text-muted-foreground'>
                  {format(new Date(notification.created_at), 'MMM d')}
                </TooltipTrigger>
                <TooltipContent>{timeAgo}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
}
