'use client';

import { motion } from 'framer-motion';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CALL_LINK } from '@/lib/const';

export function HeroSection({ userId }: { userId?: string | null }) {
  return (
    <section className='relative h-screen flex items-center justify-center'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]' />
      <div className='container relative z-10 flex items-center justify-center mx-auto px-4 sm:px-0'>
        <motion.div
          className='flex flex-col gap-6 max-w-2xl text-center'
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <motion.h1
              className='text-4xl md:text-6xl font-bold tracking-tight leading-tight'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              One Inbox, <span className='text-primary'>Endless&nbsp;</span>
              Possibilities
            </motion.h1>
            <motion.p
              className='mt-4 text-base sm:text-xl text-muted-foreground'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Streamline your team&apos;s communication and collaboration with
              our powerful shared inbox solution.
            </motion.p>
          </div>
          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href={userId ? '/dashboard/my-tickets' : '/auth/sign-up'}
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
            >
              {userId ? 'Dashboard' : 'Get Started Free'}
            </Link>
            {userId && (
              <Link
                href={CALL_LINK}
                target='_blank'
                rel='noopener noreferrer nofollow'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' })
                )}
              >
                Book a Demo
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
