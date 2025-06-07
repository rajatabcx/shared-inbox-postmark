'use server';

import {
  ActionResponse,
  EmailStatus,
  NotificationType,
  ResponseType,
  UserNotificationType,
} from '@/lib/types';
import { postmarkClient } from './postmark';
import { getEMailSubscribers } from './notification';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { currentUser } from './user';

export const simpleSendEmail = async ({
  html,
  from,
  to,
  subject,
}: {
  html: string;
  from: string;
  to: string;
  subject: string;
}) => {
  try {
    const res = await postmarkClient().sendEmail({
      From: from,
      To: to,
      Subject: subject,
      HtmlBody: html,
    });

    return {
      type: ResponseType.SUCCESS,
      message: res.Message,
    };
  } catch (err: any) {
    console.log(
      JSON.stringify(
        {
          From: from,
          To: to,
          Subject: subject,
          HtmlBody: html,
        },
        null,
        2
      )
    );
    return {
      type: ResponseType.ERROR,
      message: err.Message,
    };
  }
};

export const sendEmail = async ({
  html,
  from,
  to,
  subject,
  cc,
  bcc,
  attachments,
  replyTo,
  references,
  sharedInboxId,
  aliasEmail,
  text,
  archive,
  parentEmailId,
  strippedText,
}: {
  html: string;
  text: string;
  from: string;
  to: string[];
  subject: string;
  cc: string[];
  bcc: string[];
  attachments?: {
    filename: string;
    content: string;
  }[];
  replyTo: string;
  references: string[];
  sharedInboxId: number;
  aliasEmail: string;
  archive: boolean;
  parentEmailId: number;
  strippedText: string;
}): Promise<ActionResponse> => {
  from = 'Rajat Mondal <rajat.abcx@gmail.com>';
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }
    const res = await postmarkClient().sendEmail({
      From: from,
      To: to.join(','),
      Subject: subject,
      HtmlBody: html,
      TextBody: text,
      Cc: cc.join(','),
      Bcc: bcc.join(','),
      ReplyTo: replyTo,
      MessageStream: 'outbound',
      Headers: [
        {
          Name: 'References',
          Value: references.join(' '),
        },
      ],
    });
    if (res.ErrorCode) {
      throw new Error(res.Message);
    }
    console.log(JSON.stringify(res, null, 2));

    // store it in emails table
    const supabase = await createSupabaseServerClient();
    const { data: emailData, error: emailError } = await supabase
      .from('emails')
      .insert({
        from_email: from,
        to_emails: to,
        subject,
        stripped_text: strippedText,
        body_html: html,
        body_text: text,
        reply_to_mail_id: replyTo,
        references_mail_ids: references,
        is_reply: true,
        send_at: new Date().toISOString(),
        shared_inbox_id: sharedInboxId,
        alias_email: aliasEmail,
        mail_id: res.MessageID,
        cc_emails: cc,
        list_text: strippedText,
      })
      .select('id')
      .single();

    if (emailError) {
      return {
        type: ResponseType.ERROR,
        message: emailError.message,
      };
    }

    // Update parent email
    await supabase
      .from('emails')
      .update({
        replied: true,
        is_archived: archive,
        status: EmailStatus.DONE,
        assignee_id: user.profileId,
      })
      .eq('id', parentEmailId);

    // create email reference connection
    const { data: allReferenceEmailIds, error: referenceError } = await supabase
      .from('emails')
      .select('id')
      .in('mail_id', references);

    if (allReferenceEmailIds?.length) {
      await supabase.from('email_references').insert(
        allReferenceEmailIds.map((email) => ({
          email_id: emailData.id,
          referenced_email_id: email.id,
        }))
      );
    }

    // create activity
    await supabase.from('email_activity_logs').insert({
      email_id: parentEmailId,
      type: NotificationType.REPLY_SENT,
      created_at: new Date().toISOString(),
      user_profile_id: user.profileId,
      metadata: {
        referenced_email_id: emailData.id,
      },
    });

    // user notification
    const emailSubscribers = await getEMailSubscribers(parentEmailId);

    await supabase.from('notifications').insert(
      emailSubscribers.map((subscriber) => ({
        email_id: parentEmailId,
        notification_for: subscriber,
        event_type: UserNotificationType.REPLIED,
        metadata: {
          reply_email_id: emailData.id,
        },
        action_by: user.profileId,
      }))
    );

    return {
      type: ResponseType.SUCCESS,
      message: 'Email sent successfully',
    };
  } catch (error: any) {
    console.error('Failed to send email');
    console.error(error);
    return {
      type: ResponseType.ERROR,
      message: error.message,
    };
  }
};
