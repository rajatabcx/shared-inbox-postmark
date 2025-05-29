import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createInbox,
  deleteInbox,
  getInbox,
  listInboxes,
} from '@/actions/inbox';
import { inboxSchema } from '@/lib/validationSchema';
import { z } from 'zod';

export const useCreateInbox = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof inboxSchema>) => {
      const res = await createInbox(data);
      return res;
    },
  });

export const useDeleteInbox = () =>
  useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteInbox(id);
      return res;
    },
  });

export const useListInboxes = () =>
  useQuery({
    queryKey: ['inboxes'],
    queryFn: async () => {
      const res = await listInboxes();
      return res;
    },
  });

export const useInbox = (id: number) =>
  useQuery({
    queryKey: ['inbox', id],
    queryFn: async () => {
      const res = await getInbox(id);
      return res;
    },
  });
