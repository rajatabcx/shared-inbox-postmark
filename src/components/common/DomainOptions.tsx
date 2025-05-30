'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toastHelper } from '@/lib/toastHelper';
import { useDeleteDomain } from '@/hooks/domain.hooks';

export function DomainOptions({
  domainId,
  domainName,
}: {
  domainId: number;
  domainName: string;
}) {
  const { mutateAsync, isPending } = useDeleteDomain();

  const handleDeleteDomain = async () => {
    const res = await mutateAsync(domainId);
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
