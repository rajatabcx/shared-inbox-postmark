'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { signinSchema } from '@/lib/validationSchema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TextInput } from '@/components/form/TextInput';
import { Mail, Lock, Loader } from 'lucide-react';
import { toastHelper } from '@/lib/toastHelper';
import { ResponseType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useSignin } from '@/hooks/auth.hooks';

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending } = useSignin();

  const onSubmit = async (values: SigninFormValues) => {
    const res = await mutateAsync(values);
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      router.push('/dashboard');
    }
  };

  return (
    <div className='container mx-auto py-10 min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl flex-1 px-4'>
        <Card className='px-6'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='grid grid-cols-1 gap-6'>
                  {/* Row 1 */}
                  <TextInput
                    control={form.control}
                    name='email'
                    label='Work Email'
                    placeholder='you@company.com'
                    type='email'
                    Icon={Mail}
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
                    Sign In
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
