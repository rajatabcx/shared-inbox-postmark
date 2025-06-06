'use client';

import {
  Bell,
  Globe,
  LogOutIcon,
  MoreVerticalIcon,
  Tag,
  UserRoundPen,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { toastHelper } from '@/lib/toastHelper';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignout } from '@/hooks/auth.hooks';
import { routes } from '@/lib/routeHelpers';

export function SidebarUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    image_url: string;
  };
}) {
  const { mutateAsync: signout, isPending } = useSignout();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const handleSignout = async () => {
    const res = await signout();
    toastHelper(res);
    router.push(routes.home());
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user.image_url} className='object-cover' />
                <AvatarFallback className='rounded-lg'>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.image_url} className='object-cover' />
                  <AvatarFallback className='rounded-lg'>
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={routes.dashboard.members()}
                  className='cursor-pointer'
                  prefetch={false}
                >
                  <Users />
                  Team Members
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={routes.dashboard.profile()}
                  className='cursor-pointer'
                  prefetch={false}
                >
                  <UserRoundPen />
                  Edit profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignout} disabled={isPending}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
