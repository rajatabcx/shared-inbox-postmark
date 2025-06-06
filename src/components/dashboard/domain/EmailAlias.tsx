import React from 'react';
import { AddEmailAlias } from './AddEmailAlias';
import { Globe, Loader } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { useEmailAliasList } from '@/hooks/alias.hooks';
import { Skeleton } from '@/components/ui/skeleton';

export function EmailAlias({
  domainVerified,
  domainName,
  domainId,
}: {
  domainVerified: boolean;
  domainName: string;
  domainId: number;
}) {
  const { data: emailAliases, isLoading } = useEmailAliasList();

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mt-6'>
        <h1 className='text-2xl font-bold'>Email Aliases</h1>
        <AddEmailAlias
          domainName={domainName}
          disabled={!domainVerified}
          domainId={domainId}
        />
      </div>
      {/* TODO: can only be added when both TXT record for sending record are verified */}
      {domainVerified ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className='text-center space-y-2'>
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                </TableCell>
              </TableRow>
            ) : !emailAliases || emailAliases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className='text-center text-muted-foreground'
                >
                  No email aliases found
                </TableCell>
              </TableRow>
            ) : (
              emailAliases.map((alias) => (
                <TableRow key={alias.id}>
                  <TableCell>
                    {alias.address}@{domainName}
                  </TableCell>
                  <TableCell>{alias.display_name || '-'}</TableCell>
                  <TableCell>
                    {alias.created_at
                      ? formatDistanceToNow(new Date(alias.created_at), {
                          addSuffix: true,
                        })
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      ) : (
        <div className='text-center py-12 border rounded-md'>
          <Globe className='h-12 w-12 mx-auto text-muted-foreground' />
          <h3 className='mt-4 text-lg font-medium'>Domain not verified yet</h3>
          <p className='text-muted-foreground mb-4'>
            Please verify your domain to create email aliases, add all the
            sending DNS records and try again.
          </p>
        </div>
      )}
    </div>
  );
}
