import { Tooltip } from '@/components/ui/tooltip';
import { useIframeShowBlockquote } from '@/hooks/useIframeShowBlockquote';
import useInitIframeContent from '@/hooks/useInitFrameContent';
import useObserveIframeHeight from '@/hooks/useObserveIframeHeight';
import { getIframeSandboxAttributes } from '@/lib/iframeHelpers';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function EmailMessageIframe({
  iframeRef,
  content,
  blockquote,
  message,
  handleContentLoaded,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  content: string;
  blockquote: string;
  message: Element;
  handleContentLoaded: (iframeRootDivElement: HTMLDivElement) => void;
}) {
  const [showBlockQuoteState, setShowBlockQuoteState] = useState(!!blockquote);
  const { initStatus, iframeRootDivRef } = useInitIframeContent({
    iframeRef,
    message,
    content,
    onContentLoaded: handleContentLoaded,
  });

  const { showToggle, iframeToggleDiv, showBlockquote, setShowBlockquote } =
    useIframeShowBlockquote({
      blockquoteContent: blockquote,
      iframeRef,
      initStatus,
      showBlockquoteProp: showBlockQuoteState,
      showBlockquoteToggle: true,
      onBlockquoteToggle: () => {
        setShowBlockQuoteState((prev) => !prev);
      },
    });

  useObserveIframeHeight(initStatus === 'done', iframeRef);

  return (
    <>
      <iframe
        title='Email content'
        src='about:blank'
        scrolling='yes'
        frameBorder='0'
        ref={iframeRef}
        className={cn([initStatus !== 'start' ? 'w-full' : 'w-0 h-0'])}
        sandbox={getIframeSandboxAttributes()}
        allowFullScreen={false}
        translate='yes'
      />
      {/* {initStatus !== 'start' && (
        <MessageBodyImages
          iframeRef={iframeRef}
          isPrint={isPrint}
          messageImages={message.messageImages}
          localID={message.localID}
          useProxy={!!mailSettings.ImageProxy}
        />
      )} */}
      {showToggle &&
        iframeToggleDiv &&
        !!blockquote &&
        createPortal(
          <Tooltip relativeReference={iframeRef}>
            <button
              type='button'
              className='proton-toggle-button'
              onClick={() => {
                setShowBlockquote(!showBlockquote);
              }}
              data-testid='message-view:expand-codeblock'
            >
              <MoreHorizontal className='m-auto size-4' />
              <span className='proton-sr-only'>
                {showBlockquote
                  ? `Hide original message`
                  : `Show original message`}
              </span>
            </button>
          </Tooltip>,
          iframeToggleDiv
        )}
    </>
  );
}
