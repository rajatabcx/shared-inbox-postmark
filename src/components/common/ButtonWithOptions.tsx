'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ButtonWithOptions({
  options,
  disabled,
}: {
  options: {
    label: string;
    description: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
  disabled?: boolean;
}) {
  const [selectedIndex, setSelectedIndex] = useState('0');

  return (
    <div className='divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse'>
      <Button
        className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
        onClick={options[Number(selectedIndex)].onClick}
        type='button'
        disabled={disabled}
      >
        {options[Number(selectedIndex)].icon}
        {options[Number(selectedIndex)].label}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
            size='icon'
            aria-label='Options'
            type='button'
            disabled={disabled}
          >
            <ChevronDownIcon size={16} aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='max-w-64 md:max-w-xs'
          side='bottom'
          sideOffset={4}
          align='end'
        >
          <DropdownMenuRadioGroup
            value={selectedIndex}
            onValueChange={setSelectedIndex}
          >
            {options.map((option, index) => (
              <DropdownMenuRadioItem
                key={option.label}
                value={String(index)}
                className='items-start [&>span]:pt-1.5'
              >
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-medium'>{option.label}</span>
                  <span className='text-muted-foreground text-xs'>
                    {option.description}
                  </span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
