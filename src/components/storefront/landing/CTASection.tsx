'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CtaSectionProps {
  title: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export function CtaSection({
  title,
  primaryButtonText,
  secondaryButtonText,
}: CtaSectionProps) {
  return (
    <section className='py-16 bg-gradient-to-r from-zinc-950 to-zinc-900'>
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
            <Button size='lg' className='bg-primary hover:bg-primary/80'>
              {primaryButtonText}
            </Button>
            <Button size='lg' variant='outline'>
              {secondaryButtonText}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
