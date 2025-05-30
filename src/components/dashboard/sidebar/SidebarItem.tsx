'use client';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function SidebarItem({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <SidebarMenuButton asChild isActive={pathname === href}>
      <Link className={className} href={href} prefetch={false}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
}
