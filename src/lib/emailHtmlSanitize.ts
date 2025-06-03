import type { Config } from 'dompurify';
import DOMPurify from 'dompurify';

const matches = (element: Element, selector: string) =>
  (element.matches || (element as any).msMatchesSelector).call(
    element,
    selector
  );

const config: Config = {
  ADD_ATTR: [
    'target',
    'rel',
    'data-src',
    'src',
    'srcset',
    'background',
    'poster',
    'xlink:href',
    'href',
  ],
  WHOLE_DOCUMENT: true,
  RETURN_DOM: true,
  USE_PROFILES: { html: true },
};

const clean = () => {
  return (input: string | Node): string | Element => {
    DOMPurify.clearConfig();
    const value = DOMPurify.sanitize(input, config) as string | Element;
    DOMPurify.removeAllHooks();
    return value;
  };
};

const purifyHTML = (input: string): Element => {
  const process = clean();
  return process(input) as Element;
};

const removeHTMLComments = (str: string) => {
  return str.replace(/<!--[\s\S]*?-->/g, '');
};

const transformEscape = (content = '') => {
  const withoutComments = removeHTMLComments(content);
  const document = purifyHTML(withoutComments);
  return document;
};

const PROTOCOLS = ['ftp://', 'http://', 'https://', 'xmpp:', 'tel:', 'callto:'];
const ALL_PROTOCOLS = PROTOCOLS.concat(['mailto:']);
const MAP = PROTOCOLS.reduce<{ [key: string]: boolean }>((acc, key) => {
  acc[key] = true;
  return acc;
}, {});

const getNormalizedHref = (link: HTMLLinkElement) => {
  return (link.getAttribute('href') || '').trim().toLowerCase();
};

const linkUsesProtocols = (link: HTMLLinkElement) =>
  ALL_PROTOCOLS.some((proto) => getNormalizedHref(link).startsWith(proto));

const EXCLUDE_ANCHORS = ':not([href=""]):not([href^="#"])';

const isEmptyAnchor = (link: HTMLLinkElement) => {
  const href = getNormalizedHref(link);
  return href === '' || MAP[href];
};

const noReferrerInfo = (link: HTMLLinkElement) => {
  link.setAttribute('rel', 'noreferrer nofollow noopener');
};

const disableAnchors = (link: HTMLLinkElement) => {
  if (isEmptyAnchor(link)) {
    link.style.pointerEvents = 'none';
  }
};

const sanitizeRelativeHttpLinks = (link: HTMLLinkElement) => {
  if (
    matches(link, EXCLUDE_ANCHORS) &&
    !linkUsesProtocols(link) &&
    link.nodeName === 'A'
  ) {
    const url = link.getAttribute('href');

    if (url) {
      link.setAttribute('href', `http://${url}`);
    }
  }
};

const httpInNewTab = (link: HTMLLinkElement) => {
  if (matches(link, EXCLUDE_ANCHORS)) {
    const href = link.getAttribute('href') || '';
    const hasHTTP = href.indexOf('http') === 0;
    const isRelative = href.indexOf('/') === 0;
    // Prevent issue for Edge/IE A security problem cf https://jsfiddle.net/dpaoxoks/7/
    if (hasHTTP || isRelative) {
      link.setAttribute('target', '_blank');
    }
  }
};

const transformLinks = (document: Element) => {
  const links = [...document.querySelectorAll('[href]')] as HTMLLinkElement[];

  links.forEach((link) => {
    httpInNewTab(link);
    noReferrerInfo(link);

    sanitizeRelativeHttpLinks(link);
    disableAnchors(link);
  });
};

const transformAnchors = (inputDocument: Element) => {
  // Search for all anchors with an id and no href
  inputDocument.querySelectorAll('a[id]:not([href])').forEach((anchor) => {
    // Check if the anchor has an anchor child
    const hasChildAnchors = anchor.querySelectorAll('a[href]').length > 0;

    // If found, then we want to replace the anchor with a span
    if (hasChildAnchors) {
      const span = document.createElement('span');

      for (let attr of anchor.attributes) {
        span.setAttribute(attr.name, attr.value);
      }

      span.innerHTML = anchor.innerHTML;

      anchor.replaceWith(span);
    }
  });
};

const replaceAbsolutePositionOnFirstElement = (document: Element) => {
  const firstElement = document.firstElementChild as HTMLElement | null;

  if (firstElement && /absolute/.test(firstElement.style.position)) {
    firstElement.style.position = 'inherit';
  }

  const styleTags = document.querySelectorAll('style');
  const fixedPositionRegex = /position[\s\:]fixed/gim;

  styleTags.forEach((styleTag) => {
    const styleContent = styleTag.textContent;
    if (styleContent && fixedPositionRegex.test(styleContent)) {
      styleTag.textContent = styleContent.replace(
        fixedPositionRegex,
        'position: inherit !important;'
      );
    }
  });
};

