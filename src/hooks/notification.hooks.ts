import { notifications } from '@/actions/notification';
import { QueryClient, useQuery } from '@tanstack/react-query';

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
