import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteInbox } from '@/hooks/inbox.hooks';
import { toastHelper } from '@/lib/toastHelper';
import { ResponseType } from '@/lib/types';
import { useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useState } from 'react';

export function DeleteConfirmation({
  id,
  onDelete,
}: {
  id: number;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useDeleteInbox();

  const handleDelete = async () => {
    const res = await mutateAsync(id);
    toastHelper(res);
    if (res?.type === ResponseType.SUCCESS) {
      setIsOpen(false);
      onDelete();
      queryClient.invalidateQueries({ queryKey: ['inboxes'] });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          className='w-full justify-start px-2 py-1.5 font-normal hover:bg-accent! focus:bg-accent'
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the inbox
            and remove it from your organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer' disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='flex items-center gap-2 cursor-pointer'
          >
            Continue{' '}
            {isPending ? <Loader className='w-4 h-4 animate-spin' /> : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
