'use client';
import React, { useEffect, useRef } from 'react';

export function EmailBodyIframe({ rawHtml }: { rawHtml: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get existing shadow root or create new one
    let shadowRoot = containerRef.current.shadowRoot;
    if (!shadowRoot) {
      shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
    }

    // Get computed styles from parent
    const computedStyle = window.getComputedStyle(document.documentElement);

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      :host {
        --theme-background: ${computedStyle.getPropertyValue(
          '--theme-background'
        )};
        --theme-text: ${computedStyle.getPropertyValue('--theme-text')};
      }

      .email-content {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        padding: 1rem;
        color: var(--theme-text, inherit);
        background: var(--theme-background, transparent);
      }

      /* Rest of your styles */
    `;

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mail-body text-sm';
    contentDiv.innerHTML = rawHtml;

    // Clear and update shadow DOM
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(styleSheet);
    shadowRoot.appendChild(contentDiv);
  }, [rawHtml]);

  return <div ref={containerRef} className='w-full overflow-y-hidden' />;
}
