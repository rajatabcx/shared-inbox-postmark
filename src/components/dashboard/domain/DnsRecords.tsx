import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useVerifyDomain } from '@/hooks/domain.hooks';
import { DomainData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { RefreshCw, XCircle } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'sonner';

export function DnsRecords({ domainData }: { domainData: DomainData }) {
  const { mutateAsync, isPending } = useVerifyDomain();

  const onRefreshVerification = async () => {
    await mutateAsync(domainData.id);
  };

  console.log(domainData);

  return (
    <div className='space-y-6 mt-4 @container'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>DNS Records</h1>
        <Button
          onClick={onRefreshVerification}
          variant='outline'
          className='flex items-center gap-2'
          disabled={isPending}
        >
          <RefreshCw
            className={cn('h-4 w-4', isPending ? 'animate-spin' : '')}
          />
          Refresh Verification
        </Button>
      </div>
      <div className='border rounded-md'>
        <div className='hidden @3xl:flex @3xl:flex-row py-2 px-4 border-b'>
          <div className='flex-[0_0_20%]'></div>
          <div className='flex-[0_0_29%]'>
            <p className='text-xs font-normal text-muted-foreground'>
              Hostname
            </p>
          </div>
          <div className='flex-[0_0_9%]'>
            <p className='text-xs font-normal text-muted-foreground'>Type</p>
          </div>
          <div className='flex-[0_0_42%]'>
            <p className='text-xs font-normal text-muted-foreground'>Value</p>
          </div>
        </div>
        <div className='flex flex-col gap-1 @3xl/gap-0 @3xl:flex-row py-2 px-4 border-b'>
          <div className='flex-[0_0_20%] flex gap-2 mb-3 @3xl:mb-0'>
            <XCircle className='size-8 text-muted-foreground' />
            <div>
              <p className='text-lg font-semibold'>DKIM</p>
              {domainData.DKIMVerified ? (
                <p className='text-base font-medium text-muted-foreground'>
                  Active
                </p>
              ) : (
                <p className='text-base font-medium text-muted-foreground'>
                  Inactive
                </p>
              )}
            </div>
          </div>
          <div className='flex-[0_0_29%]'>
            <p className='text-sm font-normal text-muted-foreground block @3xl:hidden'>
              Hostname
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className='text-base font-normal cursor-pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(domainData.DKIMPendingHost);
                    toast.success('Copied to clipboard');
                  }}
                >
                  {domainData.DKIMPendingHost}
                </p>
              </TooltipTrigger>
              <TooltipContent side='left'>Click to copy</TooltipContent>
            </Tooltip>
          </div>
          <div className='flex-[0_0_9%]'>
            <p className='text-sm font-normal text-muted-foreground block @3xl:hidden'>
              Type
            </p>
            <p className='text-base font-normal'>TXT</p>
          </div>
          <div className='flex-[0_0_42%]'>
            <p className='text-sm font-normal text-muted-foreground block @3xl:hidden'>
              Value
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className='text-base font-normal break-all cursor-pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      domainData.DKIMPendingTextValue
                    );
                    toast.success('Copied to clipboard');
                  }}
                >
                  {domainData.DKIMPendingTextValue}
                </p>
              </TooltipTrigger>
              <TooltipContent side='left'>Click to copy</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className='flex flex-col gap-1 @3xl/gap-0 @3xl:flex-row py-2 px-4'>
          <div className='flex-[0_0_20%] flex items-start gap-2 mb-3 @3xl:mb-0'>
            <XCircle className='size-8 text-muted-foreground' />
            <div>
              <p className='text-lg font-semibold'>Return Path</p>
              {domainData.ReturnPathDomainVerified ? (
                <p className='text-base font-medium text-muted-foreground'>
                  Active
                </p>
              ) : (
                <p className='text-base font-medium text-muted-foreground'>
                  Inactive
                </p>
              )}
            </div>
          </div>
          <div className='flex-[0_0_29%]'>
            <p className='text-sm font-normal text-muted-foreground block @3xl:hidden'>
              Hostname
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className='text-base font-normal cursor-pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      domainData.ReturnPathDomain.replace(
                        `.${domainData.domain}`,
                        ''
                      )
                    );
                    toast.success('Copied to clipboard');
                  }}
                >
                  {domainData.ReturnPathDomain.replace(
                    `.${domainData.domain}`,
                    ''
                  )}
                </p>
              </TooltipTrigger>
              <TooltipContent side='left'>Click to copy</TooltipContent>
            </Tooltip>
          </div>
          <div className='flex-[0_0_9%]'>
            <p className='text-sm font-normal text-muted-foreground block @3xl:hidden'>
              Type
            </p>
            <p className='text-base font-normal'>CNAME</p>
          </div>
          <div className='flex-[0_0_42%]'>
            <p className='text-sm font-normal text-muted-foreground block @3xl:hidden'>
              Value
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className='text-base font-normal cursor-pointer'
                  onClick={() => {
                    navigator.clipboard.writeText(
                      domainData.ReturnPathDomainCNAMEValue
                    );
                    toast.success('Copied to clipboard');
                  }}
                >
                  {domainData.ReturnPathDomainCNAMEValue}
                </p>
              </TooltipTrigger>
              <TooltipContent side='left'>Click to copy</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}
