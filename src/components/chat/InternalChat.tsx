'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { internalCommentSchema } from '@/lib/validationSchema';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader } from 'lucide-react';
import { Member, ResponseType } from '@/lib/types';
import { ChatEditor } from '@/components/editor/chat/ChatEditor';
import { useState } from 'react';
import { useAddInternalComment } from '@/hooks/internalChat.hooks';
import { modifyChatHtml } from '@/lib/utils';

type InternalCommentType = z.infer<typeof internalCommentSchema>;

export function InternalChat({
  emailId,
  orgMembers,
}: {
  emailId: number;
  orgMembers: Member[];
}) {
  const [disabled, setDisabled] = useState(true);
  const form = useForm<InternalCommentType>({
    resolver: zodResolver(internalCommentSchema),
    defaultValues: {
      comment: '',
      mentions: [],
    },
  });

  const { mutateAsync, isPending } = useAddInternalComment();

  const onSubmit = async (data: InternalCommentType) => {
    const modifiedChatHtml = modifyChatHtml(data.comment);
    const response = await mutateAsync({
      comment: modifiedChatHtml,
      mailId: emailId,
      mentions: data.mentions || [],
    });

    if (response?.type === ResponseType.SUCCESS) {
      form.reset();
    }
  };

  const value = form.watch('comment');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='relative'>
        <ChatEditor
          onChange={(value, text, mentions) => {
            form.setValue('comment', value);
            form.setValue('mentions', mentions);
            setDisabled(!text.trim());
          }}
          placeholder='Add internal comment'
          value={value}
          orgMembers={orgMembers}
        />
        <Button
          type='submit'
          className='rounded-full absolute right-2 bottom-2 !size-6 disabled:grayscale-100'
          size='icon'
          disabled={disabled || isPending}
        >
          {isPending ? (
            <Loader className='size-4 animate-spin' />
          ) : (
            <ArrowUp className='size-4' />
          )}
        </Button>
      </form>
    </Form>
  );
}
