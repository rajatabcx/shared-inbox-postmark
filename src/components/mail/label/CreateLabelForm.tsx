'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Tag, Check, Loader } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { labelSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TextInput } from '@/components/form/TextInput';
import { Label } from '@/components/ui/label';
import { lightThemeColors } from '@/lib/const';
import { cn } from '@/lib/utils';
import { toastHelper } from '@/lib/toastHelper';
import { ActionResponse, ResponseType } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useCreateLabel, useUpdateLabel } from '@/hooks/label.hooks';
import { useQueryClient } from '@tanstack/react-query';

export function CreateLabelForm() {
  const [label, setLabel] = useQueryStates(
    {
      id: parseAsInteger.withDefault(0),
      title: parseAsString.withDefault(''),
      color: parseAsString.withDefault(''),
    },
    {
      history: 'replace',
    }
  );

  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useCreateLabel();
  const { mutateAsync: updateMutateAsync, isPending: updateIsPending } =
    useUpdateLabel();
  const form = useForm<z.infer<typeof labelSchema>>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: '',
      color: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof labelSchema>) => {
    let res: ActionResponse | undefined;
    if (label.id) {
      res = await updateMutateAsync({
        label: values,
        id: label.id,
      });
    } else {
      res = await mutateAsync(values);
    }
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      form.reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    }
  };

  const selectedColor = form.watch('color');

  useEffect(() => {
    if (label.id) {
      setIsOpen(true);
      form.reset({
        name: label.title,
        color: label.color,
      });
    }
  }, [label, form]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setLabel({ id: 0, title: '', color: '' });
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline'>
          Create Label <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>
          <DialogDescription>
            Create a new label to organize your emails.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TextInput
                label='Name'
                placeholder='Enter label name'
                control={form.control}
                name='name'
              />
              <div className='mt-4'>
                <Label className='mb-2'>Select Colors</Label>
                <div className='flex flex-wrap gap-2'>
                  {Object.keys(lightThemeColors).map((color) => (
                    <div key={color}>
                      <Badge
                        className={cn(
                          'text-xs flex items-center gap-1 relative cursor-pointer',
                          selectedColor === color &&
                            'ring-2 ring-offset-2 ring-offset-background'
                        )}
                        style={{
                          backgroundColor: lightThemeColors[color].bg,
                          borderColor: lightThemeColors[color].bg,
                          color: lightThemeColors[color].text,
                        }}
                        onClick={() => {
                          form.setValue('color', color);
                        }}
                      >
                        <Tag
                          className='size-4'
                          style={{ color: lightThemeColors[color].text }}
                        />
                        {color}
                        {selectedColor === color && (
                          <Check className='size-3 ml-1' />
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className='w-full flex justify-end mt-4'>
                <Button
                  type='submit'
                  disabled={isPending || updateIsPending}
                  className='flex gap-1 items-center'
                >
                  {label.id ? 'Update Label' : 'Create Label'}
                  {isPending || updateIsPending ? (
                    <Loader className='size-4 animate-spin' />
                  ) : null}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
