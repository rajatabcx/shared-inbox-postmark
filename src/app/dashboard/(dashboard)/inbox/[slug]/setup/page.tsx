import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CopyElement } from '@/components/ui/copy-element';
import { getInbox } from '@/actions/inbox';
import { InfoIcon } from 'lucide-react';

export default async function EmailSetup({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const inbox = await getInbox(Number(slug));

  return (
    <div className='bg-background min-h-screen p-4 md:p-8 flex flex-col items-center'>
      <div className='w-full max-w-3xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-foreground mb-2'>
            Email Setup for &quot;{inbox?.name}&quot;
          </h1>
          <p className='text-muted-foreground'>
            Configure how emails get delivered to and sent from this account.
          </p>
        </div>

        <Card className='mb-6 shadow-sm'>
          <CardContent className='p-6'>
            <h2 className='text-2xl font-bold text-foreground'>
              Receiving email
            </h2>
            <p className='text-muted-foreground mb-4 mt-1'>
              Any email sent to your unique Replyas address below will deliver
              to your shared inbox:
            </p>

            <div className='flex items-center gap-2 mb-4'>
              <CopyElement
                defaultValue={inbox?.forwarding_email || ''}
                className='w-full'
              />
            </div>

            <div className='mb-6'>
              <p className='font-semibold text-xl text-foreground'>
                To get your own shared email addresses delivered here too:
              </p>
              <p className='text-muted-foreground text-sm mt-1'>
                Go to your email provider for those shared addresses and update
                their settings to forward a copy of all incoming mail to your
                unique Shared Inbox address above.
              </p>
            </div>

            <div className='flex items-start gap-2'>
              <span className='text-xl'>👋</span>
              <p className='text-muted-foreground text-sm'>
                We&apos;re here to help!{' '}
                <Link
                  href='mailto:rajat.abcx@gmail.com'
                  className='text-primary hover:underline font-medium'
                >
                  Reach out to our team
                </Link>{' '}
                if you need assistance, and together we can get you set up and
                running in no time.
              </p>
            </div>
            <div className='flex items-start gap-2 mt-4 bg-secondary rounded-md p-2'>
              <InfoIcon className='size-5' />
              <div>
                <p className='text-secondary-foreground text-sm'>
                  Good to know
                </p>
                <p className='text-secondary-foreground text-sm'>
                  Any email that arrives from now on will be forwarded to
                  Replyas - no email history will be imported.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
