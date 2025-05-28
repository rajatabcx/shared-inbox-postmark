'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { footerLinks } from '@/lib/const';

export function Footer() {
  return (
    <footer className='bg-secondary/10 border-t border-secondary'>
      <div className='container py-12 mx-auto px-4 sm:px-6'>
        <div className='grid gap-8 grid-cols-2 lg:grid-cols-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href='/' className='flex items-center space-x-2 mb-4'>
              <div className='h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80' />
              <span className='font-bold text-xl'>Shared Inbox</span>
            </Link>
            <p className='text-muted-foreground mb-4 text-sm'>
              Streamline your team&apos;s communication and collaboration with
              our powerful shared inbox solution.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className='font-medium text-lg mb-4'>Product</h3>
            <ul className='space-y-3'>
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className='font-medium text-lg mb-4'>Resources</h3>
            <ul className='space-y-3'>
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className='font-medium text-lg mb-4'>Company</h3>
            <ul className='space-y-3'>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors text-sm'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className='border-t border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-muted-foreground mb-4 md:mb-0'>
            © {new Date().getFullYear()} Shared Inbox. All rights reserved.
          </p>
          <div className='flex space-x-6'>
            {footerLinks.legal.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className='text-sm text-muted-foreground hover:text-primary transition-colors'
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
