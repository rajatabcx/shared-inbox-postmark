'use client';

import { ChevronDownSquare, ChevronUpSquare, Paperclip } from 'lucide-react';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmailDetail } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmailBodyIframe } from './EmailBodyIframe';
import { EmailAttachments } from './EmailAttachments';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MailOptions } from './MailOptions';

export function EmailBody({ emailData }: { emailData: EmailDetail }) {
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [shrinkCard, setShrinkCard] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const avatarInitials = useMemo(() => {
    const words = (emailData.from_name || emailData.from_email!)
      .trim()
      .split(' ')
      .filter((word) => word.length > 0);
    if (words.length === 0) return 'NA';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return 'NA';
  }, [emailData.from_name, emailData.from_email]);

  return shrinkCard ? (
    <Card>
      <CardHeader
        onClick={() => setShrinkCard((prev) => !prev)}
        className='flex items-center gap-4 cursor-pointer select-none'
      >
        <Avatar className='h-12 w-12'>
          <AvatarFallback className='bg-primary/10'>
            {avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 min-w-0 space-y-1 text-xs'>
          {/* Email Details */}
          <p className='font-medium'>
            <span className='text-muted-foreground'>From:</span>
            &nbsp;&nbsp;{emailData.from_email}
          </p>
          <p className='text-muted-foreground truncate'>
            {emailData.stripped_text}
          </p>
        </div>
        <div>
          {emailData.send_at ? (
            <p className='text-muted-foreground text-xs'>
              {format(emailData.send_at, 'MMM d')}
            </p>
          ) : null}
        </div>
      </CardHeader>
    </Card>
  ) : (
    <Card>
      <CardHeader
        onClick={() => setShrinkCard((prev) => !prev)}
        className='flex items-center gap-4 border-b border-dashed cursor-pointer select-none'
      >
        <Avatar className='h-12 w-12'>
          <AvatarFallback className='bg-primary/10'>
            {avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 min-w-0 space-y-1 text-xs'>
          {/* Email Details */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground'>From:</span>
              <span className='font-medium'>{emailData.from_email}</span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground'>To:</span>
            <span>{emailData.to_emails?.join(', ').replaceAll(`"`, '')}</span>
            <Button
              size='icon'
              variant='ghost'
              className='p-0 size-4'
              onClick={(e) => {
                e.stopPropagation();
                setDetailsOpened((prev) => !prev);
              }}
            >
              {detailsOpened ? (
                <ChevronUpSquare className='size-4' />
              ) : (
                <ChevronDownSquare className='size-4' />
              )}
            </Button>
          </div>

          {emailData.cc_emails && emailData.cc_emails.length > 0 && (
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground'>CC:</span>
              <span>{emailData.cc_emails.join(', ')}</span>
            </div>
          )}

          {emailData.reply_to && (
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground'>Reply-To:</span>
              <span>{emailData.reply_to}</span>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {emailData.attachments > 0 ? (
            <Tooltip>
              <TooltipTrigger className='cursor-pointer'>
                <Paperclip className='size-4 text-muted-foreground' />
              </TooltipTrigger>
              <TooltipContent>
                <p>{emailData.attachments} Attachments</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
          {emailData.send_at ? (
            <p className='text-muted-foreground text-xs'>
              {format(emailData.send_at, 'MMM d')}
            </p>
          ) : null}
          <MailOptions
            detailsOpened={detailsOpened}
            setDetailsOpened={setDetailsOpened}
          />
        </div>
      </CardHeader>
      {detailsOpened ? (
        <CardContent className='border-b border-dashed pb-6 grid grid-cols-[min-content_1fr] text-xs gap-2'>
          <p className='text-muted-foreground'>From:</p>
          <p>{emailData.from_email}</p>
          <p className='text-muted-foreground'>To:</p>
          <p>{emailData.to_emails?.join(', ').replaceAll(`"`, '')}</p>
          <p className='text-muted-foreground'>Date:</p>
          <p>{format(emailData.send_at!, 'MMM d, yyyy hh:mm a')}</p>
          <p className='text-muted-foreground'>Subject:</p>
          <p>{emailData.subject}</p>
        </CardContent>
      ) : null}
      <CardContent className='text-sm break-all overflow-x-auto'>
        {emailData.body_plain}
      </CardContent>
      {/* <CardContent className='text-sm break-all overflow-x-auto'>
        {emailData.stripped_html ? (
          emailBodyHasLinks(emailData.stripped_html) ? (
            <EmailBodyIframe rawHtml={emailData.stripped_html} />
          ) : (
            <div className={cn('mail-body text-sm whitespace-pre-wrap')}>
              <Linkify options={linkifyOptions}>
                {emailData.stripped_text}
              </Linkify>
            </div>
          )
        ) : (
          ''
        )}

        {emailData.email_attachments.length > 0 && (
          <div className='mt-4'>
            <div className='flex flex-wrap gap-2'>
              {emailData.email_attachments.map((attachment) => (
                <EmailAttachments
                  key={attachment.cid}
                  attachment={attachment}
                />
              ))}
            </div>
          </div>
        )}

        {emailData.references_mail_ids &&
        emailData.references_mail_ids.length > 0 ? (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setShowReply(!showReply)}
            className='!h-4 !w-7 bg-background rounded-full hover:bg-background/90 mt-4'
          >
            <Ellipsis className='size-4' />
          </Button>
        ) : null}
        <div
          className={cn(
            'mail-body-reply text-sm whitespace-pre-wrap',
            !showReply ? 'hidden' : 'block'
          )}
          dangerouslySetInnerHTML={{
            __html: emailData.body_html || '',
          }}
        />
      </CardContent> */}
    </Card>
  );
}
