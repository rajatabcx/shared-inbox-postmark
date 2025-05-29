import { useMutation, useQuery } from '@tanstack/react-query';
import {
  currentUser,
  updateUserOnboarding,
  updateUserProfile,
  userOrganization,
} from '@/actions/user';
import { profileSchema } from '@/lib/validationSchema';
import { z } from 'zod';

export const useUserOrganization = () =>
  useQuery({
    queryKey: ['userOrganization'],
    queryFn: async () => {
      const res = await userOrganization();
      return res;
    },
  });

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await currentUser();
      return res;
    },
  });

export const useCompleteOnboarding = () =>
  useMutation({
    mutationFn: async () => {
      const res = await updateUserOnboarding();
      return res;
    },
  });

export const useUpdateUserProfile = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const res = await updateUserProfile(data);
      return res;
    },
  });
