'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Globe } from 'lucide-react';
import AddDomain from '@/components/dashboard/domain/AddDomain';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DomainOptions } from '@/components/common/DomainOptions';
import { useDomainList } from '@/hooks/domain.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { routes } from '@/lib/routeHelpers';

export default function DomainPage() {
  const { data: domains, isLoading } = useDomainList();

  return (
    <div className='container px-4 sm:px-6 mx-auto space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h1 className='text-3xl font-bold'>Domain Management</h1>
        </div>
        <AddDomain />
      </div>

      <Card className='max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
          <CardDescription>
            Manage your organization&apos;s domains and email aliases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-2'>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className='h-10 w-full' />
              ))}
            </div>
          ) : !domains?.length ? (
            <div className='text-center py-12 border rounded-md max-w-3xl mx-auto'>
              <Globe className='h-12 w-12 mx-auto text-muted-foreground' />
              <h3 className='mt-4 text-lg font-medium'>No domains added yet</h3>
              <p className='text-muted-foreground mb-4'>
                Add your first domain to get started
              </p>
              <div className='flex justify-center'>
                <AddDomain />
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>
                      <Link
                        href={routes.dashboard.domain(`${domain.id}`)}
                        prefetch={false}
                        className='hover:underline w-full block'
                      >
                        {domain.domain}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {domain.verified ? (
                        <Badge>Verified</Badge>
                      ) : (
                        <Badge variant='destructive'>Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(domain.created_at!, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <DomainOptions
                        domainId={domain.id}
                        domainName={domain.domain}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
