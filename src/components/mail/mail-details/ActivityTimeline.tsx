'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Activity, NotificationType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Archive,
  ArchiveX,
  Bell,
  BellOff,
  Star,
  StarOff,
  Tag,
} from 'lucide-react';
import StatusIcon from '../features/StatusIcon';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Label } from '../label/Label';
import { Chat } from '../chat/Chat';
import { EmailReplyCard } from './EmailReplyCard';
import { useCurrentUser } from '@/hooks/user.hooks';

const EmailActivityTimeline = ({ activities }: { activities: Activity[] }) => {
  const { data: currentUser } = useCurrentUser();
  return (
    <div className='space-y-4'>
      {activities?.map((activity) => {
        const user = activity.user;
        const fullName =
          currentUser?.profileId === user?.id
            ? 'You'
            : `${user?.first_name} ${user?.last_name}`;
        const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
          addSuffix: true,
        });

        const renderMessage = () => {
          switch (activity.type) {
            case NotificationType.ADD_TAG:
              return {
                text: `${fullName} added tag`,
                icon: <Tag className='w-4 h-4' />,
                suffix: (
                  <Label
                    name={activity.metadata.tag_name}
                    color={activity.metadata.tag_color}
                  />
                ),
              };
            case NotificationType.REMOVE_TAG:
              return {
                text: `${fullName} removed tag`,
                icon: <Tag className='w-4 h-4' />,
                suffix: (
                  <Label
                    name={activity.metadata.tag_name}
                    color={activity.metadata.tag_color}
                  />
                ),
              };
            case NotificationType.ADD_CHAT:
              return {
                suffix: <Chat chatData={activity.metadata} />,
              };
            case NotificationType.ASSIGNED_TO:
              return {
                text:
                  activity.metadata.assignee_id === activity.user?.id
                    ? `${fullName} self assigned this email`
                    : `${fullName} assigned this email to ${activity.metadata.assignee_name}`,
              };
            case NotificationType.REMOVE_ASSIGNEE:
              return {
                text: `${fullName} removed assignee`,
              };
            case NotificationType.STATUS_UPDATE:
              return {
                text: `${fullName} changed status from ${activity.metadata.old_status} to ${activity.metadata.new_status}`,
                icon: <StatusIcon status={activity.metadata.new_status} />,
              };
            case NotificationType.STARRED:
              return {
                text: `${fullName} starred this email`,
                icon: (
                  <Star className='w-4 h-4 fill-yellow-500 text-yellow-500' />
                ),
              };
            case NotificationType.UN_STARRED:
              return {
                text: `${fullName} unstarred this email`,
                icon: <StarOff className='w-4 h-4' />,
              };
            case NotificationType.ARCHIVED:
              return {
                text: `${fullName} archived this email`,
                icon: <Archive className='w-4 h-4' />,
              };
            case NotificationType.UN_ARCHIVED:
              return {
                text: `${fullName} unarchived this email`,
                icon: <ArchiveX className='w-4 h-4' />,
              };
            case NotificationType.SUBSCRIBED:
              return {
                text: `${fullName} started following`,
                icon: <Bell className='w-4 h-4' />,
              };
            case NotificationType.UNSUBSCRIBED:
              return {
                text: `${fullName} stopped following`,
                icon: <BellOff className='w-4 h-4' />,
              };
            default:
              return { text: `${fullName} did something` };
          }
        };

        const { text, icon, suffix } = renderMessage();

        return activity.type === NotificationType.REPLY_RECEIVED ||
          activity.type === NotificationType.REPLY_SENT ? (
          <EmailReplyCard
            emailData={activity.metadata}
            key={activity.metadata.id}
          />
        ) : (
          <div
            key={activity.id}
            className='flex items-start space-x-3 text-xs text-muted-foreground'
          >
            <Avatar className='size-8'>
              <AvatarImage
                src={user?.image_url || ''}
                className='object-cover'
              />
              <AvatarFallback className='text-xs'>
                {`${user?.first_name} ${user?.last_name}`
                  .split(' ')
                  .map((name) => name[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className='flex items-center self-center'>
              <div className='flex items-center gap-2'>
                {icon} {text ? <p>{text}</p> : null}
                {suffix}
              </div>
              {activity.type !== NotificationType.ADD_CHAT ? (
                <span className='text-muted-foreground h-4 w-3 flex items-center justify-center'>
                  ·
                </span>
              ) : null}
              {activity.type === NotificationType.ADD_CHAT ? null : (
                <Tooltip>
                  <TooltipTrigger className='text-muted-foreground'>
                    {format(new Date(activity.created_at), 'MMM d')}
                  </TooltipTrigger>
                  <TooltipContent>{timeAgo}</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EmailActivityTimeline;
