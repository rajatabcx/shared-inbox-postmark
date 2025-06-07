import { saveEmail } from '@/actions/email';
import { EmailData } from '@/lib/types';
import { NextResponse } from 'next/server';

interface EmailAddress {
  Email: string;
  Name: string;
  MailboxHash: string;
}

interface EmailHeader {
  Name: string;
  Value: string;
}

interface EmailAttachment {
  Name: string;
  Content: string;
  ContentType: string;
  ContentLength: number;
  ContentID: string;
}

interface InboundEmail {
  From: string;
  MessageStream: string;
  FromName: string;
  FromFull: EmailAddress;
  To: string;
  ToFull: EmailAddress[];
  Cc: string;
  CcFull: EmailAddress[];
  Bcc: string;
  BccFull: EmailAddress[];
  OriginalRecipient: string;
  ReplyTo: string;
  Subject: string;
  MessageID: string;
  Date: string;
  MailboxHash: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;
  Tag: string;
  Headers: EmailHeader[];
  Attachments: EmailAttachment[];
}

function findValueFromNameInHeader(
  headers: EmailHeader[],
  name: string
): string {
  return headers.find((header) => header.Name === name)?.Value || '';
}

export async function POST(request: Request) {
  try {
    const emailData: InboundEmail = await request.json();

    const emailHeader = emailData.Headers;

    const messageId = findValueFromNameInHeader(emailHeader, 'Message-ID');

    const from = emailData.FromFull;
    const allTo = emailData.ToFull;
    const allCcs = emailData.CcFull;

    const subject = emailData.Subject || 'No Subject';

    const emailBodyText = emailData.TextBody || '';
    const emailBodyHtml = emailData.HtmlBody || '';
    const strippedTextReply = emailData.StrippedTextReply || '';

    const aliasEmail =
      allTo
        .find((to) => to.Email.includes(process.env.MY_DOMAIN!))
        ?.Email.split('@')[0] || '';

    const replyTo = emailData.ReplyTo || '';

    const referencesMailIds = findValueFromNameInHeader(
      emailHeader,
      'References'
    )
      .split(/\s+/)
      .filter(Boolean);

    const replyToMessageId = findValueFromNameInHeader(
      emailHeader,
      'In-Reply-To'
    );

    const spamStatus =
      findValueFromNameInHeader(emailHeader, 'X-Spam-Status') === 'Yes'
        ? true
        : false;

    console.log('aliasEmail', aliasEmail);

    if (!aliasEmail) {
      console.log('No alias email found');
      return NextResponse.json({
        success: false,
        message: 'No alias email found',
      });
    }

    const finalEmailData: EmailData = {
      messageId: messageId,
      subject: subject,
      bodyPlain: emailBodyText,
      bodyHtml: emailBodyHtml,
      strippedText: strippedTextReply || emailBodyText,
      aliasEmail,
      timestamp: new Date(emailData.Date).toISOString(),
      replyToEmail: replyTo,
      referencesMailIds,
      replyToMessageId,
      attachmentCount: emailData.Attachments.length,
      spamStatus,
      fromEmail: from.Email,
      fromName: from.Name,
      to: allTo.map((to) => ({ email: to.Email, name: to.Name })),
      ccs: allCcs.map((cc) => ({ email: cc.Email, name: cc.Name })),
      attachments: emailData.Attachments,
    };

    console.log('finalEmailData', finalEmailData);

    await saveEmail(finalEmailData);

    return NextResponse.json({ success: true, emailData });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    // Still return 200 to postmark to prevent retries
    return NextResponse.json({ success: false, error: err.message });
  }
}
