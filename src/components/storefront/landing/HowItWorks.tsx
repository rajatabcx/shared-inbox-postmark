'use client';

import { motion } from 'framer-motion';

import { howItWorks } from '@/lib/const';

export function HowItWorks() {
  return (
    <section id='how-it-works' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold mb-4'>How Shared Inbox Works</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Get started in minutes with our simple four-step process
          </p>
        </motion.div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              className='relative'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {index < howItWorks.length - 1 && (
                <div className='hidden lg:block absolute top-[43.5px] left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent' />
              )}
              <div className='rounded-xl bg-background p-6 h-full border hover:border-primary/50 transition-all duration-300'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold'>
                    {step.number}
                  </div>
                  <div className='h-0.5 flex-1 bg-gradient-to-r from-primary to-transparent' />
                </div>
                <h3 className='text-xl font-bold mb-2'>{step.title}</h3>
                <p className='text-muted-foreground'>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
