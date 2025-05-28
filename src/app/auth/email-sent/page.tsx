import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Sent | Replyas',
  description: 'Email sent to confirm your account',
};

export default function EmailConfirmedPage() {
  return (
    <div className='container mx-auto py-10 min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Email sent</CardTitle>
          <CardDescription>
            Your email has been sent. Please check your email to confirm your
            account.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href='/' className={cn(buttonVariants({ variant: 'default' }))}>
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
