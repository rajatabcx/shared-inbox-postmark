'use client';
import { toggleEmailStar } from '@/actions/email';
import { Button } from '@/components/ui/button';
import { useToggleEmailStar } from '@/hooks/email.hooks';
import { ResponseType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function StarEmail({
  isStarred,
  emailId,
}: {
  isStarred: boolean;
  emailId: number;
}) {
  const [isStarredState, setIsStarredState] = useState(isStarred);
  const { mutateAsync, isPending } = useToggleEmailStar();
  const handleStarToggle = async () => {
    setIsStarredState(!isStarredState);
    const res = await mutateAsync({ emailId, star: !isStarredState });
    // toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      setIsStarredState(!isStarredState);
    }
  };

  useEffect(() => {
    setIsStarredState(isStarred);
  }, [isStarred]);

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={handleStarToggle}
      className='!size-8 rounded-full disabled:opacity-100'
      disabled={isPending}
    >
      <Star
        className={cn(
          'h-4 w-4',
          isStarredState ? 'fill-amber-400 text-amber-400' : 'text-gray-500'
        )}
      />
    </Button>
  );
}
