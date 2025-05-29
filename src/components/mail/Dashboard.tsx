'use client';
import { BookOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { EmailListItem, EmailView, EmailViewType } from '@/lib/types';
import MailboxViewSwitcher from './list/MailboxViewSwitcher';
import { EmailCard } from './list/EmailCard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useEmailList } from '@/hooks/emails';
import { Skeleton } from '../ui/skeleton';
import { useOrganizationMembers } from '@/hooks/organization';
import { useCallback, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { ListPagination } from '../common/ListPagination';
import { useQueryClient } from '@tanstack/react-query';

export function MailDashboard({
  inboxId,
  view,
  page,
}: {
  inboxId: number;
  view: EmailViewType;
  page: number;
}) {
  const [text, setText] = useState('');
  const [value] = useDebounce(text, 1000);

  const supabase = createSupabaseClient();
  const { data, isLoading } = useEmailList(inboxId, view, value, page);

  const { data: members } = useOrganizationMembers();

  const queryClient = useQueryClient();

  const handleUpdate = useCallback(
    (emailId: number, email: EmailListItem, event: string) => {
      const emailExistsInList = data?.data.find(
        (email) => email.id === emailId
      );
      if (
        emailExistsInList ||
        (email.is_starred && view === EmailView.STARRED) ||
        (email.is_archived && view === EmailView.ARCHIVED) ||
        (email.is_spam && view === EmailView.SPAM) ||
        event === 'INSERT'
      ) {
        queryClient.invalidateQueries({
          queryKey: ['emailList', inboxId, view, value, page],
        });
      }
    },
    [data, inboxId, view, value, page, queryClient]
  );

  useEffect(() => {
    const channel = supabase
      .channel(`inbox:${inboxId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emails',
        },
        (payload: any) => {
          const emailId = payload.new.id as number;
          handleUpdate(emailId, payload.new, payload.eventType);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, inboxId, handleUpdate]);

  return (
    <div className='flex h-full flex-col w-full'>
      <div className='flex flex-col h-full border-r w-full'>
        <div className='border-b p-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mx-2 data-[orientation=vertical]:h-4'
            />
            <MailboxViewSwitcher />
          </div>
          <div className='relative max-w-lg w-full'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search'
              className='pl-8'
              value={text}
              onChange={(e) => setText(e.target.value)}
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
              <h1 className='text-lg font-semibold'>
                No emails found in {view}
              </h1>
              <p className='text-muted-foreground text-sm'>
                Setup email forwarding to your inbox to start receiving emails
              </p>
              <Link
                href={`/dashboard/inbox/${inboxId}/setup`}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Setup Guide <BookOpen className='w-4 h-4' />
              </Link>
            </div>
          ) : (
            <>
              {data?.data.map((email) => (
                <div key={email.id}>
                  <EmailCard
                    email={email}
                    inboxId={inboxId}
                    members={members || []}
                    view={view}
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
