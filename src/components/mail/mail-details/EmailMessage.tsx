import { locateBlockquote } from '@/lib/blockqoute';
import { prepareHtml } from '@/lib/emailHtmlSanitize';
import { preparePlainText } from '@/lib/emailStringSanitize';
import { isHtml } from '@/lib/utils';
import React, { useMemo, useRef, useState } from 'react';
import { EmailMessageIframe } from './EmailMessageIframe';

export function EmailMessage({
  message,
  attachments,
}: {
  message: string;
  attachments: {
    attachment_path: string;
    cid: string;
    original_name: string;
    signed_url: string | null;
  }[];
}) {
  const plain = !isHtml(message);

  if (plain) {
    return <EmailMessagePlainText message={message} />;
  }

  return <EmailMessageHtml message={message} attachments={attachments} />;
}

function EmailMessagePlainText({ message }: { message: string }) {
  const modifiedMessage = preparePlainText(message);
  return (
    <div className='mail-body text-sm whitespace-pre-wrap'>
      <p dangerouslySetInnerHTML={{ __html: modifiedMessage }}></p>
    </div>
  );
}

function EmailMessageHtml({
  message,
  attachments,
}: {
  message: string;
  attachments: {
    attachment_path: string;
    cid: string;
    original_name: string;
    signed_url: string | null;
  }[];
}) {
  const [_isIframeContentSet, setIsIframeContentSet] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modifiedMessage = prepareHtml(message, attachments);
  const [content, blockquote] = useMemo(
    () => locateBlockquote(modifiedMessage),
    [modifiedMessage]
  );

  return (
    <div ref={bodyRef} className='mail-body text-sm'>
      <div className='message-iframe'>
        <EmailMessageIframe
          iframeRef={iframeRef}
          content={content}
          blockquote={blockquote}
          message={modifiedMessage}
          handleContentLoaded={(iframeRootDivElement: HTMLDivElement) =>
            setIsIframeContentSet(true)
          }
        />
      </div>
    </div>
  );
}
