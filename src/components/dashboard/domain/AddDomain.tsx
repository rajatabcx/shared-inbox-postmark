'use client';

import { TextInput } from '@/components/form/TextInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useAddDomain } from '@/hooks/domain.hooks';
import { toastHelper } from '@/lib/toastHelper';
import { ResponseType } from '@/lib/types';
import { domainSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Globe, Loader, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type DomainType = z.infer<typeof domainSchema>;

export default function AddDomain() {
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const form = useForm<DomainType>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useAddDomain();

  const handleSubmit = async (data: DomainType) => {
    const res = await mutateAsync(data.domain);
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      setIsAddDomainOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['domainList'] });
    }
  };

  return (
    <Dialog open={isAddDomainOpen} onOpenChange={setIsAddDomainOpen}>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-1'>
          Add Domain
          <Globe className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new domain</DialogTitle>
          <DialogDescription>
            Enter the domain you want to add to your organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <TextInput
                  control={form.control}
                  placeholder='example.com'
                  name='domain'
                  Icon={Globe}
                  info="Add your domain here, don't include http or https"
                  label='Domain name'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsAddDomainOpen(false)}
                type='button'
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isPending}
                className='flex items-center gap-2'
              >
                Add Domain
                {isPending ? (
                  <Loader className='h-4 w-4 animate-spin' />
                ) : (
                  <Plus className='h-4 w-4' />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
