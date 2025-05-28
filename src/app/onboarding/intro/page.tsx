'use client';
import { Squirrel } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Intro() {
  return (
    <div className='max-w-xl flex flex-col items-center text-center'>
      <motion.div
        initial={{ y: 250, scale: 2, opacity: 0.5 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <Squirrel className='h-28 w-28 mb-4' />
      </motion.div>
      <motion.h1
        className='text-5xl font-bold'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, ease: 'easeInOut', duration: 0.3 }}
      >
        Welcome to <span className='dahlia'>Shared Inbox</span>
      </motion.h1>
      <motion.p
        className='text-base mt-4 mb-10 text-muted-foreground'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, ease: 'easeInOut', duration: 0.3 }}
      >
        Ignite your startup journey Connect with your ideal investor match and
        get the funding to bring your vision to life.
      </motion.p>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, ease: 'easeInOut' }}
      >
        <Link
          href='/onboarding/invite'
          className={cn(buttonVariants({ size: 'lg' }), 'w-[350px] flex gap-1')}
        >
          Get Started
        </Link>
      </motion.div>
    </div>
  );
}
