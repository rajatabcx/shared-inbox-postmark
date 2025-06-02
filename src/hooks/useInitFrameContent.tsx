import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import {
  MESSAGE_IFRAME_ROOT_ID,
  MESSAGE_IFRAME_TOGGLE_ID,
  MESSAGE_IFRAME_BLOCKQUOTE_ID,
} from '@/lib/const';
import { getIframeHtml } from '@/lib/iframeHelpers';
import useIsMounted from './useIsMounted';

interface Props {
  content: string;
  message: Element;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  onContentLoaded: (iframeRootDivElement: HTMLDivElement) => void;
}

const useInitIframeContent = ({
  iframeRef,
  message,
  content,
  onContentLoaded,
}: Props) => {
  const [initStatus, setInitStatus] = useState<'start' | 'done'>('start');
  const hasBeenDone = useRef<boolean>(false);
  const iframeRootDivRef = useRef<HTMLDivElement>(null);
  const prevContentRef = useRef<string>(content);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (initStatus === 'start') {
      let emailContent = content;

      emailContent += `<div id='${MESSAGE_IFRAME_TOGGLE_ID}'></div><div id='${MESSAGE_IFRAME_BLOCKQUOTE_ID}'></div>`;

      const doc = iframeRef.current?.contentDocument;
      const iframeContent = getIframeHtml({
        emailContent,
        messageDocument: message,
      });
      doc?.open();
      doc?.write(iframeContent);
      doc?.close();

      const iframeRootDivElement = doc?.getElementById(
        MESSAGE_IFRAME_ROOT_ID
      ) as HTMLDivElement;
      iframeRootDivRef.current = iframeRootDivElement;

      setInitStatus('done');
      return;
    }

    if (
      initStatus === 'done' &&
      onContentLoaded &&
      hasBeenDone.current === false
    ) {
      const doc = iframeRef.current?.contentDocument;
      const iframeRootDivElement = doc?.getElementById(
        MESSAGE_IFRAME_ROOT_ID
      ) as HTMLDivElement;

      hasBeenDone.current = true;

      if (isMounted()) {
        onContentLoaded(iframeRootDivElement);
      }
    }
  }, [initStatus]);

  /**
   * On content change, rerun the process to set content inside the iframe
   */
  useEffect(() => {
    if (initStatus === 'done' && prevContentRef.current !== content) {
      setInitStatus('start');
      prevContentRef.current = content;
    }
  }, [content, initStatus]);

  /**
   * On message change, rerun the process to set content too
   */
  useEffect(() => {
    if (initStatus === 'done') {
      setInitStatus('start');
    }
  }, [message]);

  return { initStatus, iframeRootDivRef };
};

export default useInitIframeContent;
