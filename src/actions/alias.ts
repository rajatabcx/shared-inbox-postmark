'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { currentUser } from './user';
import { ActionResponse, ResponseType } from '@/lib/types';
import { revalidatePath } from 'next/dist/server/web/spec-extension/revalidate';

export async function addAlias({
  domainId,
  address,
  displayName,
}: {
  domainId: number;
  address: string;
  displayName?: string;
}): Promise<ActionResponse> {
  const user = await currentUser();

  if (!user) {
    return {
      type: ResponseType.ERROR,
      message: 'User not found',
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('email_aliases').insert({
    domain_id: domainId,
    address,
    display_name: displayName,
    created_by: user.profileId,
  });
  if (error) {
    return {
      type: ResponseType.ERROR,
      message: error.message,
    };
  }
  revalidatePath(`/dashboard/domains/${domainId}`);
  return {
    type: ResponseType.SUCCESS,
    message: 'Alias added successfully',
  };
}

export async function emailAliasList(orgId: number) {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  // Step 1: Get all domain IDs for the org
  const { data: domains, error: domainsError } = await supabase
    .from('domains')
    .select('id')
    .eq('organization_id', orgId);

  if (domainsError || !domains) {
    return [];
  }

  const domainIds = domains.map((domain: { id: number }) => domain.id);

  if (domainIds.length === 0) {
    return [];
  }

  // Step 2: Fetch all aliases for those domain IDs
  const { data: aliases, error: aliasesError } = await supabase
    .from('email_aliases')
    .select('*, domains(domain)')
    .in('domain_id', domainIds);

  if (aliasesError) {
    return [];
  }
  return aliases;
}
