import { Control, FieldValues, Path } from 'react-hook-form';
import { Info } from 'lucide-react';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PropTypes<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder: string;
  control: Control<T>;
  disabled?: boolean;
  options: { value: string; label: string }[];
  loading?: boolean;
  noDataText?: string;
  info?: string;
  className?: string;
  selectClassName?: string;
}

export function SelectInput<T extends FieldValues>({
  label,
  name,
  placeholder,
  control,
  disabled,
  options,
  loading,
  noDataText,
  info,
  className,
  selectClassName,
}: PropTypes<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? (
            <FormLabel className='flex items-center gap-2'>
              {label}
              <Tooltip>
                <TooltipTrigger
                  className={cn(
                    info
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none select-none'
                  )}
                  disabled={!info}
                >
                  <Info className='w-4 h-4' />
                </TooltipTrigger>
                <TooltipContent className='max-w-xs'>{info}</TooltipContent>
              </Tooltip>
            </FormLabel>
          ) : null}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger
                disabled={disabled || loading}
                isLoading={loading}
                className={cn('w-full', selectClassName)}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {!options.length ? (
                <span className='text-xs text-muted-foreground text-center w-full inline-block'>
                  {noDataText || 'No options available'}
                </span>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
