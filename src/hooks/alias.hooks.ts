import { useMutation, useQuery } from '@tanstack/react-query';
import { addAlias, deleteAlias, emailAliasList } from '@/actions/alias';

export const useEmailAliasList = () => {
  return useQuery({
    queryKey: ['emailAliasList'],
    queryFn: async () => {
      const res = await emailAliasList();
      return res;
    },
  });
};

export const useAddAlias = () => {
  return useMutation({
    mutationFn: async (alias: {
      domainId: number;
      address: string;
      displayName?: string;
    }) => {
      const res = await addAlias({
        domainId: alias.domainId,
        address: alias.address,
        displayName: alias.displayName,
      });
      return res;
    },
  });
};

export const useDeleteAlias = () => {
  return useMutation({
    mutationFn: async (aliasId: number) => {
      const res = await deleteAlias(aliasId);
      return res;
    },
  });
};
