'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { testimonials } from '@/lib/const';

export function Testimonials() {
  return (
    <section className='py-20'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold mb-4'>
            How Teams Use Shared Inbox
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Trusted by thousands of teams worldwide to improve collaboration and
            customer communication
          </p>
        </motion.div>

        <div className='grid gap-8 md:grid-cols-3'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className='h-full'
            >
              <Card className='h-full'>
                <CardContent className='pt-6'>
                  <Quote className='h-8 w-8 text-primary mb-4 opacity-50' />
                  <p className='text-muted-foreground'>
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
                <CardFooter>
                  <div className='flex items-center gap-4'>
                    <Avatar>
                      <AvatarFallback className='bg-primary/30 text-primary'>
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='font-medium'>{testimonial.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {testimonial.title}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
