'use client';
import React from 'react';
import { EmailAlias } from '@/components/dashboard/domain/EmailAlias';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDomainDetails } from '@/hooks/domain.hooks';
import { Globe } from 'lucide-react';
import { DnsRecords } from './DnsRecords';

export function DomainDetailsPage({ id }: { id: number }) {
  const { data: domainData, isLoading } = useDomainDetails(id);

  return (
    <div className='container px-4 sm:px-6 mx-auto space-y-6 py-6'>
      <div className='flex items-center gap-2'>
        <h1 className='text-3xl font-bold'>Domain Details</h1>
        {domainData?.verified ? (
          <Badge>Verified</Badge>
        ) : (
          <Badge variant='destructive'>Unverified</Badge>
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : !domainData ? (
        <div className='text-center py-12 border rounded-md'>
          <Globe className='h-12 w-12 mx-auto text-muted-foreground' />
          <h3 className='mt-4 text-lg font-medium'>Domain not found</h3>
          <p className='text-muted-foreground mb-4'>
            Please check the domain id and try again
          </p>
        </div>
      ) : (
        <Tabs defaultValue='dns'>
          <TabsList>
            <TabsTrigger value='dns'>DNS Records</TabsTrigger>
            <TabsTrigger value='email-aliases'>Email Aliases</TabsTrigger>
          </TabsList>
          <TabsContent value='dns'>
            <DnsRecords domainData={domainData} />
          </TabsContent>
          <TabsContent value='email-aliases'>
            <EmailAlias
              domainVerified={domainData.verified}
              domainName={domainData.domain}
              domainId={Number(id)}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
