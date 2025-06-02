'use client';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import MailboxViewSwitcher from '@/components/mail/list/MailboxViewSwitcher';
import { EmailCard } from '@/components/mail/list/EmailCard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useMyEmailList } from '@/hooks/email.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganizationMembers } from '@/hooks/organization.hooks';
import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { ListPagination } from '@/components/common/ListPagination';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { EmailView } from '@/lib/types';

export function MyDashboard({ profileId }: { profileId: number }) {
  const [values, setValues] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(''),
  });
  const [value] = useDebounce(values.search, 1000);

  const supabase = createSupabaseClient();
  const { data, isLoading } = useMyEmailList(value, values.page);

  const { data: members } = useOrganizationMembers();

  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`my-tickets-${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
        },
        (payload: any) => {
          if (
            (payload.new.assignee === profileId ||
              payload.old.assignee === profileId) &&
            payload.new.assignee !== payload.old.assignee
          ) {
            queryClient.invalidateQueries({
              queryKey: ['emailList', value, values.page],
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, profileId, queryClient, value, values.page]);

  return (
    <div className='flex h-full flex-col w-full'>
      <div className='flex flex-col h-full border-r w-full'>
        <div className='border-b p-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <SidebarTrigger className='-ml-1' />
          </div>
          <div className='relative max-w-lg w-full'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search'
              className='pl-8'
              value={values.search}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
        </div>
        <div
          className={cn(
            'flex flex-col overflow-auto',
            isLoading ? 'p-4 gap-3' : ''
          )}
        >
          {isLoading ? (
            <>
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Skeleton className='h-15 w-full' />
                </div>
              ))}
            </>
          ) : !data?.data.length ? (
            <div className='flex flex-col items-center justify-center h-full gap-2 py-10'>
              <h1 className='text-lg font-semibold'>You have no emails</h1>
              <p className='text-muted-foreground text-sm'>
                Tickets will appear here when you are assigned to them
              </p>
            </div>
          ) : (
            <>
              {data?.data.map((email) => (
                <div key={email.id}>
                  <EmailCard
                    email={email}
                    inboxId={email.shared_inbox_id}
                    members={members || []}
                    view={EmailView.INBOX}
                  />
                </div>
              ))}
              <ListPagination metadata={data?.metadata} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
