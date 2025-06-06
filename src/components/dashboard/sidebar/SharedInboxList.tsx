'use client';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { getColorForInbox } from '@/lib/const';
import InboxSidebarOption from './InboxSidebarOptions';
import { useListInboxes } from '@/hooks/inbox.hooks';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/lib/routeHelpers';

export function SharedInboxList() {
  const { data: inboxes, isLoading } = useListInboxes();

  const pathname = usePathname();

  return (
    <SidebarMenu>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <Skeleton className='h-8 w-full' />
          </SidebarMenuItem>
        ))
      ) : inboxes && inboxes.length ? (
        inboxes.map((inbox) => (
          <SidebarMenuItem key={inbox.id}>
            <SidebarMenuButton
              asChild
              isActive={
                pathname === routes.dashboard.inbox.details(`${inbox.id}`)
              }
            >
              <div className='flex items-center justify-between w-full'>
                <Link
                  prefetch={false}
                  href={routes.dashboard.inbox.details(`${inbox.id}`)}
                  className='flex items-center justify-between w-full'
                >
                  <div className='flex items-center gap-2'>
                    <span>{inbox.name}</span>
                  </div>
                </Link>
                <InboxSidebarOption inboxId={inbox.id} />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))
      ) : (
        <SidebarMenuItem className='px-2 text-muted-foreground'>
          No inboxes found
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
