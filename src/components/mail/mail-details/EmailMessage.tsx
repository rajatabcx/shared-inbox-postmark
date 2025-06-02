import { locateBlockquote } from '@/lib/blockqoute';
import { prepareHtml } from '@/lib/emailHtmlSanitize';
import { preparePlainText } from '@/lib/emailStringSanitize';
import { isHtml } from '@/lib/utils';
import React, { useMemo } from 'react';

export function EmailMessage({ message }: { message: string }) {
  const plain = !isHtml(message);

  if (plain) {
    const modifiedMessage = preparePlainText(message);
    return (
      <div className='mail-body text-sm whitespace-pre-wrap'>
        <p dangerouslySetInnerHTML={{ __html: modifiedMessage }}></p>
      </div>
    );
  }

  const modifiedMessage = prepareHtml(message);

  const [content, blockquote] = useMemo(
    () => locateBlockquote(modifiedMessage),
    [modifiedMessage.innerHTML]
  );

  console.log(content);

  return (
    <div className='mail-body text-sm'>
      This is main content <br />
      {content.toString()}
      <br />
      <br />
      And this is block quote
      <br />
      {blockquote.toString()}
    </div>
  );
}
