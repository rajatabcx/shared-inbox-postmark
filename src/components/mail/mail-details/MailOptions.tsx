import React, { Dispatch, SetStateAction, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDownSquare,
  ChevronUpSquare,
  Contact,
  Copy,
  EllipsisVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MailOptions({
  detailsOpened,
  setDetailsOpened,
}: {
  detailsOpened: boolean;
  setDetailsOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <DropdownMenu open={showOptions} onOpenChange={setShowOptions}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowOptions(true);
          }}
        >
          <EllipsisVertical className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side='bottom'
        align='end'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem
          onClick={() => setDetailsOpened((prev) => !prev)}
          className='flex items-center gap-2'
        >
          {detailsOpened ? (
            <>
              <ChevronUpSquare className='size-4' /> Hide Details
            </>
          ) : (
            <>
              <ChevronDownSquare className='size-4' /> Show Details
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className='size-4' /> Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Contact className='size-4' /> See all from this sender
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
