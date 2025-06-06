'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import { Loader, Mail } from 'lucide-react';
import { inviteSchema } from '@/lib/validationSchema';
import Link from 'next/link';
import { ResponseType, UserRole } from '@/lib/types';
import { toastHelper } from '@/lib/toastHelper';
import { SelectInput } from '@/components/form/SelectInput';
import { useInviteUser } from '@/hooks/invitation.hooks';
import { routes } from '@/lib/routeHelpers';

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function OnboardingInvite() {
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
    }
  };

  return (
    <div className='container max-w-2xl mx-auto py-10 px-4'>
      <Card className='w-full'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Invite Your Team</CardTitle>
          <CardDescription>
            Invite up to 4 team members to collaborate in your shared inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
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

              <div className='flex gap-2 justify-end'>
                <Button
                  asChild
                  type='button'
                  size='lg'
                  variant='outline'
                  disabled={isPending}
                  className='flex gap-1 items-center'
                >
                  <Link href={routes.onboarding.inbox()}>Skip for now</Link>
                </Button>
                <Button
                  type='submit'
                  size='lg'
                  disabled={isPending}
                  className='flex gap-1 items-center'
                >
                  Invite
                  {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                  ) : null}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
