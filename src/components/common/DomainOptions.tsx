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
import { useQueryClient } from '@tanstack/react-query';
import { ResponseType } from '@/lib/types';

export function DomainOptions({ domainId }: { domainId: number }) {
  const { mutateAsync, isPending } = useDeleteDomain();
  const queryClient = useQueryClient();

  const handleDeleteDomain = async () => {
    const res = await mutateAsync(domainId);
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      queryClient.invalidateQueries({ queryKey: ['domainList'] });
    }
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
