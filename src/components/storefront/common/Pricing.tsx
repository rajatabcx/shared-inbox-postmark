'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { plans } from '@/lib/const';

export function PricingSection() {
  return (
    <section id='pricing' className='py-20'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl font-bold mb-4'>
            Choose the perfect plan for your team
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            All plans include a 14-day free trial with no credit card required
          </p>
        </motion.div>

        <div className='grid gap-8 md:grid-cols-3'>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='h-full'
            >
              <Card
                className={`h-full ${
                  plan.popular
                    ? 'border-primary/80 shadow-lg shadow-primary/10'
                    : ''
                }`}
              >
                <CardHeader>
                  <div className='flex items-center justify-between gap-2'>
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.popular ? (
                      <div className='bg-primary text-xs font-bold uppercase py-1 px-3 rounded-full text-black'>
                        Popular
                      </div>
                    ) : null}
                  </div>
                  <div className='flex items-baseline mt-2'>
                    <span className='text-4xl font-bold'>{plan.price}</span>
                    <span className='text-muted-foreground ml-1'>/month</span>
                  </div>
                  <CardDescription className='mt-2'>
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-3'>
                    {plan.features.map((feature, i) => (
                      <li key={i} className='flex items-center gap-2'>
                        <div className='h-5 w-5 rounded-full bg-primary/50 flex items-center justify-center'>
                          <Check className='h-3 w-3 text-primary' />
                        </div>
                        <span className='text-sm'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular ? 'bg-primary hover:bg-primary/80' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
