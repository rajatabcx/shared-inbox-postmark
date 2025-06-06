import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { EmailReplyEditor } from '@/components/editor/mail/EmailReplyEditor';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { emailReplyFormSchema } from '@/lib/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { SelectInput } from '@/components/form/SelectInput';
import { useEmailAliasList } from '@/hooks/alias.hooks';
import { Button } from '@/components/ui/button';
import { Info, Loader, Send, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EmailInput } from '@/components/form/EmailInput';
import { ButtonWithOptions } from '@/components/common/ButtonWithOptions';
import DiscardReply from './DiscardReply';
import { getDistinctEmails } from '@/lib/const';
import { toastHelper } from '@/lib/toastHelper';
import { useSendEmail } from '@/hooks/sendEmail.hooks';
import { handleStrippedText, wrapHtmlWithQuote } from '@/lib/utils';

type EmailFormValues = z.infer<typeof emailReplyFormSchema>;

export default function EmailReplyForm({
  orgId,
  subject,
  replyTo,
  toEmail,
  replying,
  setReplying,
  references,
  inReplyTo,
  sharedInboxId,
  aliasEmail,
  parentEmailId,
  emailBody,
  emailFrom,
  emailTime,
}: {
  orgId: number;
  subject: string;
  replyTo: string | null;
  toEmail: string;
  replying: {
    all: boolean;
    to: boolean;
  };
  setReplying: Dispatch<SetStateAction<{ all: boolean; to: boolean }>>;
  references: string[];
  inReplyTo: string;
  sharedInboxId: number;
  aliasEmail: string;
  parentEmailId: number;
  emailBody: string;
  emailFrom: { email: string; name: string };
  emailTime: string;
}) {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const { data: aliasList, isLoading } = useEmailAliasList();

  const { mutateAsync, isPending } = useSendEmail();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailReplyFormSchema),
    defaultValues: {
      to: [],
      from: '',
      message: '',
      messageText: '',
      cc: [],
      bcc: [],
      archive: false,
    },
  });
  const onSubmit = async (data: EmailFormValues) => {
    const strippedText = handleStrippedText(data.message);
    const response = await mutateAsync({
      html: data.message,
      text: data.messageText,
      from: data.from,
      to: data.to,
      cc: data.cc || [],
      bcc: data.bcc || [],
      archive: !!data.archive,
      subject: subject,
      replyTo: inReplyTo,
      references: references,
      sharedInboxId: sharedInboxId,
      aliasEmail: aliasEmail,
      parentEmailId,
      strippedText,
    });
    toastHelper(response);
  };

  // const { modifiedEmailBody } = useMemo(() => {
  //   const modifiedEmailBody = wrapHtmlWithQuote(
  //     emailBody,
  //     emailFrom,
  //     emailTime
  //   );
  //   return { modifiedEmailBody };
  // }, [emailBody, emailFrom, emailTime]);

  useEffect(() => {
    if (aliasList?.length) {
      form.setValue(
        'from',
        `${aliasList[0].display_name} <${aliasList[0].address}@${aliasList[0].domains.domain}>`
      );
    }
  }, [aliasList, form]);

  // useEffect(() => {
  //   form.setValue('message', modifiedEmailBody);
  // }, [modifiedEmailBody, form]);

  useEffect(() => {
    if (replying.all) {
      const emails = getDistinctEmails([toEmail], replyTo);
      form.setValue('to', emails);
    } else if (replying.to) {
      form.setValue('to', replyTo ? [replyTo] : [toEmail]);
    }
  }, [replyTo, toEmail, replying, form]);

  useEffect(() => {
    if (!!aliasList?.[0] && !isLoading) {
      form.setValue(
        'from',
        `${aliasList[0].display_name} <${aliasList[0].address}@${aliasList[0].domains.domain}>`
      );
    }
  }, [aliasList, isLoading, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className='text-sm'>
            <div className='flex items-center gap-2 border-b py-2'>
              <p>From:</p>
              <SelectInput
                options={
                  aliasList?.map((alias) => ({
                    value: `${alias.display_name} <${alias.address}@${alias.domains.domain}>`,
                    label: `${alias.display_name} <${alias.address}@${alias.domains.domain}>`,
                  })) || []
                }
                control={form.control}
                name='from'
                placeholder='Select from email'
                disabled={isLoading}
                loading={isLoading}
                className='flex-1'
                selectClassName='bg-transparent! border-none w-fit cursor-pointer shadow-none'
              />
            </div>
            <div className='flex items-center gap-2 py-2 border-b'>
              <p>To:</p>
              <div className='flex-1 flex gap-2 justify-between'>
                <EmailInput
                  name='to'
                  control={form.control}
                  className='w-full'
                  inputClassName='shadow-none'
                />
                <div className='flex items-center gap-2'>
                  <Button
                    variant='link'
                    size='sm'
                    onClick={() => setShowCc((prev) => !prev)}
                    className='p-0 text-muted-foreground text-xs'
                    type='button'
                  >
                    CC
                  </Button>
                  <Button
                    variant='link'
                    size='sm'
                    onClick={() => setShowBcc((prev) => !prev)}
                    className='p-0 text-muted-foreground text-xs'
                    type='button'
                  >
                    BCC
                  </Button>
                </div>
              </div>
            </div>
            {showCc ? (
              <div className='flex items-center gap-2 py-2 border-b'>
                <p>CC:</p>
                <div className='flex-1 flex gap-2 justify-between'>
                  <EmailInput
                    name='cc'
                    control={form.control}
                    className='w-full'
                    inputClassName='shadow-none'
                  />
                </div>
              </div>
            ) : null}
            {showBcc ? (
              <div className='flex items-center gap-2 py-2 border-b'>
                <p>BCC:</p>
                <div className='flex-1 flex gap-2 justify-between'>
                  <EmailInput
                    name='bcc'
                    control={form.control}
                    className='w-full'
                    inputClassName='shadow-none'
                  />
                </div>
              </div>
            ) : null}
            <div className='flex items-center gap-2 py-2 border-b'>
              <p>Subject:</p>
              <div className='flex-1 flex justify-between items-center'>
                <p className='text-muted-foreground'>{subject}</p>
                <Tooltip>
                  <TooltipTrigger className='cursor-pointer'>
                    <Info className='size-4 text-muted-foreground' />
                  </TooltipTrigger>
                  <TooltipContent>Subject is not editable.</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <EmailReplyEditor
              onChange={(html, text) => {
                form.setValue('message', html);
                form.setValue('messageText', text);
              }}
              value={form.watch('message')}
            />
          </CardContent>
          <CardFooter className='flex justify-between'>
            <DiscardReply
              onDiscard={() => {
                setReplying({ all: false, to: false });
              }}
            />
            <ButtonWithOptions
              disabled={isPending}
              options={[
                {
                  label: 'Send',
                  description: 'Send the reply',
                  onClick: () => {
                    form.setValue('archive', false);
                    form.handleSubmit(onSubmit)();
                  },
                  icon: isPending ? (
                    <Loader className='size-5 animate-spin' />
                  ) : (
                    <Send className='size-5' />
                  ),
                },
                {
                  label: 'Send and Archive',
                  description: 'Send the reply and archive the conversation',
                  onClick: () => {
                    form.setValue('archive', true);
                    form.handleSubmit(onSubmit)();
                  },
                  icon: isPending ? (
                    <Loader className='size-5 animate-spin' />
                  ) : (
                    <Send className='size-5' />
                  ),
                },
              ]}
            />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
