import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'isomorphic-dompurify';
import { purifyHTML } from './emailHtmlSanitize';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isHtml = (content = '') => {
  const trimmed = content.trim();

  const htmlPattern = /<\/?[a-z][\s\S]*>/i;

  return htmlPattern.test(trimmed);
};

export const modifyChatHtml = (html: string) => {
  const cleanHtml = purifyHTML(html);

  const spans = cleanHtml.querySelectorAll('span[data-user-id]');
  spans.forEach((span) => {
    span.removeAttribute('data-id');
  });

  return cleanHtml.innerHTML;
};

export const wrapHtmlWithQuote = (
  html: string,
  emailFrom: { email: string; name: string },
  emailTime: string
) => {
  // Format the date and time
  const formattedDate = format(new Date(emailTime), 'MMM d, yyyy');
  const formattedTime = format(new Date(emailTime), 'h:mm a');

  // Create the attribution text
  const attribution = `On ${formattedDate} at ${formattedTime} ${
    emailFrom.name ? `${emailFrom.name} <` : ''
  }<a class="text-primary !no-underline font-medium" href="mailto:${
    emailFrom.email
  }">${emailFrom.email}</a>${emailFrom.name ? '>' : ''} wrote:`;
  console.log(attribution);

  // Return the complete HTML structure as a string
  return `<div class="replyas-quote">
  <br/>
  <div class="replyas-quote-attr">${attribution}</div>
  <blockquote class="replyas-quote-body">${html}</blockquote>
</div>`;
};

export const handleStrippedText = (html: string) => {
  const cleanHtml = purifyHTML(html);
  // cleanhtm

  return cleanHtml.textContent || '';
};
