import { notifications, toggleEmailSubscription } from '@/actions/notification';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const notificationList = await notifications();
      return notificationList;
    },
  });
};

export const notificationsPrefetch = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const notificationList = await notifications();
      return notificationList;
    },
  });
  return queryClient;
};

export const useToggleEmailSubscription = () => {
  return useMutation({
    mutationFn: async ({
      emailId,
      subscribe,
    }: {
      emailId: number;
      subscribe: boolean;
    }) => {
      const res = await toggleEmailSubscription({ emailId, subscribe });
      return res;
    },
  });
};
