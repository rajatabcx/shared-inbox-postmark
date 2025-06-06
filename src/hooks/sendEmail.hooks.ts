import { useMutation } from '@tanstack/react-query';
import { sendEmail, simpleSendEmail } from '@/actions/sendEmail';

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async (data: {
      html: string;
      text: string;
      from: string;
      to: string[];
      subject: string;
      cc: string[];
      bcc: string[];
      attachments?: {
        filename: string;
        content: string;
      }[];
      replyTo: string;
      references: string[];
      sharedInboxId: number;
      aliasEmail: string;
      archive: boolean;
      parentEmailId: number;
      strippedText: string;
    }) => {
      const response = await sendEmail(data);
      return response;
    },
  });
};

export const useSimpleSendEmail = () => {
  return useMutation({
    mutationFn: async (data: {
      html: string;
      from: string;
      to: string;
      subject: string;
    }) => {
      const response = await simpleSendEmail(data);
      return response;
    },
  });
};
