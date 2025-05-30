import { organizationMembers } from '@/actions/organization';
import { useQuery } from '@tanstack/react-query';

export const useOrganizationMembers = () => {
  return useQuery({
    queryKey: ['organizationMembers'],
    queryFn: async () => {
      const members = await organizationMembers();
      return members;
    },
  });
};
