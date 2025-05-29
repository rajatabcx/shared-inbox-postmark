'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { inviteSchema } from '@/lib/validationSchema';
import { Button } from '@/components/ui/button';
import { Loader, UserRoundPlus } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form/TextInput';
import { SelectInput } from '@/components/form/SelectInput';
import { ResponseType, UserRole } from '@/lib/types';
import { toastHelper } from '@/lib/toastHelper';
import { useInviteUser } from '@/hooks/invitation.hooks';

type InviteFormValues = z.infer<typeof inviteSchema>;

export function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: UserRole.MEMBER,
    },
  });

  const { mutateAsync, isPending } = useInviteUser();

  const onSubmit = async (values: InviteFormValues) => {
    const response = await mutateAsync(values);

    toastHelper(response);
    if (response?.type === ResponseType.SUCCESS) {
      form.reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='lg' className='flex gap-1 items-center'>
          Invite User
          <UserRoundPlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a Teammate to Your Organization</DialogTitle>
          <DialogDescription>
            We will send an invitation to the email address you provide below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <TextInput
              control={form.control}
              name='email'
              label='Work Email'
              placeholder='member@company.com'
              type='email'
              Icon={Mail}
            />

            <SelectInput
              control={form.control}
              name='role'
              label='Select their role in your organization'
              placeholder='Select a role'
              options={[
                { value: UserRole.ADMIN, label: 'Admin' },
                { value: UserRole.MEMBER, label: 'Member' },
              ]}
            />

            <Button
              type='submit'
              size='lg'
              disabled={isPending}
              className='flex gap-1 items-center ml-auto'
            >
              Invite
              {isPending ? <Loader className='w-4 h-4 animate-spin' /> : null}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
