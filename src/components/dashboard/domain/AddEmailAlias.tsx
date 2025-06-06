'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Loader } from 'lucide-react';
import { emailAliasSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form/TextInput';
import { toastHelper } from '@/lib/toastHelper';
import { useAddAlias } from '@/hooks/alias.hooks';
import { useQueryClient } from '@tanstack/react-query';

type AliasData = z.infer<typeof emailAliasSchema>;

export function AddEmailAlias({
  domainName,
  disabled,
  domainId,
}: {
  domainName: string;
  disabled: boolean;
  domainId: number;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<AliasData>({
    defaultValues: {
      alias: '',
      displayName: '',
    },
    resolver: zodResolver(emailAliasSchema),
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useAddAlias();

  const onSubmit = async (data: AliasData) => {
    const res = await mutateAsync({
      domainId: domainId,
      address: data.alias,
      displayName: data.displayName,
    });
    toastHelper(res);
    if (res?.type === 'success') {
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['emailAliasList'] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='flex items-center gap-2'
          disabled={disabled}
        >
          <Plus className='size-4' />
          Add Alias
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Email Alias</DialogTitle>
          <DialogDescription>
            Create a new email alias for {domainName}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <TextInput
                  control={form.control}
                  name='alias'
                  placeholder='support'
                  info='Enter an email alias you would like to use while replying emails'
                  suffix={`@${domainName}`}
                  label='Email Alias'
                />
              </div>
              <div className='space-y-2'>
                <TextInput
                  placeholder='Customer Support'
                  control={form.control}
                  name='displayName'
                  info='Enter the display name for the alias'
                  label='Display Name'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                type='button'
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='flex items-center gap-2'
                disabled={isPending}
              >
                Create Alias
                {isPending ? (
                  <Loader className='animate-spin h-4 w-4' />
                ) : (
                  <Mail className='h-4 w-4' />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
