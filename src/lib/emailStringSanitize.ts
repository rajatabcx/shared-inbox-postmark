import LinkifyIt from 'linkify-it';

export const CUSTOM_DOMAINS = ['cloud', 'team'];

const linkifyInstance = new LinkifyIt();

linkifyInstance.tlds(CUSTOM_DOMAINS, true);

const htmlEntities = (str = '') => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const transformLinkify = ({
  content = '',
  target = '_blank',
  rel = 'noreferrer nofollow noopener',
}: {
  content: string;
  target?: string;
  rel?: string;
}) => {
  const matches = linkifyInstance.match(content);

  if (!matches) {
    return htmlEntities(content);
  }

  let last = 0;
  const result = matches.reduce<string[]>((result: any, match: any) => {
    if (last < match.index) {
      result.push(htmlEntities(content.slice(last, match.index)));
    }
    result.push(`<a target="${target}" rel="${rel}" href="`);

    result.push(match.url);

    result.push('">');
    result.push(match.text);
    result.push('</a>');

    last = match.lastIndex;

    return result;
  }, []);

  if (last < content.length) {
    result.push(htmlEntities(content.slice(last)));
  }

  return result.join('');
};

export const preparePlainText = (content = '') => {
  return transformLinkify({ content });
};
