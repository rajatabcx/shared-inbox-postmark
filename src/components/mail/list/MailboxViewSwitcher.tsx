'use client';

import React from 'react';
import { Archive, Inbox, Mail, OctagonAlert, Star, Trash } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MailboxViewSwitcher() {
  const [view, setView] = useQueryStates({
    view: parseAsString.withOptions({ shallow: false }).withDefault('inbox'),
    page: parseAsInteger.withOptions({ shallow: false }).withDefault(1),
  });

  const handleViewChange = (value: string) => {
    setView({
      view: value,
      page: 1,
    });
  };

  return (
    <Select value={view.view} onValueChange={handleViewChange}>
      <SelectTrigger className='text-lg font-semibold border-none outline-0 focus-visible:ring-0 !bg-background cursor-pointer shadow-none'>
        <SelectValue placeholder='Select view' />
      </SelectTrigger>
      <SelectContent className='text-xl font-semibold'>
        <SelectItem value='inbox'>
          <Inbox className='size-5' /> Inbox
        </SelectItem>
        <SelectItem value='all'>
          <Mail className='size-5' /> All Mails
        </SelectItem>
        <SelectItem value='archived'>
          <Archive className='size-5' /> Archived
        </SelectItem>
        <SelectItem value='starred'>
          <Star className='size-5' /> Starred
        </SelectItem>
        <SelectItem value='spam'>
          <OctagonAlert className='size-5' /> Spam
        </SelectItem>
        {/* <SelectItem value='spam'>
          <Trash className='size-5' /> Trash
        </SelectItem> */}
      </SelectContent>
    </Select>
  );
}
