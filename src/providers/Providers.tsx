'use client';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import QueryProvider from './QueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider delayDuration={0}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
          disableTransitionOnChange
        >
          <ProgressProvider
            height='4px'
            color='#00bc7d'
            options={{ showSpinner: false }}
            shallowRouting
          >
            <NuqsAdapter>{children}</NuqsAdapter>
          </ProgressProvider>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
    </QueryProvider>
  );
}
