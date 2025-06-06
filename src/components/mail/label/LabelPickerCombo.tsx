'use client';
import { useState } from 'react';
import { Tag, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from './Label';
import { toastHelper } from '@/lib/toastHelper';
import Link from 'next/link';
import { ResponseType } from '@/lib/types';
import { useToggleEmailLabel } from '@/hooks/label.hooks';
import { routes } from '@/lib/routeHelpers';

interface Label {
  id: number;
  name: string;
  color: string;
}

interface LabelPickerProps {
  selectedLabels: number[];
  allLabels: Label[];
  emailId: number;
}

export function LabelPickerCombo({
  selectedLabels,
  allLabels,
  emailId,
}: LabelPickerProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, isPending } = useToggleEmailLabel();

  const [selectedLabelState, setSelectedLabel] =
    useState<number[]>(selectedLabels);

  const handleLabelSelect = async (labelId: number) => {
    if (selectedLabelState.includes(labelId)) {
      setSelectedLabel((prev) => prev.filter((id) => id !== labelId));
    } else {
      setSelectedLabel((prev) => [...prev, labelId]);
    }
    const res = await mutateAsync({ emailId, labelId });
    toastHelper(res);
    if (res?.type === ResponseType.ERROR) {
      setSelectedLabel(selectedLabels);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          role='combobox'
          aria-expanded={open}
          className='flex items-center gap-2'
        >
          <Tag className='h-4 w-4' />
          <span className='text-sm'>Labels</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search labels...' />
          <CommandEmpty>No labels found.</CommandEmpty>
          <CommandGroup className='max-h-[200px] overflow-auto'>
            {allLabels.map((label) => {
              const isSelected = selectedLabelState.includes(label.id);

              return (
                <CommandItem
                  key={label.id}
                  onSelect={() => handleLabelSelect(label.id)}
                  className={cn(
                    'flex items-center gap-2 px-2 cursor-pointer data-[disabled=true]:opacity-100'
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    className={cn(
                      'cursor-pointer',
                      'data-[state=checked]:text-black'
                    )}
                  />
                  <Label color={label.color} name={label.name} />
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup>
            <CommandItem asChild>
              <Link
                href={routes.dashboard.labels()}
                className='flex items-center gap-1 text-muted-foreground justify-center cursor-pointer'
              >
                <Tags className='h-4 w-4' />
                Manage labels
              </Link>
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
