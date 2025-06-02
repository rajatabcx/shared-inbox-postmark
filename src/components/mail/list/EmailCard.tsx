import {
  EmailListItem,
  EmailStatus as EmailStatusEnum,
  EmailView,
  EmailViewType,
  Member,
} from '@/lib/types';
import Link from 'next/link';
import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { AlertOctagon, Archive, Plus, Reply } from 'lucide-react';
import { EmailStatus } from '@/components/mail/features/EmailStatus';
import { StarEmail } from '@/components/mail/features/StarEmail';
import { AssignUser } from '@/components/mail/features/AssignUser';
import { Label } from '@/components/mail/label/Label';
import { BookmarkEmail } from '@/components/mail/features/BookmarkEmail';
import { EmailCardOptions } from '@/components/mail/list/EmailCardOptions';

export function EmailCard({
  email,
  inboxId,
  members,
}: {
  email: EmailListItem;
  inboxId: number;
  members: Member[];
}) {
  console.log('EmailCard rendering');
  const [archived, setArchived] = useState(email.is_archived);
  const [isSpam, setIsSpam] = useState(email.is_spam);
  const [isRead, setIsRead] = useState(email.user_email_status.is_read);

  useEffect(() => {
    setIsRead(email.user_email_status.is_read);
  }, [email.user_email_status]);

  return (
    <div
      key={email.id}
      className={cn(
        'border-b border-muted px-4 py-3 transition-colors outline-border flex gap-2 items-baseline w-full @container/email-card'
      )}
    >
      <div className='flex justify-between gap-2 flex-1'>
        <div className='flex-shrink-0 mt-[2px]'>
          <EmailStatus
            currentStatus={
              (email.status || EmailStatusEnum.TODO) as EmailStatusEnum
            }
            emailId={email.id}
            showStatusText={false}
            side='right'
            align='start'
          />
        </div>
        <Link
          prefetch={false}
          href={`/dashboard/inbox/${inboxId}/email/${email.id}`}
          className={cn(
            'text-sm font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-36 text-left',
            isRead && 'opacity-50'
          )}
        >
          {email.from_name || email.from_email}
          {email.reference_count > 0 ? ` (${email.reference_count + 1})` : null}
        </Link>
        <div className='flex gap-1 flex-shrink-0'>
          {email.replied ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant='outline'
                  className='h-5 px-1.5 border-emerald-800 bg-emerald-950/30'
                >
                  <Reply className='w-3 h-3 text-emerald-400' />
                  <span className='text-xs text-emerald-300 sr-only'>
                    Replied
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>You&apos;ve replied to this email</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          {archived ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant='outline'
                  className='h-5 px-1.5 border-blue-900 bg-blue-950/30'
                >
                  <Archive className='w-3 h-3 text-blue-400' />
                  <span className='text-xs text-blue-300 sr-only'>
                    Archived
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This email is archived</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          {isSpam ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant='outline'
                  className='h-5 px-1.5 border-red-900 bg-red-950/30'
                >
                  <AlertOctagon className='w-3 h-3 text-red-400' />
                  <span className='text-xs text-red-300 sr-only'>Spam</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This email is marked as spam</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <Link
          prefetch={false}
          href={`/dashboard/inbox/${inboxId}/email/${email.id}`}
          className='flex flex-col gap-1 flex-1 min-w-0'
        >
          <div className='flex items-center gap-2'>
            <p
              className={cn(
                'text-sm font-medium text-muted-foreground line-clamp-1',
                isRead && 'opacity-50'
              )}
            >
              {email.subject}
            </p>
            {email.email_labels.length > 0 && (
              <div className='flex items-center relative'>
                {/* Show first two labels with overlap */}
                {email.email_labels.slice(0, 2).map(({ label }, index) => (
                  <div
                    key={label.id}
                    className={cn(
                      'relative z-10 hover:z-30',
                      index === 1 && '-ml-10'
                    )}
                  >
                    <Label color={label.color} name={label.name} />
                  </div>
                ))}

                {/* Show count if there are more than 2 labels */}
                {email.email_labels.length > 2 && (
                  <div className='-ml-2 relative z-20 hover:z-30'>
                    <Badge className='text-black bg-white text-xs'>
                      <Plus className='size-4' />
                      {email.email_labels.length - 2}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
          <p
            className={cn(
              'flex text-xs text-muted-foreground flex-1 line-clamp-1',
              isRead && 'opacity-50'
            )}
          >
            {`${email.stripped_text
              ?.slice(0, 160)
              .replaceAll('\n', ' ')
              .replace(/[^a-zA-Z0-9\s]/g, ' ')}`}
          </p>
        </Link>
        <div className='flex w-[180px] items-center justify-end'>
          {email.send_at ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className='text-xs text-muted-foreground text-ellipsis whitespace-nowrap overflow-hidden mr-1'>
                  {format(email.send_at, 'MMM d')}
                </p>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>
                  {format(new Date(email.send_at), 'MMM d, yyyy hh:mm a')} (
                  {formatDistanceToNow(email.send_at, { addSuffix: true })})
                </p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          {/* {view === EmailView.SPAM || view === EmailView.ARCHIVED ? null : (
            <StarEmail isStarred={email.is_starred} emailId={email.id} />
          )} */}
          <BookmarkEmail
            emailId={email.id}
            bookmarked={email.user_email_status.is_bookmarked}
          />
          <AssignUser
            emailId={email.id}
            assignedTo={
              email.assignee
                ? {
                    name: `${email.assignee.first_name} ${email.assignee.last_name}`,
                    id: email.assignee?.id || 0,
                    imageUrl: email.assignee?.image_url,
                  }
                : undefined
            }
            members={members}
          />
          <EmailCardOptions
            isSubscribed={email.user_email_status.is_subscribed}
            archived={email.is_archived}
            isSpam={email.is_spam}
            emailId={email.id}
            inboxId={inboxId}
            isRead={isRead}
            setIsRead={setIsRead}
            setArchived={setArchived}
            setIsSpam={setIsSpam}
          />
        </div>
      </div>
    </div>
  );
}
