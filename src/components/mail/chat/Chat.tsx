'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { EmojiPicker } from './EmojiPicker';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Chat = ({
  chatData,
}: {
  chatData: {
    message_id: number;
    message: string;
    sender?: {
      first_name: string;
      last_name: string;
    };
    sentAt?: string | null;
  };
}) => {
  return (
    <div
      className='flex flex-col gap-1 bg-muted p-2 rounded-lg chat-bubble'
      id={`chat-${chatData.message_id}`}
    >
      <div className='flex items-center gap-2 justify-between'>
        {chatData?.sender ? (
          <span className='text-sm text-muted-foreground'>
            {chatData.sender.first_name} {chatData.sender.last_name}
          </span>
        ) : null}
        {chatData?.sentAt ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='text-xs text-muted-foreground'>
                {/* Add time formatting here */}
                {formatDistanceToNow(chatData.sentAt, {
                  addSuffix: true,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {format(chatData.sentAt, 'MMM d, yyyy HH:mm a')}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      <span
        className='text-sm py-2 rounded-lg text-foreground'
        dangerouslySetInnerHTML={{ __html: chatData?.message || '' }}
      />
      {/* <EmojiPicker /> */}
    </div>
  );
};
