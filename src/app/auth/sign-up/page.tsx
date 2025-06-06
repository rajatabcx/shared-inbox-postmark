'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { signupSchema } from '@/lib/validationSchema';
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
import { SelectInput } from '@/components/form/SelectInput';
import { COMPANY_SIZES, INDUSTRIES } from '@/lib/const';
import {
  BriefcaseIcon,
  UserIcon,
  Mail,
  Lock,
  Building,
  Loader,
} from 'lucide-react';
import { toastHelper } from '@/lib/toastHelper';
import { ResponseType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useSignup } from '@/hooks/auth.hooks';
import { routes } from '@/lib/routeHelpers';

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      jobTitle: '',
      password: '',
      companySize: '',
      industry: '',
    },
  });

  const { mutateAsync, isPending } = useSignup();

  const onSubmit = async (values: SignupFormValues) => {
    const res = await mutateAsync(values);
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      router.push(routes.auth.emailSent());
    }
  };

  return (
    <div className='container mx-auto py-10 min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl flex-1 px-4'>
        <Card className='px-6'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>Create your account</CardTitle>
            <CardDescription>
              Get started with your shared inbox experience
            </CardDescription>
          </CardHeader>
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

                  {/* Row 2 */}
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

                  {/* Row 3 */}
                  <TextInput
                    control={form.control}
                    name='company'
                    label='Company Name'
                    placeholder='Your company'
                    Icon={Building}
                  />
                  <TextInput
                    control={form.control}
                    name='jobTitle'
                    label='Job Title'
                    placeholder='e.g., Director of Operations'
                    Icon={BriefcaseIcon}
                  />

                  {/* Row 4 */}
                  <SelectInput
                    control={form.control}
                    name='industry'
                    label='Industry'
                    placeholder='Select your industry'
                    options={INDUSTRIES.map((industry) => ({
                      value: industry,
                      label: industry,
                    }))}
                  />

                  <SelectInput
                    control={form.control}
                    name='companySize'
                    label='Company Size'
                    placeholder='Select company size'
                    options={COMPANY_SIZES.map((size) => ({
                      value: size,
                      label: size,
                    }))}
                  />
                </div>

                <CardFooter className='px-0 flex justify-end'>
                  <Button
                    type='submit'
                    size='lg'
                    disabled={isPending}
                    className='flex gap-1 items-center'
                  >
                    Create Account
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
