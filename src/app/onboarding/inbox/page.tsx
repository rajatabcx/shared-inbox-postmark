'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/form/TextInput';
import { Form } from '@/components/ui/form';
import { InboxIcon, Loader } from 'lucide-react';
import { inboxSchema } from '@/lib/validationSchema';
import { useRouter } from 'next/navigation';
import { ResponseType } from '@/lib/types';
import { toastHelper } from '@/lib/toastHelper';
import { toast } from 'sonner';
import { useCompleteOnboarding } from '@/hooks/user.hooks';
import { useCreateInbox } from '@/hooks/inbox.hooks';

type InboxFormValues = z.infer<typeof inboxSchema>;

export default function OnboardingInbox() {
  const router = useRouter();

  const {
    mutateAsync: updateUserOnboardingMutation,
    isPending: isUpdatingUserOnboarding,
  } = useCompleteOnboarding();
  const { mutateAsync: createInboxMutation, isPending: isCreatingInbox } =
    useCreateInbox();

  const form = useForm<InboxFormValues>({
    resolver: zodResolver(inboxSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: InboxFormValues) => {
    const res = await updateUserOnboardingMutation();
    if (res?.type === ResponseType.ERROR) {
      toast.error('Something went wrong, please try again later');
      return;
    }

    const response = await createInboxMutation(data);
    toastHelper(response);
    if (response?.type === ResponseType.SUCCESS) {
      router.push('/dashboard');
    }
  };

  return (
    <div className='container max-w-2xl mx-auto py-10 px-4'>
      <Card className='w-full'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            Create Your First Inbox
          </CardTitle>
          <CardDescription>
            Name your shared inbox to get started
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className='space-y-4'>
              <TextInput
                control={form.control}
                name='name'
                label='Inbox Name'
                placeholder='e.g., Support, Sales, or Info'
                Icon={InboxIcon}
              />
            </CardContent>

            <CardFooter className='flex justify-end pt-4'>
              <Button
                disabled={isUpdatingUserOnboarding || isCreatingInbox}
                type='submit'
              >
                Create Inbox{' '}
                {isCreatingInbox || isUpdatingUserOnboarding ? (
                  <Loader className='animate-spin size-4' />
                ) : null}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
