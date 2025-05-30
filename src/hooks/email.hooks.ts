import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import {
  emailList,
  myEmailList,
  toggleEmailArchive,
  toggleEmailSpam,
  toggleEmailStar,
  updateEmailAssignee,
  updateEmailStatus,
  toggleEmailReadStatus,
  bookmarkedEmailList,
} from '@/actions/email';
import { toggleEmailBookmark } from '@/actions/notification';
import { EmailStatus, EmailViewType } from '@/lib/types';

export const useToggleEmailArchive = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      archive,
    }: {
      emailId: number;
      archive: boolean;
    }) => {
      const res = await toggleEmailArchive({ emailId, archive });
      return res;
    },
  });

export const useToggleEmailReadStatus = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      status,
    }: {
      emailId: number;
      status: boolean;
    }) => {
      const res = await toggleEmailReadStatus({ emailId, status });
      return res;
    },
  });

export const useToggleEmailBookmark = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      bookmark,
    }: {
      emailId: number;
      bookmark: boolean;
    }) => {
      const res = await toggleEmailBookmark({ emailId, bookmark });
      return res;
    },
  });

export const useUpdateEmailAssignee = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      assigneeId,
    }: {
      emailId: number;
      assigneeId?: number;
    }) => {
      const res = await updateEmailAssignee({
        emailId,
        assigneeId: assigneeId,
      });
      return res;
    },
  });

export const useUpdateEmailStatus = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      status,
      oldStatus,
    }: {
      emailId: number;
      status: EmailStatus;
      oldStatus: EmailStatus;
    }) => {
      const res = await updateEmailStatus({ emailId, status, oldStatus });
      return res;
    },
  });

export const useToggleEmailStar = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      star,
    }: {
      emailId: number;
      star: boolean;
    }) => {
      const res = await toggleEmailStar({ emailId, star });
      return res;
    },
  });

export const useToggleEmailSpam = () =>
  useMutation({
    mutationFn: async ({
      emailId,
      spam,
    }: {
      emailId: number;
      spam: boolean;
    }) => {
      const res = await toggleEmailSpam({ emailId, spam });
      return res;
    },
  });

export const useEmailList = (
  inboxId: number,
  view: EmailViewType,
  search: string,
  page: number
) =>
  useQuery({
    queryKey: ['emailList', inboxId, view, search, page],
    queryFn: async () => {
      const emails = await emailList({
        inboxId,
        view,
        page,
        search,
      });
      return emails;
    },
    staleTime: 0,
  });

export const useMyEmailList = (search: string, page: number) =>
  useQuery({
    queryKey: ['myEmailList', search, page],
    queryFn: async () => {
      const emails = await myEmailList({
        page,
        search,
      });
      return emails;
    },
  });

export const emailListPrefetch = async ({
  inboxId,
  page,
  search,
  view,
}: {
  inboxId: number;
  view: EmailViewType;
  search: string;
  page: number;
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['emailList', inboxId, view, search, page],
    queryFn: async () => {
      const emails = await emailList({
        inboxId,
        view,
        page,
        search,
      });
      return emails;
    },
  });
  return queryClient;
};

export const myEmailListPrefetch = async ({
  page,
  search,
}: {
  search: string;
  page: number;
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['myEmailList', search, page],
    queryFn: async () => {
      const emails = await myEmailList({
        page,
        search,
      });
      return emails;
    },
  });
  return queryClient;
};

export const useBookmarkedEmailList = (search: string, page: number) =>
  useQuery({
    queryKey: ['bookmarkedEmailList', search, page],
    queryFn: async () => {
      const emails = await bookmarkedEmailList({
        page,
        search,
      });
      return emails;
    },
    staleTime: 0,
  });

export const useBookmarkedEmailListPrefetch = async ({
  page,
  search,
}: {
  search: string;
  page: number;
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['bookmarkedEmailList', search, page],
    queryFn: async () => {
      const emails = await bookmarkedEmailList({
        page,
        search,
      });
      return emails;
    },
  });
  return queryClient;
};
