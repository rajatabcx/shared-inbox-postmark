'use server';

import { ResponseType } from '@/lib/types';
import { postmarkClient } from './postmark';

export const simpleSendEmail = async ({
  html,
  from,
  to,
  subject,
}: {
  html: string;
  from: string;
  to: string;
  subject: string;
}) => {
  const res = await postmarkClient().sendEmail({
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: html,
  });
  if (res.ErrorCode) {
    return {
      type: ResponseType.ERROR,
      message: res.Message,
    };
  }
  return {
    type: ResponseType.SUCCESS,
    message: res.Message,
  };
};
