import { MailDashboard } from '@/components/mail/Dashboard';
import { emailListPrefetch } from '@/hooks/email.hooks';
import { EmailViewType } from '@/lib/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

const searchParamsCache = createSearchParamsCache({
  view: parseAsString.withDefault('inbox'),
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
});

export default async function SharedInbox({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const searchParamsData = await searchParams;
  const { view, page, search } = searchParamsCache.parse(searchParamsData) as {
    view: EmailViewType;
    page: number;
    search: string;
  };

  const queryClient = await emailListPrefetch({
    inboxId: Number(slug),
    view,
    search,
    page,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MailDashboard inboxId={Number(slug)} />
    </HydrationBoundary>
  );
}
