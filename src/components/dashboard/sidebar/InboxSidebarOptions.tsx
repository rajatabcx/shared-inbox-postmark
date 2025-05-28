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

export default function InboxSidebarOption({ inboxId }: { inboxId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <EllipsisVertical className='size-4' />
          <span className='sr-only'>Options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuItem>
          <Link href={`/dashboard/inbox/${inboxId}/setup`} className='w-full'>
            Setup
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteConfirmation id={inboxId} onDelete={() => setOpen(false)} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
