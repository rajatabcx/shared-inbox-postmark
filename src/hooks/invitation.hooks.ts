import { useMutation, useQuery } from '@tanstack/react-query';
import {
  inviteUser,
  joinOrganization,
  pendingInvitations,
} from '@/actions/invitation';
import { inviteSchema, joinSchema } from '@/lib/validationSchema';
import { z } from 'zod';

export const useInviteUser = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof inviteSchema>) => {
      const res = await inviteUser(data);
      return res;
    },
  });

export const useJoinOrganization = () =>
  useMutation({
    mutationFn: async ({
      invitationId,
      data,
    }: {
      invitationId: number;
      data: z.infer<typeof joinSchema>;
    }) => {
      const res = await joinOrganization({
        formData: data,
        invitationId: invitationId,
      });
      return res;
    },
  });

export const usePendingInvitations = () =>
  useQuery({
    queryKey: ['pendingInvitations'],
    queryFn: async () => {
      const res = await pendingInvitations();
      return res;
    },
  });
