import { useMutation } from '@tanstack/react-query';
import { addInternalComment } from '@/actions/chat';

export const useAddInternalComment = () => {
  return useMutation({
    mutationFn: async (data: {
      comment: string;
      mailId: number;
      mentions: number[];
    }) => {
      const response = await addInternalComment(data);
      return response;
    },
  });
};
