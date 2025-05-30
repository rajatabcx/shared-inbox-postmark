import {
  Bookmark,
  ChevronDown,
  Dot,
  GalleryVerticalEnd,
  Globe,
  Scan,
  Tags,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SharedInboxList } from './SharedInboxList';
import CreateInbox from './CreateInbox';
import { userOrganization } from '@/actions/user';
import { currentUser } from '@/actions/user';
import { SidebarUser } from './SidebarUser';
import { NotificationItem } from './NotificationItem';
import { SidebarItem } from './SidebarItem';

export async function DashboardSidebar() {
  const organization = await userOrganization();
  const user = await currentUser();

  return (
    <Sidebar className='border-r'>
      <SidebarHeader>
        <SidebarMenuItem className='list-none mt-4'>
          <SidebarMenuButton
            disabled
            className='data-[slot=sidebar-menu-button]:!p-1.5 !opacity-100'
          >
            <div className='size-8 flex items-center justify-center rounded-md bg-primary'>
              <GalleryVerticalEnd className='h-5 w-5' />
            </div>
            <span className='text-base font-semibold'>
              {organization?.name}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {/* customized options */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarItem href='/dashboard/my-tickets'>
                  <div className='relative'>
                    <Scan className='size-4' />
                    <Dot className='size-4 absolute top-0 right-0' />
                  </div>
                  <span>My Emails</span>
                </SidebarItem>
              </SidebarMenuItem>
              <NotificationItem profileId={user?.profileId!} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* quick access */}
        <SidebarGroup>
          <SidebarGroupLabel className='flex items-center justify-between pr-2'>
            <div className='group flex items-center gap-2 cursor-pointer'>
              <span>Quick Access</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarItem href='/dashboard/bookmarked'>
                  <Bookmark className='h-4 w-4' />
                  <span>My Bookmarks</span>
                </SidebarItem>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* views */}
        {/* <SidebarGroup>
            <Collapsible defaultOpen className='w-full'>
              <SidebarGroupLabel className='flex items-center justify-between pr-2'>
                <CollapsibleTrigger className='group flex items-center gap-2 cursor-pointer'>
                  <span>Views</span>
                  <ChevronDown className='h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                </CollapsibleTrigger>
                <Button variant='ghost' size='icon'>
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Add view</span>
                </Button>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <ViewList />
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup> */}

        {/* shared inboxes */}
        <SidebarGroup>
          <Collapsible defaultOpen className='w-full'>
            <SidebarGroupLabel className='flex items-center justify-between pr-2'>
              <CollapsibleTrigger className='group flex items-center gap-2 cursor-pointer'>
                <span>Shared Inboxes</span>
                <ChevronDown className='h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180' />
              </CollapsibleTrigger>
              <CreateInbox />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SharedInboxList />
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarItem href='/dashboard/domains'>
              <Globe className='h-4 w-4' />
              <span>Domains</span>
            </SidebarItem>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarItem href='/dashboard/labels'>
              <Tags className='h-4 w-4' />
              <span>Labels</span>
            </SidebarItem>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarUser
          user={{
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email || '',
            image_url: user?.imageUrl || '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
