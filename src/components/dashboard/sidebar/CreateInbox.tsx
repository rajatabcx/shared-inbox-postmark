'use client';

import React, { useState } from 'react';

import { InboxIcon, Loader, Plus } from 'lucide-react';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toastHelper } from '@/lib/toastHelper';
import { ResponseType } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Form } from '@/components/ui/form';
import { useServerAction } from '@/hooks/useServerAction';
import { createInbox } from '@/actions/inbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inboxSchema } from '@/lib/validationSchema';
import { TextInput } from '@/components/form/TextInput';

type InboxFormValues = z.infer<typeof inboxSchema>;

export default function CreateInbox() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createInboxMutation, isPending: isCreatingInbox } =
    useServerAction(createInbox);

  const form = useForm<InboxFormValues>({
    resolver: zodResolver(inboxSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: InboxFormValues) => {
    const response = await createInboxMutation(data);
    toastHelper(response);
    if (response?.type === ResponseType.SUCCESS) {
      setOpen(false);
      form.reset();
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Plus />
              <span className='sr-only'>Create Inbox</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className='text-xs' side='right'>
          Create Inbox
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Inbox</DialogTitle>
          <DialogDescription>
            Create a new inbox to start receiving emails.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TextInput
                control={form.control}
                name='name'
                placeholder='e.g., Support, Sales, or Info'
                Icon={InboxIcon}
              />

              <Button disabled={isCreatingInbox} type='submit' className='mt-4'>
                Create Inbox{' '}
                {isCreatingInbox ? (
                  <Loader className='animate-spin size-4' />
                ) : null}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
