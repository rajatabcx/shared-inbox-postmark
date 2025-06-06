'use client';
import React from 'react';
import { AssignUser } from '@/components/mail/features/AssignUser';
import { EmailStatus } from '@/components/mail/features/EmailStatus';
import {
  EmailDetail,
  EmailStatus as EmailStatusEnum,
  Member,
} from '@/lib/types';
import { Label } from '@/components/mail/label/Label';

export default function EmailHeader({
  emailData,
  orgMembers,
}: {
  emailData: EmailDetail;
  orgMembers: Member[];
}) {
  return (
    <div className='p-6 pb-0 max-w-[800px] w-full flex justify-between items-start gap-2'>
      <div className='flex flex-wrap gap-2 items-center'>
        <h1 className='text-2xl font-bold'>{emailData.subject}</h1>
        <div className='flex items-center gap-1 flex-wrap'>
          {emailData.email_labels.map(({ label }) => (
            <Label key={label.id} color={label.color} name={label.name} />
          ))}
        </div>
      </div>
      <div className='flex gap-2 w-[156px] justify-end'>
        <AssignUser
          assignedTo={
            emailData.assignee
              ? {
                  name: `${emailData.assignee.first_name} ${emailData.assignee.last_name}`,
                  id: emailData.assignee.id || 0,
                  imageUrl: emailData.assignee.image_url,
                }
              : undefined
          }
          emailId={emailData.id}
          members={orgMembers}
          // className='size-8'
        />
        <EmailStatus
          currentStatus={emailData.status as EmailStatusEnum}
          emailId={emailData.id}
        />
      </div>
    </div>
  );
}
