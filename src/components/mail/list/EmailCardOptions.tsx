'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Archive,
  Copy,
  Flag,
  MoreHorizontal,
  FlagOff,
  Mail,
  MailOpen,
  Bell,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useServerAction } from '@/hooks/useServerAction';
import {
  toggleEmailArchive,
  toggleEmailReadStatus,
  toggleEmailSpam,
} from '@/actions/email';
import { toastHelper } from '@/lib/toastHelper';
import { ResponseType } from '@/lib/types';
import { toggleEmailSubscription } from '@/actions/notification';

export function EmailCardOptions({
  archived,
  emailId,
  inboxId,
  isSpam,
  isRead,
  setIsRead,
  setArchived,
  setIsSpam,
  isSubscribed,
}: {
  archived: boolean;
  emailId: number;
  inboxId: number;
  isSpam: boolean;
  isRead: boolean;
  isSubscribed: boolean;
  setIsRead: Dispatch<SetStateAction<boolean>>;
  setArchived: Dispatch<SetStateAction<boolean>>;
  setIsSpam: Dispatch<SetStateAction<boolean>>;
}) {
  const [isSubscribedState, setIsSubscribedState] = useState(isSubscribed);
  const { mutateAsync, isPending } = useServerAction(toggleEmailArchive);
  const { mutateAsync: mutateSpam, isPending: isSpamPending } =
    useServerAction(toggleEmailSpam);

  const { mutateAsync: mutateRead, isPending: isReadPending } = useServerAction(
    toggleEmailReadStatus
  );
  const { mutateAsync: mutateSubscribe, isPending: isSubscribePending } =
    useServerAction(toggleEmailSubscription);
  const handleArchive = async () => {
    setArchived(!archived);
    const res = await mutateAsync({ emailId, archive: !archived });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setArchived(!archived);
    }
  };
  const handleSpam = async () => {
    setIsSpam(!isSpam);
    const res = await mutateSpam({ emailId, spam: !isSpam });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setIsSpam(!isSpam);
    }
  };
  const handleRead = async () => {
    setIsRead(!isRead);
    const res = await mutateRead({ emailId, status: !isRead });
    if (res?.type === ResponseType.ERROR) {
      setIsRead(!isRead);
    }
    toastHelper(res);
  };
  const handleSubscribe = async () => {
    setIsSubscribedState(!isSubscribedState);
    const res = await mutateSubscribe({
      emailId,
      subscribe: !isSubscribedState,
    });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setIsSubscribedState(!isSubscribedState);
    }
  };

  useEffect(() => {
    setIsSubscribedState(isSubscribed);
  }, [isSubscribed]);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='size-8 rounded-full flex-shrink-0 focus-visible:ring-0'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem
          className='text-sm cursor-pointer'
          disabled={isSubscribePending}
          onClick={handleSubscribe}
        >
          {isSubscribedState ? (
            <Bell className='mr-2 h-4 w-4 text-muted-foreground fill-muted-foreground' />
          ) : (
            <Bell className='mr-2 h-4 w-4' />
          )}
          <span>{isSubscribedState ? 'Unfollow' : 'Follow along'}</span>
        </DropdownMenuItem>
        {isSpam ? null : (
          <DropdownMenuItem
            onClick={handleArchive}
            className='text-sm cursor-pointer'
            disabled={isPending}
          >
            <Archive className='mr-2 h-4 w-4' />
            <span>{archived ? 'Unarchive' : 'Archive'}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className='text-sm cursor-pointer'
          onClick={handleRead}
          disabled={isReadPending}
        >
          {isRead ? (
            <Mail className='mr-2 h-4 w-4' />
          ) : (
            <MailOpen className='mr-2 h-4 w-4' />
          )}
          <span>{isRead ? 'Mark as unread' : 'Mark as read'}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='text-sm cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/inbox/${inboxId}/email/${emailId}`
            );
            toast.success('Link copied to clipboard');
          }}
        >
          <Copy className='mr-2 h-4 w-4' />
          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-sm cursor-pointer'
          onClick={handleSpam}
          disabled={isSpamPending}
        >
          {isSpam ? (
            <FlagOff className='mr-2 h-4 w-4' />
          ) : (
            <Flag className='mr-2 h-4 w-4' />
          )}
          <span>{isSpam ? 'Unspam' : 'Spam'}</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem className='text-sm cursor-pointer text-destructive hover:text-destructive!'>
          <Trash2 className='mr-2 h-4 w-4 text-destructive' />
          <span>Delete</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
