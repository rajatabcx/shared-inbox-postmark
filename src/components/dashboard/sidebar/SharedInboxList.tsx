import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { getColorForInbox } from '@/lib/const';
import { listInboxes } from '@/actions/inbox';
import InboxSidebarOption from './InboxSidebarOptions';

export async function SharedInboxList() {
  const inboxes = await listInboxes();

  return (
    <SidebarMenu>
      {inboxes && inboxes.length ? (
        inboxes.map((inbox) => (
          <SidebarMenuItem key={inbox.id}>
            <SidebarMenuButton asChild>
              <Link
                prefetch={false}
                href={`/dashboard/inbox/${inbox.id}`}
                className='flex items-center justify-between w-full'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className='h-2 w-2 rounded-full'
                    style={{ backgroundColor: getColorForInbox() }}
                  />
                  <span>{inbox.name}</span>
                </div>
                <InboxSidebarOption inboxId={inbox.id} />
              </Link>
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
