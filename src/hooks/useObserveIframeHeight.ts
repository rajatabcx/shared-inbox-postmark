import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import useIsMounted from './useIsMounted';

import { MESSAGE_IFRAME_ROOT_ID } from '@/lib/const';

const ALLOWED_PX_INTERVAL = 10;

/**
 * Observe dom content changes and width changes in order to set content
 *
 * @param startObserving
 * @param iframeRef
 * @param imagesLoaded
 */
const useObserveIframeHeight = (
  startObserving: boolean,
  iframeRef: RefObject<HTMLIFrameElement | null>
) => {
  const isMountedCallback = useIsMounted();
  const prevHeightRef = useRef<number>(0);

  const setIframeHeight = useCallback(() => {
    if (!isMountedCallback() || !iframeRef || !iframeRef.current) {
      return;
    }

    // TODO: fix this, throwing error
    const emailContentRoot =
      iframeRef.current?.contentWindow?.document.getElementById(
        MESSAGE_IFRAME_ROOT_ID
      );
    const prevHeight = prevHeightRef.current;
    const height = emailContentRoot?.scrollHeight;

    if (!emailContentRoot || height === undefined) {
      return;
    }

    const heightIsOutOfBoudaries =
      height &&
      (height > prevHeight + ALLOWED_PX_INTERVAL ||
        height < prevHeight - ALLOWED_PX_INTERVAL);

    if (heightIsOutOfBoudaries) {
      prevHeightRef.current = height;
      iframeRef.current.style.height = `${height}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!startObserving) {
      return;
    }

    // We're ready set some height
    setIframeHeight();

    // TODO: fix this, throwing error
    const iframeRootDiv =
      iframeRef.current?.contentWindow?.document.getElementById(
        MESSAGE_IFRAME_ROOT_ID
      ) as HTMLDivElement;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        setIframeHeight();
      });
    });

    // Only checks iframe root div widths changes (window resize or inner resize when column mailbox layout is set)
    resizeObserver.observe(iframeRootDiv);

    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startObserving]);
};

export default useObserveIframeHeight;
