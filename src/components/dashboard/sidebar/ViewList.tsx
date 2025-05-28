import { LayoutDashboard } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

// This would be replaced with actual data fetching in a real application
async function getViews() {
  // Simulate API call
  return [
    { id: '1', name: 'All tickets', url: '/dashboard/views/all-tickets' },
    { id: '2', name: 'Unassigned', url: '/dashboard/views/unassigned' },
    { id: '3', name: 'Due today', url: '/dashboard/views/due-today' },
  ];
}

export async function ViewList() {
  const views = await getViews();

  return (
    <SidebarMenu>
      {views.map((view) => (
        <SidebarMenuItem key={view.id}>
          <SidebarMenuButton asChild>
            <Link prefetch={false} href={view.url}>
              <LayoutDashboard className='h-4 w-4' />
              <span>{view.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
