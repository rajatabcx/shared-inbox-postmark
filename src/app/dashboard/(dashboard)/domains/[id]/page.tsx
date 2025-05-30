import DomainDetailsPage from '@/components/dashboard/domain/DomainDetailsPage';
import React from 'react';

export default async function DomainDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DomainDetailsPage id={Number(id)} />;
}
