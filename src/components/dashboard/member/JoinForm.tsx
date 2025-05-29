'use client';
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { joinSchema } from '@/lib/validationSchema';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Mail, Lock, UserIcon } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form/TextInput';
import { ResponseType, UserRoleType } from '@/lib/types';
import { toastHelper } from '@/lib/toastHelper';
import { useRouter } from 'next/navigation';
import { useJoinOrganization } from '@/hooks/invitation.hooks';

type JoinFormValues = z.infer<typeof joinSchema>;

export default function JoinForm({
  orgName,
  email,
  role,
  invitationId,
}: {
  orgName: string;
  email: string;
  role: UserRoleType;
  invitationId: number;
}) {
  const router = useRouter();
  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending } = useJoinOrganization();

  const onSubmit = async (values: JoinFormValues) => {
    const res = await mutateAsync({
      invitationId,
      data: values,
    });

    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      router.push('/auth/sign-in');
    }
  };

  useEffect(() => {
    form.setValue('email', email);
  }, [email, form]);

  return (
    <div className='bg-background min-h-screen p-4 md:p-8 flex flex-col items-center'>
      <div className='w-full max-w-3xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-semibold text-foreground mb-2'>
            Join {orgName}
          </h1>
          <p className='text-muted-foreground'>
            You&apos;ve been invited to join {orgName} as a {role}.
          </p>
        </div>
        <Card className='w-full max-w-lg mx-auto'>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Row 1 */}
                  <TextInput
                    control={form.control}
                    name='firstName'
                    label='First Name'
                    placeholder='Enter your first name'
                    Icon={UserIcon}
                  />
                  <TextInput
                    control={form.control}
                    name='lastName'
                    label='Last Name'
                    placeholder='Enter your last name'
                    Icon={UserIcon}
                  />
                  {/* Row 2 */}
                  <TextInput
                    control={form.control}
                    name='email'
                    label='Work Email'
                    placeholder='you@company.com'
                    type='email'
                    Icon={Mail}
                    disabled
                  />
                  <TextInput
                    control={form.control}
                    name='password'
                    label='Password'
                    placeholder='Create a password'
                    type='password'
                    Icon={Lock}
                  />
                </div>

                <CardFooter className='px-0 flex justify-end'>
                  <Button
                    type='submit'
                    size='lg'
                    disabled={isPending}
                    className='flex gap-1 items-center'
                  >
                    Join Organization
                    {isPending ? (
                      <Loader className='w-4 h-4 animate-spin' />
                    ) : null}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
