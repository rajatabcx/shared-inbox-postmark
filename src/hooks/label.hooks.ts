import {
  createLabel,
  deleteLabel,
  labels,
  toggleEmailLabel,
  updateLabel,
} from '@/actions/label';
import { labelSchema } from '@/lib/validationSchema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const useCreateLabel = () => {
  return useMutation({
    mutationFn: async (label: z.infer<typeof labelSchema>) => {
      const res = await createLabel(label);
      return res;
    },
  });
};

export const useUpdateLabel = () => {
  return useMutation({
    mutationFn: async ({
      label,
      id,
    }: {
      label: z.infer<typeof labelSchema>;
      id: number;
    }) => {
      const res = await updateLabel({ label, id });
      return res;
    },
  });
};

export const useLabels = () => {
  return useQuery({
    queryKey: ['labels'],
    queryFn: async () => {
      const res = await labels();
      return res;
    },
  });
};

export const useDeleteLabel = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteLabel(id);
      return res;
    },
  });
};

export const useToggleEmailLabel = () => {
  return useMutation({
    mutationFn: async ({
      emailId,
      labelId,
    }: {
      emailId: number;
      labelId: number;
    }) => {
      const res = await toggleEmailLabel({ emailId, labelId });
      return res;
    },
  });
};
