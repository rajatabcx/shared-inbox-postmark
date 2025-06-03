'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmailStatus as EmailStatusEnum, ResponseType } from '@/lib/types';
import StatusIcon from './StatusIcon';
import { useEffect, useState } from 'react';
import { useUpdateEmailStatus } from '@/hooks/email.hooks';

export function EmailStatus({
  currentStatus,
  emailId,
  showStatusText = true,
  side = 'bottom',
  align = 'end',
}: {
  currentStatus: EmailStatusEnum;
  emailId: number;
  showStatusText?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}) {
  const [currentStatusState, setCurrentStatusState] = useState(currentStatus);

  const { mutateAsync, isPending } = useUpdateEmailStatus();
  const handleStatusChange = async (status: EmailStatusEnum) => {
    setCurrentStatusState(status);
    const res = await mutateAsync({
      emailId,
      status,
      oldStatus: currentStatus,
    });
    if (res?.type === ResponseType.ERROR) {
      setCurrentStatusState(currentStatus);
    }
  };

  useEffect(() => {
    setCurrentStatusState(currentStatus);
  }, [currentStatus]);
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='cursor-pointer flex items-center justify-center gap-1 outline-none ring-0'>
        <StatusIcon status={currentStatusState} className='flex-shrink-0' />
        {showStatusText && <p className='text-sm'>{currentStatusState}</p>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='text-sm'
        side={side || 'bottom'}
        align={align || 'end'}
      >
        {[
          EmailStatusEnum.TODO,
          EmailStatusEnum.IN_PROGRESS,
          EmailStatusEnum.DRAFTING_REPLY,
          EmailStatusEnum.IN_REVIEW,
          EmailStatusEnum.DONE,
        ].map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => {
              handleStatusChange(status);
            }}
            className='cursor-pointer'
            disabled={isPending}
          >
            <StatusIcon status={status} />
            <p>{status}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
