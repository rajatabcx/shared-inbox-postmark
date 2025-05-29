import { Bookmark } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { toggleEmailBookmark } from '@/actions/notification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResponseType } from '@/lib/types';
import { useToggleEmailBookmark } from '@/hooks/email.hooks';

export function BookmarkEmail({
  emailId,
  bookmarked,
}: {
  emailId: number;
  bookmarked: boolean;
}) {
  const [bookmarkedState, setBookmarkedState] = useState(bookmarked);
  const { mutateAsync, isPending } = useToggleEmailBookmark();
  const handleBookmark = async () => {
    setBookmarkedState(!bookmarkedState);
    const res = await mutateAsync({ emailId, bookmark: !bookmarkedState });
    // toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      setBookmarkedState(!bookmarkedState);
    }
  };

  useEffect(() => {
    setBookmarkedState(bookmarked);
  }, [bookmarked]);

  return (
    <Button
      className='!size-8 rounded-full disabled:opacity-100'
      size='icon'
      variant='ghost'
      onClick={handleBookmark}
      disabled={isPending}
    >
      <Bookmark
        className={cn(
          'h-4 w-4',
          bookmarkedState ? 'fill-primary text-primary' : 'text-gray-500'
        )}
      />
    </Button>
  );
}
