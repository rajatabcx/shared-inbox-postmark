'use client';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { getColorForInbox } from '@/lib/const';
import { listInboxes } from '@/actions/inbox';
import InboxSidebarOption from './InboxSidebarOptions';
import { SidebarItem } from './SidebarItem';
import { useListInboxes } from '@/hooks/inbox.hooks';
import { usePathname } from 'next/navigation';

export function SharedInboxList() {
  const { data: inboxes, isLoading } = useListInboxes();

  const pathname = usePathname();

  return (
    <SidebarMenu>
      {isLoading ? (
        <SidebarMenuItem className='px-2 text-muted-foreground'>
          Loading...
        </SidebarMenuItem>
      ) : inboxes && inboxes.length ? (
        inboxes.map((inbox) => (
          <SidebarMenuItem key={inbox.id}>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/dashboard/inbox/${inbox.id}`}
            >
              <div className='flex items-center justify-between w-full'>
                <Link
                  prefetch={false}
                  href={`/dashboard/inbox/${inbox.id}`}
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