const replaceFixedPositionWithInherit = (document: Element) => {
  const styleTags = document.querySelectorAll('style');
  const fixedPositionRegex = /position[\s]*\:[\s]*fixed/gim;

  styleTags.forEach((styleTag) => {
    const styleContent = styleTag.textContent;

    if (styleContent && fixedPositionRegex.test(styleContent)) {
      styleTag.textContent = styleContent.replaceAll(
        fixedPositionRegex,
        'position: inherit !important'
      );
    }
  });
};

const transformStylesheet = (document: Element) => {
  replaceAbsolutePositionOnFirstElement(document);
  replaceFixedPositionWithInherit(document);
};

const isHTMLElement = (element: Element): element is HTMLElement =>
  'style' in element;

const replaceViewportHeightUnit = (element: HTMLElement) => {
  const height = element.style.height;
  if (!height) {
    return;
  }

  if (height.includes('vh')) {
    element.style.height = 'auto';
  }
};

const handleTopLeftPropertiesRemoval = ({
  left,
  top,
}: Record<'top' | 'left', string>): Map<string, string> => {
  const result = new Map();
  if (left) {
    result.set('left', 'unset');
  }
  if (top) {
    result.set('top', 'unset');
  }
  return result;
};

const replaceLeftTopProperties = (element: HTMLElement) => {
  const left = element.style.left;
  const top = element.style.top;

  if (left) {
    const width = element.style.width;
    const height = element.style.height;

    if (width === '1px' && height === '1px') {
      element.style.width = 'auto';
      element.style.height = 'auto';
    }
  }

  const results = handleTopLeftPropertiesRemoval({ top, left });

  results.forEach((value, property) => {
    // @ts-expect-error
    element.style[property] = value;
  });
};

const startsByANegativeSign = (string: string) => {
  return /^\s*-\d+(\.\d+)?/.test(string);
};

const handleNegativeMarginRemoval = ({
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  marginInlineStart,
  marginInlineEnd,
  marginBlockStart,
  marginBlockEnd,
}: Record<
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'marginBottom'
  | 'marginInlineStart'
  | 'marginInlineEnd'
  | 'marginBlockStart'
  | 'marginBlockEnd',
  string
>): Map<string, string> => {
  const result = new Map();
  if (marginLeft && startsByANegativeSign(marginLeft)) {
    result.set('marginLeft', 'unset');
  }
  if (marginRight && startsByANegativeSign(marginRight)) {
    result.set('marginRight', 'unset');
  }
  if (marginTop && startsByANegativeSign(marginTop)) {
    result.set('marginTop', 'unset');
  }
  if (marginBottom && startsByANegativeSign(marginBottom)) {
    result.set('marginBottom', 'unset');
  }
  if (marginInlineStart && startsByANegativeSign(marginInlineStart)) {
    result.set('marginInlineStart', 'unset');
  }
  if (marginInlineEnd && startsByANegativeSign(marginInlineEnd)) {
    result.set('marginInlineEnd', 'unset');
  }
  if (marginBlockStart && startsByANegativeSign(marginBlockStart)) {
    result.set('marginBlockStart', 'unset');
  }
  if (marginBlockEnd && startsByANegativeSign(marginBlockEnd)) {
    result.set('marginBlockEnd', 'unset');
  }
  return result;
};

const removeNegativeMargins = (element: HTMLElement) => {
  const marginLeft = element.style.marginLeft;
  const marginRight = element.style.marginRight;
  const marginTop = element.style.marginTop;
  const marginBottom = element.style.marginBottom;
  const marginInlineStart = element.style.marginInlineStart;
  const marginInlineEnd = element.style.marginInlineEnd;
  const marginBlockStart = element.style.marginBlockStart;
  const marginBlockEnd = element.style.marginBlockEnd;

  const results = handleNegativeMarginRemoval({
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    marginInlineStart,
    marginInlineEnd,
    marginBlockStart,
    marginBlockEnd,
  });

  results.forEach((value, property) => {
    // @ts-expect-error // we send valid properties
    element.style[property] = value;
  });
};

const transformStyleAttributes = (document: Element) => {
  const nodesWithStyleAttribute = document.querySelectorAll('[style]');

  for (const element of nodesWithStyleAttribute) {
    if (!isHTMLElement(element)) {
      continue;
    }

    replaceViewportHeightUnit(element);

    replaceLeftTopProperties(element);

    removeNegativeMargins(element);
  }
};

export const prepareHtml = (
  content = '',
  attachments: { attachment_path: string; cid: string; original_name: string }[]
) => {
  const document = transformEscape(content);
  transformLinks(document);
  transformAnchors(document);
  transformStylesheet(document);
  transformStyleAttributes(document);
  return document;
};
