import { MailDashboard } from '@/components/Mail/Dashboard';
import { emailListPrefetch } from '@/hooks/emails';
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
  const { view, page } = searchParamsCache.parse(searchParamsData) as {
    view: EmailViewType;
    page: number;
  };

  const queryClient = await emailListPrefetch({
    inboxId: Number(slug),
    view,
    search: '',
    page,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MailDashboard inboxId={Number(slug)} view={view} page={page} />
    </HydrationBoundary>
  );
}
