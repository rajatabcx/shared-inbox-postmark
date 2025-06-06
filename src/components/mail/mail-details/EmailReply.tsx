'use client';
import { Reply, ReplyAll } from 'lucide-react';
import React from 'react';

import EmailReplyForm from './EmailReplyForm';
import { ButtonWithOptions } from '@/components/common/ButtonWithOptions';
import { parseAsBoolean, useQueryStates } from 'nuqs';

export function EmailReply({
  orgId,
  subject,
  replyTo,
  toEmail,
  references,
  inReplyTo,
  sharedInboxId,
  aliasEmail,
  parentEmailId,
  emailBody,
  emailFrom,
  emailTime,
}: {
  orgId: number;
  subject: string;
  replyTo: string | null;
  toEmail: string;
  references: string[];
  inReplyTo: string;
  sharedInboxId: number;
  aliasEmail: string;
  parentEmailId: number;
  emailBody: string;
  emailFrom: { email: string; name: string };
  emailTime: string;
}) {
  const [replying, setReplying] = useQueryStates(
    {
      all: parseAsBoolean.withDefault(false),
      to: parseAsBoolean.withDefault(false),
    },
    {
      history: 'push',
    }
  );
  return !replying.all && !replying.to ? (
    <ButtonWithOptions
      options={[
        {
          label: 'Reply',
          description: 'Reply to the email',
          icon: <Reply className='size-5' />,
          onClick: () => setReplying({ all: false, to: true }),
        },
        {
          label: 'Reply All',
          description: 'Reply to all the email',
          icon: <ReplyAll className='size-5' />,
          onClick: () => setReplying({ all: true, to: false }),
        },
      ]}
    />
  ) : (
    <EmailReplyForm
      orgId={orgId}
      subject={subject}
      replyTo={replyTo}
      toEmail={toEmail}
      replying={replying}
      setReplying={setReplying}
      references={references}
      inReplyTo={inReplyTo}
      sharedInboxId={sharedInboxId}
      aliasEmail={aliasEmail}
      parentEmailId={parentEmailId}
      emailBody={emailBody}
      emailFrom={emailFrom}
      emailTime={emailTime}
    />
  );
}
