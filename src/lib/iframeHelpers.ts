import { UAParser } from 'ua-parser-js';
import { MESSAGE_IFRAME_ROOT_ID } from './const';
import { cssStyles } from './emailStyles';

export const locateHead = (
  inputDocument: Element | Document | undefined
): string | undefined => {
  if (!inputDocument) {
    return undefined;
  }

  const head = inputDocument.querySelector('head');

  return head?.innerHTML;
};

const uaParser = new UAParser();
const ua = uaParser.getResult();
export const isDuckDuckGo = () => ua.browser.name === 'DuckDuckGo';
export const isSafari = () =>
  ua.browser.name === 'Safari' || ua.browser.name === 'Mobile Safari';

export const getIframeSandboxAttributes = () => {
  const sandboxAttributes: string = [
    'allow-same-origin',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    ...(isSafari() || isDuckDuckGo() ? ['allow-scripts'] : []),
  ].join(' ');

  return sandboxAttributes;
};

export const getIframeHtml = ({
  emailContent,
  messageDocument,
}: {
  emailContent: string;
  messageDocument: Element;
}) => {
  const messageHead = locateHead(messageDocument) || '';
  const bodyStyles = messageDocument
    ?.querySelector('body')
    ?.getAttribute('style');
  const bodyClasses = messageDocument
    ?.querySelector('body')
    ?.getAttribute('class');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width">
        <style>${cssStyles}</style>
        ${messageHead}
      </head>
      <body>
      <div id="${MESSAGE_IFRAME_ROOT_ID}">
        <div style="display: block !important; width: 100% !important;">
        <div style="width: 100% !important;padding-bottom:10px;!important">
          ${
            bodyStyles || bodyClasses
              ? `<div class="${bodyClasses}" style="${bodyStyles}">`
              : ''
          }
          ${emailContent}
          ${bodyStyles || bodyClasses ? '</div>' : ''}
        </div>
        </div>
      </div>
      </body>
    </html>
  `;
};
