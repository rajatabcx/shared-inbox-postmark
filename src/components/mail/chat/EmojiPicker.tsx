import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import { useState } from 'react';

export const EmojiPicker = () => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='!size-6'>
          <Smile className='size-4 text-muted-foreground' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end'>
        <Picker data={data} onEmojiSelect={console.log} set='native' />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
