import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addDomain,
  deleteDomain,
  domainDetails,
  domainList,
  verifyDomain,
} from '@/actions/domain';
import { addAlias } from '@/actions/alias';

export const useAddDomain = () => {
  return useMutation({
    mutationFn: async (domain: string) => {
      const res = await addDomain(domain);
      return res;
    },
  });
};

export const useVerifyDomain = () => {
  return useMutation({
    mutationFn: async (domainId: number) => {
      const res = await verifyDomain(domainId);
      return res;
    },
  });
};

export const useDomainList = () => {
  return useQuery({
    queryKey: ['domainList'],
    queryFn: async () => {
      const res = await domainList();
      return res;
    },
  });
};

export const useDomainDetails = (domainId: number) => {
  return useQuery({
    queryKey: ['domainDetails', domainId],
    queryFn: async () => {
      const res = await domainDetails(domainId);
      return res;
    },
  });
};

export const useDeleteDomain = () => {
  return useMutation({
    mutationFn: async (domainId: number) => {
      const res = await deleteDomain(domainId);
      return res;
    },
  });
};
