import { Control, FieldValues, Path } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { TagsInput } from '@/components/ui/tag-input';
import { isValidEmail } from '@/lib/const';

interface PropTypes<T extends FieldValues> {
  name: Path<T>;
  placeholder?: string;
  control: Control<T>;
  className?: string;
  inputClassName?: string;
}

export function EmailInput<T extends FieldValues>({
  name,
  placeholder,
  control,
  className,
  inputClassName,
}: PropTypes<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormControl>
            <TagsInput
              value={field.value}
              onValueChange={(value) => {
                const filteredValue: string[] = value.filter((item) =>
                  isValidEmail(item)
                );
                field.onChange(filteredValue);
              }}
              placeholder={placeholder}
              autoCapitalize='none'
              autoCorrect='off'
              className={cn(className)}
              inputClassName={cn(inputClassName)}
            />
          </FormControl>
          <FormMessage className='text-left' />
        </FormItem>
      )}
    />
  );
}
