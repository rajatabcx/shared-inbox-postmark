'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toastHelper } from '@/lib/toastHelper';
import { parseAsInteger, useQueryStates, parseAsString } from 'nuqs';
import { useDeleteLabel } from '@/hooks/label.hooks';

interface LabelOptionsProps {
  labelId: number;
  labelName: string;
  labelColor: string;
}

export function LabelOptions({
  labelId,
  labelName,
  labelColor,
}: LabelOptionsProps) {
  const [label, setLabel] = useQueryStates(
    {
      id: parseAsInteger.withDefault(0),
      title: parseAsString.withDefault(''),
      color: parseAsString.withDefault(''),
    },
    {
      history: 'replace',
    }
  );
  const { mutateAsync, isPending } = useDeleteLabel();

  const handleDelete = async () => {
    const res = await mutateAsync(labelId);
    toastHelper(res);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='secondary'
          size='icon'
          className='size-6 rounded-full flex-shrink-0'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem
          className='text-sm cursor-pointer'
          onClick={() => {
            setLabel({ id: labelId, title: labelName, color: labelColor });
          }}
        >
          <Pencil className='h-4 w-4' />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-sm cursor-pointer text-destructive focus:text-destructive'
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className='h-4 w-4' />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
