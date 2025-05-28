'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { comparisonTable } from '@/lib/const';

export function ComparisonTable() {
  return (
    <section className='py-10'>
      <div className='container mx-auto px-4 sm:px-6'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='rounded-xl border border-secondary bg-secondary/10 overflow-hidden'
        >
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='border-secondary'>
                  <TableHead className='w-[200px] py-4'>Features</TableHead>
                  <TableHead className='py-4'>Starter</TableHead>
                  <TableHead className='py-4'>Pro</TableHead>
                  <TableHead className='py-4'>Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonTable.map((feature, index) => (
                  <TableRow key={index} className='border-secondary py-2'>
                    <TableCell className='font-medium py-4'>
                      {feature.name}
                    </TableCell>
                    <TableCell className='py-4'>
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className='h-5 w-5 text-primary' />
                        ) : (
                          <X className='h-5 w-5 text-muted-foreground' />
                        )
                      ) : (
                        feature.starter
                      )}
                    </TableCell>
                    <TableCell className='py-4'>
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className='h-5 w-5 text-primary' />
                        ) : (
                          <X className='h-5 w-5 text-muted-foreground' />
                        )
                      ) : (
                        feature.pro
                      )}
                    </TableCell>
                    <TableCell className='py-4'>
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className='h-5 w-5 text-primary' />
                        ) : (
                          <X className='h-5 w-5 text-muted-foreground' />
                        )
                      ) : (
                        feature.enterprise
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
