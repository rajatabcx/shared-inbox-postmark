import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, EyeOff, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PropTypes<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder: string;
  control: Control<T>;
  disabled?: boolean;
  isTextarea?: boolean;
  info?: string;
  Icon?: React.ElementType;
  type?: 'text' | 'password' | 'number' | 'email';
  suffix?: string;
}

export function TextInput<T extends FieldValues>({
  label,
  name,
  placeholder,
  control,
  disabled,
  isTextarea,
  info,
  Icon,
  type = 'text',
  suffix,
}: PropTypes<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? (
            <FormLabel className='flex items-center gap-2'>
              {label}
              {info ? (
                <Tooltip>
                  <TooltipTrigger disabled={!info}>
                    <Info className='w-4 h-4' />
                  </TooltipTrigger>
                  <TooltipContent side='right' className='max-w-xs'>
                    {info}
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </FormLabel>
          ) : null}
          <FormControl>
            {isTextarea ? (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                autoCapitalize='none'
                autoComplete={name}
                autoCorrect='off'
                className='bg-background'
                {...field}
              />
            ) : (
              <div className={cn('relative h-9', suffix ? 'flex' : '')}>
                {Icon ? (
                  <Icon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                ) : null}
                <Input
                  type={
                    type === 'password'
                      ? showPassword
                        ? 'text'
                        : 'password'
                      : type
                  }
                  placeholder={placeholder}
                  autoCapitalize='none'
                  autoComplete={name}
                  autoCorrect='off'
                  disabled={!!disabled}
                  className={cn(
                    'bg-background text-foreground',
                    Icon ? 'pl-10' : '',
                    suffix
                      ? 'flex-1 rounded-r-none border-r-0 ring-0 focus-visible:ring-0 outline-none focus-visible:border-input'
                      : ''
                  )}
                  {...field}
                />
                {suffix ? (
                  <span className='h-full px-3 py-2 text-xs bg-input/30 text-muted-foreground rounded-r-md border border-input border-l-0'>
                    {suffix}
                  </span>
                ) : null}
                {type === 'password' ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-muted-foreground' />
                    ) : (
                      <Eye className='h-4 w-4 text-muted-foreground' />
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                ) : null}
              </div>
            )}
          </FormControl>
          <FormMessage className='text-left' />
        </FormItem>
      )}
    />
  );
}
