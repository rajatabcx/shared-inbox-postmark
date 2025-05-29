'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { currentUser } from './user';
import { ActionResponse, ResponseType } from '@/lib/types';

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
  return {
    type: ResponseType.SUCCESS,
    message: 'Alias added successfully',
  };
}

export async function emailAliasList() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  // Step 1: Get all domain IDs for the org
  const { data: domains, error: domainsError } = await supabase
    .from('domains')
    .select('id')
    .eq('organization_id', user.organizationId);

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

export async function deleteAlias(aliasId: number) {
  const user = await currentUser();

  if (!user) {
    return {
      type: ResponseType.ERROR,
      message: 'User not found',
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('email_aliases')
    .delete()
    .eq('id', aliasId);
  if (error) {
    return {
      type: ResponseType.ERROR,
      message: error.message,
    };
  }
  return {
    type: ResponseType.SUCCESS,
    message: 'Alias deleted successfully',
  };
}
