'use client';

import { motion } from 'framer-motion';
import { Check, Mail, Calendar, FileText } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { features } from '@/lib/const';

export function TeamFeatures() {
  return (
    <section className='py-20'>
      <div className='container mx-auto px-4 sm:px-6 text-center md:text-left'>
        <div className='grid gap-12 md:grid-cols-2 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-3xl font-bold mb-6'>
              Your Inbox Gets Organized With Ease
            </h2>
            <p className='text-muted-foreground mb-8'>
              Our shared inbox solution helps teams collaborate efficiently,
              reduce response times, and provide exceptional customer service.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className='flex items-start gap-2 text-left'
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className='size-5 flex-shrink-0 rounded-full bg-primary/50 flex items-center justify-center'>
                    <Check className='h-3 w-3 text-primary' />
                  </div>
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className='relative h-[400px]'
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className='absolute inset-0'>
              <Card className='absolute top-0 left-[25%] translate-x-[-50%] md:translate-x-0 md:left-0 w-64 h-48 bg-zinc-900 border-zinc-800 shadow-lg transform -rotate-6'>
                <CardContent className='p-4 flex flex-col h-full'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Mail className='h-4 w-4 text-primary' />
                    <div className='text-sm font-medium'>Customer Inquiry</div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-3 bg-zinc-800 rounded-full w-full' />
                    <div className='h-3 bg-zinc-800 rounded-full w-5/6' />
                    <div className='h-3 bg-zinc-800 rounded-full w-4/6' />
                  </div>
                  <div className='mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center'>
                    <div className='h-6 w-6 rounded-full bg-primary/50' />
                    <div className='h-4 w-16 bg-primary/20 rounded-full' />
                  </div>
                </CardContent>
              </Card>

              <Card className='absolute top-20 left-[50%] translate-x-[-50%] md:translate-x-0 md:left-[30%] w-64 h-48 bg-zinc-900 border-zinc-800 shadow-lg transform rotate-3'>
                <CardContent className='p-4 flex flex-col h-full'>
                  <div className='flex items-center gap-2 mb-3'>
                    <Calendar className='h-4 w-4 text-primary' />
                    <div className='text-sm font-medium'>Team Meeting</div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-3 bg-zinc-800 rounded-full w-full' />
                    <div className='h-3 bg-zinc-800 rounded-full w-3/4' />
                    <div className='h-3 bg-zinc-800 rounded-full w-1/2' />
                  </div>
                  <div className='mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center'>
                    <div className='flex -space-x-2'>
                      <div className='h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700' />
                      <div className='h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700' />
                    </div>
                    <div className='h-4 w-12 bg-primary/20 rounded-full' />
                  </div>
                </CardContent>
              </Card>

              <Card className='absolute bottom-0 left-[75%] translate-x-[-50%] md:translate-x-0 md:left-10 w-64 h-48 bg-zinc-900 border-zinc-800 shadow-lg transform rotate-6'>
                <CardContent className='p-4 flex flex-col h-full'>
                  <div className='flex items-center gap-2 mb-3'>
                    <FileText className='h-4 w-4 text-primary' />
                    <div className='text-sm font-medium'>Project Update</div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-3 bg-zinc-800 rounded-full w-full' />
                    <div className='h-3 bg-zinc-800 rounded-full w-4/5' />
                    <div className='h-3 bg-zinc-800 rounded-full w-3/5' />
                  </div>
                  <div className='mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center'>
                    <div className='h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700' />
                    <div className='h-4 w-20 bg-primary/20 rounded-full' />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
