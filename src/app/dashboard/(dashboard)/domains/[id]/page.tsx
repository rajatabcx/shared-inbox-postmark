import { domainDetails } from '@/actions/domain';
import { DnsRecords } from '@/components/dashboard/domain/DnsRecords';
import { EmailAlias } from '@/components/dashboard/domain/EmailAlias';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe } from 'lucide-react';
import React from 'react';

export default async function DomainDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const domainData = await domainDetails(Number(id));
  return (
    <div className='container px-4 sm:px-6 mx-auto space-y-6 py-6'>
      <div className='flex items-center gap-2'>
        <h1 className='text-3xl font-bold'>Domain Details</h1>
        <Badge variant='outline'>
          {domainData?.domain.state
            ? domainData.domain.state[0].toUpperCase() +
              domainData.domain.state.slice(1)
            : ''}
        </Badge>
      </div>
      {!domainData ? (
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
              domainVerified={domainData.sending_dns_records.every(
                (record) => record.valid === 'valid'
              )}
              domainName={domainData.domain.name}
              domainId={Number(id)}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
