'use client';

import { motion } from 'framer-motion';
import { Button, buttonVariants } from '@/components/ui/button';
import { CALL_LINK } from '@/lib/const';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routeHelpers';

interface CtaSectionProps {
  title: string;
  userId?: string | null;
}

export function CtaSection({ title, userId }: CtaSectionProps) {
  return (
    <section className='py-16 bg-gradient-to-r'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.div
          className='max-w-3xl mx-auto text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold mb-6'>{title}</h2>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href={
                userId ? routes.dashboard.myTickets() : routes.auth.signUp()
              }
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
            >
              {userId ? 'Dashboard' : 'Get Started Free'}
            </Link>
            <Link
              href={CALL_LINK}
              target='_blank'
              rel='noopener noreferrer nofollow'
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Book a Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
