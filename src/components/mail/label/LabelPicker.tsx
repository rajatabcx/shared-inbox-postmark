'use client';
import React from 'react';
import { LabelPickerCombo } from './LabelPickerCombo';
import { useLabels } from '@/hooks/label.hooks';

export function LabelPicker({
  selectedLabels,
  emailId,
}: {
  selectedLabels: number[];
  emailId: number;
}) {
  const { data: allLabels } = useLabels();
  return (
    <LabelPickerCombo
      selectedLabels={selectedLabels}
      allLabels={allLabels ?? []}
      emailId={emailId}
    />
  );
}
