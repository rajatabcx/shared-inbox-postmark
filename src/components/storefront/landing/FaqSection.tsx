'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqs } from '@/lib/const';

export function FaqSection() {
  return (
    <section id='faq' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold mb-4'>
            Frequently Asked Questions
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Find answers to common questions about Shared Inbox
          </p>
        </motion.div>

        <motion.div
          className='max-w-3xl mx-auto'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className='border-zinc-800'
              >
                <AccordionTrigger className='text-left hover:text-primary transition-colors cursor-pointer'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
