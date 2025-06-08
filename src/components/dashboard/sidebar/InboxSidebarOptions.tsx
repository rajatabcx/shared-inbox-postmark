'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { DeleteConfirmation } from './DeleteConfirmation';
import { routes } from '@/lib/routeHelpers';
import { useCurrentUser, useUserOrganization } from '@/hooks/user.hooks';

export default function InboxSidebarOption({
  inbox: { id: inboxId, name: inboxName },
}: {
  inbox: {
    id: number;
    name: string;
  };
}) {
  const [open, setOpen] = useState(false);

  const { data: organization, isLoading } = useUserOrganization();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='hover:bg-transparent'>
          <EllipsisVertical className='size-4' />
          <span className='sr-only'>Options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuItem>
          <Link
            href={routes.dashboard.inbox.setup(`${inboxId}`)}
            className='w-full'
          >
            Setup
          </Link>
        </DropdownMenuItem>
        {/* Hide delete option for postmark org support inbox as the email forwarding is setup and needed for testing */}
        {isLoading ||
        (organization?.name === 'Postmark' &&
          inboxName === 'support') ? null : (
          <DropdownMenuItem asChild>
            <DeleteConfirmation id={inboxId} onDelete={() => setOpen(false)} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
