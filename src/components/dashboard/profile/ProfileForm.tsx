'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { profileSchema } from '@/lib/validationSchema';
import React, { useEffect } from 'react';
import { TextInput } from '@/components/form/TextInput';
import ImageInput from '@/components/form/ImageInput';
import { Button } from '@/components/ui/button';
import { toastHelper } from '@/lib/toastHelper';
import { Loader } from 'lucide-react';
import { useCurrentUser, useUpdateUserProfile } from '@/hooks/user.hooks';

export default function ProfileForm() {
  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();

  const { data: user } = useCurrentUser();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const res = await updateProfile(values);
    toastHelper(res);
  };

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        imageUrl: user.imageUrl || '',
      });
    }
  }, [user]);

  return (
    <div className='container px-4 sm:px-6 mx-auto py-6 h-screen flex flex-col gap-y-6 justify-center items-center'>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ImageInput
                image={user?.imageUrl || undefined}
                setValue={(value) => form.setValue('imageUrl', value)}
                name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                userId={user?.profileId || 0}
                disabled={isPending || !user}
              />
              <div className='flex flex-col gap-3 mt-8 mb-8'>
                <div className='grid grid-cols-2 gap-4'>
                  <TextInput
                    name='firstName'
                    placeholder='First Name'
                    control={form.control}
                    label='First Name'
                    disabled={isPending || !user}
                  />
                  <TextInput
                    name='lastName'
                    placeholder='Last Name'
                    control={form.control}
                    label='Last Name'
                    disabled={isPending || !user}
                  />
                </div>
                <TextInput
                  name='email'
                  placeholder='Email'
                  control={form.control}
                  label='Email'
                  disabled={isPending || !user}
                />
              </div>
              <Button
                type='submit'
                className='w-full flex gap-2'
                disabled={isPending || !user}
              >
                Update Profile{' '}
                {isPending ? <Loader className='size-4 animate-spin' /> : null}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
