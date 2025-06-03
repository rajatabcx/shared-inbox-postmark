'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { productFeatures } from '@/lib/const';

export function FeatureCards() {
  return (
    <section id='features' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.h2
          className='text-3xl font-bold text-center mb-2'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Everything your team needs to collaborate
        </motion.h2>
        <motion.p
          className='md:text-xl text-muted-foreground text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          We&apos;ve got you covered with everything you need to collaborate.
        </motion.p>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {productFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='h-full hover:border-primary/50 transition-colors'>
                <CardHeader>
                  <div className='h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-muted-foreground'>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
