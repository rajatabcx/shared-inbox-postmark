import { currentUser } from '@/actions/user';
import { MyDashboard } from '@/components/mail/MyDashboard';
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';
import { redirect } from 'next/navigation';
import { myEmailListPrefetch } from '@/hooks/email.hooks';
import { dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
});

export default async function MyTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await currentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }
  const searchParamsData = await searchParams;
  const { page, search } = searchParamsCache.parse(searchParamsData) as {
    page: number;
    search: string;
  };

  const queryClient = await myEmailListPrefetch({
    page,
    search,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyDashboard profileId={user.profileId} />
    </HydrationBoundary>
  );
}
