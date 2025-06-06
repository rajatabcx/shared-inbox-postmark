'use client';

import {
  Archive,
  Bell,
  BellOff,
  Bookmark,
  Copy,
  EyeOff,
  Flag,
  MoreHorizontal,
  ReplyAll,
  Star,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { parseAsBoolean } from 'nuqs';
import { useQueryStates } from 'nuqs';
import { LabelPicker } from '../label/LabelPicker';
import { toast } from 'sonner';
import { EmailDetail, ResponseType } from '@/lib/types';
import { toastHelper } from '@/lib/toastHelper';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/user.hooks';
import { useState } from 'react';
import {
  useToggleEmailArchive,
  useToggleEmailBookmark,
  useToggleEmailReadStatus,
  useToggleEmailSpam,
} from '@/hooks/email.hooks';
import { useToggleEmailStar } from '@/hooks/email.hooks';
import { useToggleEmailSubscription } from '@/hooks/notification.hooks';
import { routes } from '@/lib/routeHelpers';

export function FloatingActionBar({
  emailData,
  inboxId,
}: {
  emailData: EmailDetail;
  inboxId: number;
}) {
  const [emailStar, setEmailStar] = useState(emailData.is_starred);
  const [emailBookmark, setEmailBookmark] = useState(
    emailData.user_email_status.is_bookmarked
  );
  const [emailSubscribe, setEmailSubscribe] = useState(
    emailData.user_email_status.is_subscribed
  );
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const [_replying, setReplying] = useQueryStates(
    {
      all: parseAsBoolean.withDefault(false),
      to: parseAsBoolean.withDefault(false),
    },
    {
      history: 'push',
    }
  );

  const { mutateAsync: executeStar, isPending: isStarring } =
    useToggleEmailStar();
  const { mutateAsync: executeArchive, isPending: isArchiving } =
    useToggleEmailArchive();
  const { mutateAsync: executeToggleSpam, isPending: isTogglingSpam } =
    useToggleEmailSpam();
  const {
    mutateAsync: executeToggleSubscribe,
    isPending: isTogglingSubscribe,
  } = useToggleEmailSubscription();
  const {
    mutateAsync: executeToggleReadStatus,
    isPending: isTogglingReadStatus,
  } = useToggleEmailReadStatus();
  const { mutateAsync: executeToggleBookmark, isPending: isTogglingBookmark } =
    useToggleEmailBookmark();

  const handleStar = async () => {
    setEmailStar((prev) => !prev);
    const res = await executeStar({
      emailId: emailData.id,
      star: !emailStar,
    });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setEmailStar(emailData.is_starred);
    }
  };

  const handleArchive = async () => {
    const res = await executeArchive({
      emailId: emailData.id,
      archive: !emailData.is_archived,
    });
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      router.replace(routes.dashboard.inbox.details(`${inboxId}`));
    }
  };

  const handleMarkAsSpam = async () => {
    const res = await executeToggleSpam({
      emailId: emailData.id,
      spam: !emailData.is_spam,
    });
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      router.replace(routes.dashboard.inbox.details(`${inboxId}`));
    }
  };

  const handleMarkAsUnRead = async () => {
    const res = await executeToggleReadStatus({
      emailId: emailData.id,
      status: false,
    });
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      router.back();
    }
  };

  const handleSubscribe = async () => {
    setEmailSubscribe((prev) => !prev);
    const res = await executeToggleSubscribe({
      emailId: emailData.id,
      subscribe: !emailSubscribe,
    });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setEmailSubscribe(emailData.user_email_status.is_subscribed);
    }
  };

  const handleBookmark = async () => {
    setEmailBookmark((prev) => !prev);
    const res = await executeToggleBookmark({
      emailId: emailData.id,
      bookmark: !emailBookmark,
    });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setEmailBookmark(emailData.user_email_status.is_bookmarked);
    }
  };

  return (
    <div
      className={cn(
        'sticky top-4 z-[49] w-fit rounded-lg border bg-secondary p-1',
        'mb-4'
      )}
    >
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleStar}
          disabled={isStarring}
        >
          {emailStar ? (
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          ) : (
            <Star className='h-4 w-4' />
          )}
          <span className='text-sm'>
            {emailStar ? 'Remove star' : 'Add star'}
          </span>
        </Button>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            setReplying({ all: true });
            setTimeout(() => {
              window.scrollTo({
                top: document.body.scrollHeight - 115,
                behavior: 'smooth',
              });
            }, 100);
          }}
        >
          <ReplyAll className='h-4 w-4' />
          <span className='text-sm'>Reply All</span>
        </Button>
        <LabelPicker
          selectedLabels={emailData.email_labels.map(({ label }) => label.id)}
          emailId={Number(emailData.id)}
        />

        <Button
          variant='ghost'
          size='sm'
          onClick={handleArchive}
          disabled={isArchiving}
        >
          <Archive className='h-4 w-4' />
          <span className='text-sm'>
            {emailData.is_archived ? 'Unarchive' : 'Archive'}
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' sideOffset={10}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleMarkAsUnRead}
                disabled={isTogglingReadStatus}
              >
                <EyeOff className='mr-2 h-4 w-4' />
                Mark as unread
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleBookmark}
                disabled={isTogglingBookmark}
              >
                <Bookmark
                  className={cn(
                    'mr-2 h-4 w-4',
                    emailBookmark ? 'fill-primary text-primary' : ''
                  )}
                />
                Bookmark
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleSubscribe}
                disabled={
                  isTogglingSubscribe ||
                  isUserLoading ||
                  (emailData.assignee?.id === user?.profileId && emailSubscribe)
                }
              >
                {emailSubscribe ? (
                  <>
                    <BellOff className='mr-2 h-4 w-4 text-muted-foreground fill-muted-foreground' />
                    Unfollow
                  </>
                ) : (
                  <>
                    <Bell className='mr-2 h-4 w-4' />
                    Follow along
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/inbox/${inboxId}/email/${emailData.id}`
                  );
                  toast.success('Link copied to clipboard');
                }}
              >
                <Copy className='mr-2 h-4 w-4' />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleMarkAsSpam}
                disabled={isTogglingSpam}
              >
                <Flag className='mr-2 h-4 w-4' />
                Mark as spam
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className='mr-2 h-4 w-4' />
                See all from {emailData.from_name || emailData.from_email}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
