'use client';
import { Bell } from 'lucide-react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import React, { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { routes } from '@/lib/routeHelpers';

export function NotificationItem({ profileId }: { profileId: number }) {
  const [newToggle, setNewToggle] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const channel = supabase
      .channel(`notifications-${profileId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          if (payload.new.notification_for === profileId) {
            setNewToggle(true);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, profileId]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        onClick={() => {
          if (newToggle) {
            setNewToggle(false);
          }
        }}
      >
        <Link href={routes.dashboard.notifications()} prefetch={false}>
          <div className='relative overflow-visible'>
            {newToggle ? (
              <>
                <span className='absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-75 -top-1 right-0'></span>
                <span className='absolute inline-flex size-2 rounded-full bg-primary -top-1 right-0'></span>
              </>
            ) : null}
            <Bell className='h-4 w-4' />
          </div>
          <span>Notifications</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
