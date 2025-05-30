import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';

export function EmailAttachments({
  attachment,
}: {
  attachment: { cid: string; attachment_path: string };
}) {
  const [isGeneratingSignedUrl, setIsGeneratingSignedUrl] = useState(false);

  const handleFile = async (path: string) => {
    setIsGeneratingSignedUrl(true);
    const supabase = createSupabaseClient();
    // get signed url valid for 30 minutes
    const { data, error } = await supabase.storage
      .from('attachments')
      .createSignedUrl(path, 60 * 30);
    if (error) {
      console.error(error);
    }

    setIsGeneratingSignedUrl(false);

    if (data) {
      window.open(data.signedUrl, '_blank');
    }
  };

  return (
    <Badge
      variant='outline'
      key={attachment.cid}
      className='flex items-center gap-2 py-1.5 px-2 text-primary hover:bg-primary/10 cursor-pointer'
      onClick={() => {
        handleFile(attachment.attachment_path);
      }}
    >
      {attachment.attachment_path.split('/').pop()}{' '}
      {isGeneratingSignedUrl ? (
        <Loader className='size-4! animate-spin' />
      ) : (
        <Download className='size-4!' />
      )}
    </Badge>
  );
}
