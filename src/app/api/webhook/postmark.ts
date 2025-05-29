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

export async function POST(request: Request) {
  const emailData = await request.json();

  const headers = request.headers;

  console.log(headers);
  console.log(emailData);

  return NextResponse.json({ success: true, emailData });
}
