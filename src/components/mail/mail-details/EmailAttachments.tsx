import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';

export function EmailAttachments({
  attachment,
}: {
  attachment: {
    cid: string;
    attachment_path: string;
    original_name: string;
  };
}) {
  const [isGeneratingSignedUrl, setIsGeneratingSignedUrl] = useState(false);

  const handleFile = async (path: string) => {
    setIsGeneratingSignedUrl(true);
    const supabase = createSupabaseClient();
    // get signed url valid for 30 minutes
    console.log(path);
    const { data, error } = await supabase.storage
      .from('attachments')
      .download(path);
    if (error) {
      console.error(error);
    }

    setIsGeneratingSignedUrl(false);

    if (data) {
      const url = URL.createObjectURL(data);

      // Create a temporary anchor element for download
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.original_name; // Use the original filename
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
      {attachment.original_name}{' '}
      {isGeneratingSignedUrl ? (
        <Loader className='size-4! animate-spin' />
      ) : (
        <Download className='size-4!' />
      )}
    </Badge>
  );
}
