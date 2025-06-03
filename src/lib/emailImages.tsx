export const insertImageAnchor = (cid: string, match: HTMLElement): string => {
  const anchor = document.createElement('span');
  anchor.classList.add('replyas-image-anchor');
  anchor.setAttribute(`data-cid`, cid);
  match.parentElement?.replaceChild(anchor, match);
  return cid;
};

export const getAnchor = (
  document: Element | null | undefined,
  cid: string
) => {
  if (!document) {
    return null;
  }

  return document.querySelector(
    `.replyas-image-anchor[data-cid="${cid}"]`
  ) as HTMLElement | null;
};
