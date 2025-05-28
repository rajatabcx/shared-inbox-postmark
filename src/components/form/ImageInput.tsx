'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ImageInput({
  image,
  setValue,
  name,
  userId,
}: {
  image?: string;
  setValue: (value: string) => void;
  name: string;
  userId: number;
}) {
  const supabase = createSupabaseClient();
  const [selectedImage, setSelectedImage] = useState<string | null | undefined>(
    image
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setValue(objectUrl);
      const { data, error } = await supabase.storage
        .from('profile')
        .upload(`${userId}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: true,
        });
      if (error) {
        toast.error(error.message);
        setSelectedImage(image);
      }
      const { data: publicData } = supabase.storage
        .from('profile')
        .getPublicUrl(`${userId}-${file.name}`);
      if (data) {
        // toast.success('Image uploaded successfully');
        setSelectedImage(publicData.publicUrl);
        setValue(publicData.publicUrl);
      }
    },
    [image, setValue, userId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  });

  return (
    <div
      {...getRootProps()}
      className='cursor-pointer size-24 rounded-full bg-secondary flex items-center justify-center mx-auto relative group'
    >
      <input {...getInputProps()} />
      {isDragActive ? null : (
        <Avatar className='size-24 opacity-100 group-hover:opacity-0 transition-opacity duration-300'>
          {selectedImage ? (
            <AvatarImage src={selectedImage} className='object-cover' />
          ) : null}
          <AvatarFallback className='text-xl font-semibold'>
            {name
              ?.split(' ')
              .map((name) => name[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      )}
      {isDragActive ? (
        <p className='absolute top-0 left-0 text-xs opacity-100 text-center flex items-center justify-center h-full w-full border border-dashed border-border rounded-full p-1'>
          Drop the files here ...
        </p>
      ) : (
        <p className='absolute top-0 left-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center flex items-center justify-center h-full w-full border border-dashed border-border rounded-full p-1'>
          {selectedImage
            ? 'Click to change'
            : "Drag 'n' drop, or click to select"}
        </p>
      )}
    </div>
  );
}
