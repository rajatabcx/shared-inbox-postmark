'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { routes } from '@/lib/routeHelpers';

export function Navbar({ userId }: { userId?: string | null }) {
  return (
    <motion.header
      className='fixed top-0 left-0 z-50 w-full border-b backdrop-blur-md flex items-center justify-center'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className='container flex h-16 items-center justify-between px-4 sm:px-6'>
        <div className='flex items-center gap-6'>
          <Link href={routes.home()} className='flex items-center space-x-2'>
            <motion.div
              className='h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
            <span className='font-bold text-xl'>Shared Inbox</span>
          </Link>
          <nav className='hidden md:flex gap-6'>
            <Link
              href='#features'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              Features
            </Link>
            <Link
              href='#how-it-works'
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              How It Works
            </Link>
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          {!userId ? (
            <Link
              href={routes.auth.signIn()}
              className={cn(buttonVariants({ variant: 'ghost' }))}
            >
              Log in
            </Link>
          ) : null}
          <Link
            href={userId ? routes.dashboard.root() : routes.auth.signUp()}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            {userId ? 'Dashboard' : 'Sign Up Free'}
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='bg-background border-border/40 px-6'
            >
              <nav className='flex flex-col gap-4 mt-8'>
                <Link
                  href='#features'
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  Features
                </Link>
                <Link
                  href='#how-it-works'
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  How It Works
                </Link>
                <Link
                  href='#pricing'
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  Pricing
                </Link>
                <Link
                  href='#faq'
                  className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                  FAQ
                </Link>
                {!userId ? (
                  <Link
                    href={routes.auth.signIn()}
                    className={cn(buttonVariants({ variant: 'ghost' }))}
                  >
                    Log in
                  </Link>
                ) : null}
                <Link
                  href={
                    userId ? routes.dashboard.myTickets() : routes.auth.signUp()
                  }
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  {userId ? 'Dashboard' : 'Sign Up Free'}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
