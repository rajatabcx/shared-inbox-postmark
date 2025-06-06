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
import { routes } from '@/lib/routeHelpers';

export const metadata: Metadata = {
  title: 'Email Confirmed | Replyas',
  description: 'Email confirmed',
};

export default function EmailConfirmedPage() {
  return (
    <div className='container mx-auto py-10 min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Email confirmed</CardTitle>
          <CardDescription>
            Your email has been confirmed. You can now login to your account.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href={routes.auth.signIn()}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Signin
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
