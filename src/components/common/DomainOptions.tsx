'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowBigUpDash, EllipsisVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServerAction } from '@/hooks/useServerAction';
import { toastHelper } from '@/lib/toastHelper';
import { deleteDomain } from '@/actions/domain';

export function DomainOptions({
  domainId,
  domainName,
}: {
  domainId: number;
  domainName: string;
}) {
  const { mutateAsync, isPending } = useServerAction(deleteDomain);

  const handleDeleteDomain = async () => {
    const res = await mutateAsync({ domainId, domainName });
    toastHelper(res);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <EllipsisVertical className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuItem
          className='flex gap-1'
          onClick={handleDeleteDomain}
          disabled={isPending}
        >
          <Trash2 className='size-4' /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
