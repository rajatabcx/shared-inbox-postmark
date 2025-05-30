'use client';
import { CreateLabelForm } from '@/components/mail/label/CreateLabelForm';
import { LabelOptions } from '@/components/mail/label/LabelOptions';
import { Label } from '@/components/mail/label/Label';
import React from 'react';
import { useLabels } from '@/hooks/label.hooks';

export default function LabelPage() {
  const { data: allLabels, isLoading } = useLabels();
  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 min-h-screen flex flex-col gap-y-6'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <h1 className='text-2xl font-bold'>Labels</h1>
        </div>
        <CreateLabelForm />
      </div>
      <div className='max-w-2xl mx-auto w-full'>
        {isLoading ? (
          <div>Loading...</div>
        ) : !allLabels?.length ? (
          <div className='flex flex-col gap-4'>
            <p className='text-sm text-muted-foreground'>
              No labels found. Create a new label to get started.
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-4 w-full'>
            {allLabels.map((label) => (
              <div
                key={label.id}
                className='flex items-center gap-2 border-b justify-between py-3'
              >
                <Label color={label.color} name={label.name} />
                <div className='flex items-center gap-2'>
                  <p className='text-sm text-muted-foreground'>
                    {label.email_count
                      ? `Associated with ${label.email_count} email${
                          label.email_count > 1 ? 's' : ''
                        }`
                      : 'No emails associated'}
                  </p>
                  <LabelOptions
                    labelId={label.id}
                    labelName={label.name}
                    labelColor={label.color}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
