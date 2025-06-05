'use client';

import React, { useEffect } from 'react';
import { EmailBody } from './EmailBody';
import { InternalChat } from '../../chat/InternalChat';
import EmailActivityTimeline from './ActivityTimeline';
import { FloatingActionBar } from './FloatingActionBar';
import { EmailReply } from './EmailReply';
import EmailHeader from './EmailHeader';
import { useEmailDetails } from '@/hooks/email.hooks';
import { useOrganizationMembers } from '@/hooks/organization.hooks';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function EmailPage({
  emailId,
  inboxId,
}: {
  emailId: number;
  inboxId: number;
}) {
  const { data: emailData } = useEmailDetails(emailId);

  const { data: orgMembers, isLoading } = useOrganizationMembers();

  const queryClient = useQueryClient();

  const handleUpdate = (updatedEmailId: number) => {
    if (updatedEmailId === emailId) {
      queryClient.invalidateQueries({
        queryKey: ['emailDetails', emailId],
      });
    }
  };

  const supabase = createSupabaseClient();
  useEffect(() => {
    const activityChannel = supabase
      .channel(`emailActivity:${emailId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'email_activity_logs',
        },
        (payload: any) => {
          const emailId = payload.new.email_id as number;
          handleUpdate(emailId);
        }
      )
      .subscribe();

    const emailChannel = supabase
      .channel(`email:${emailId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
        },
        (payload: any) => {
          const emailId = payload.new.id as number;
          handleUpdate(emailId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(emailChannel);
    };
  }, [supabase, emailId]);

  return !emailData?.email ? (
    <div className='flex h-full items-center justify-center'>
      <div className='text-center'>
        <h3 className='text-lg font-medium'>Email not found</h3>
        <p className='text-sm text-muted-foreground'>
          The email you&apos;re looking for doesn&apos;t exist or you don&apos;t
          have permission to view it
        </p>
      </div>
    </div>
  ) : (
    <div className='flex flex-col h-full items-center'>
      <FloatingActionBar emailData={emailData.email} inboxId={inboxId} />
      <EmailHeader emailData={emailData.email} orgMembers={orgMembers || []} />

      {/* Email Body */}
      <div className='p-6 flex-1 overflow-auto max-w-[800px] w-full'>
        <EmailBody emailData={emailData.email} />
        <div className='email-activity relative z-50 pt-5 mb-4 space-y-4'>
          <EmailActivityTimeline activities={emailData.activities} />
          <EmailReply
            orgId={emailData.email.organization_id!}
            subject={
              emailData.email.updatedSubject ||
              (!emailData.email.subject.toLowerCase().includes('re:')
                ? `Re: ${emailData.email.subject}`
                : emailData.email.subject)
            }
            replyTo={emailData.email.reply_to}
            toEmail={emailData.email.from_email!}
            references={emailData.email.replyData.references || []}
            inReplyTo={emailData.email.replyData.replyTo || ''}
            sharedInboxId={emailData.email.shared_inbox_id!}
            aliasEmail={emailData.email.alias_email!}
            parentEmailId={emailData.email.id}
          />
        </div>
      </div>

      {isLoading ? null : (
        <div className='border-t p-4 w-full max-w-[800px]'>
          <InternalChat
            emailId={Number(emailData.email.id)}
            orgMembers={orgMembers || []}
          />
        </div>
      )}
    </div>
  );
}
