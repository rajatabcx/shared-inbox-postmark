export function emailBodyHasLinks(rawHtml: string): boolean {
  const hasAnchorTags = /<a\b[^>]*\shref\s*=/i.test(rawHtml);

  return hasAnchorTags;
}
