'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { currentUser } from './user';
import { ActionResponse, ResponseType, DomainData } from '@/lib/types';

export async function addDomain(domain: string): Promise<ActionResponse> {
  const user = await currentUser();

  if (!user) {
    return {
      type: ResponseType.ERROR,
      message: 'User not found',
    };
  }

  const supabase = await createSupabaseServerClient();

  const res = await fetch(`${process.env.POSTMARK_API_URL}/domains`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Account-Token': process.env.POSTMARK_ACCOUNT_TOKEN!,
    },
    body: JSON.stringify({
      name: domain,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      type: ResponseType.ERROR,
      message: data.Message || 'Failed to add domain',
    };
  }

  const { error } = await supabase.from('domains').insert({
    domain,
    created_by: user.profileId,
    organization_id: user.organizationId,
    domain_id: data.ID,
    verified: false,
  });

  if (error) {
    return {
      type: ResponseType.ERROR,
      message: error.message || 'Failed to add domain',
    };
  }

  return {
    type: ResponseType.SUCCESS,
    message: 'Domain added successfully',
  };
}

export async function verifyDomain(domainId: number) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('domains')
    .select('domain_id')
    .eq('id', domainId)
    .single();

  if (error) {
    return {
      type: ResponseType.ERROR,
      message: error.message || 'Failed to verify domain',
    };
  }

  await Promise.all([
    fetch(
      `${process.env.POSTMARK_API_URL}/domains/${data.domain_id}/verifyDkim`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'X-Postmark-Account-Token': process.env.POSTMARK_ACCOUNT_TOKEN!,
        },
      }
    ),

    fetch(
      `${process.env.POSTMARK_API_URL}/domains/${data.domain_id}/verifyReturnPath`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'X-Postmark-Account-Token': process.env.POSTMARK_ACCOUNT_TOKEN!,
        },
      }
    ),
  ]);

  const details = await domainDetails(domainId);

  if (details?.DKIMVerified && details?.ReturnPathDomainVerified) {
    await supabase
      .from('domains')
      .update({ verified: true })
      .eq('domain_id', data.domain_id)
      .eq('id', domainId);
  }

  return details;
}

export async function domainList() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('organization_id', user.organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data;
}

export async function domainDetails(
  domainId: number
): Promise<DomainData | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('id', domainId)
    .single();

  if (error) {
    return null;
  }

  const res = await fetch(
    `${process.env.POSTMARK_API_URL}/domains/${data.domain_id}`,
    {
      headers: {
        Accept: 'application/json',
        'X-Postmark-Account-Token': process.env.POSTMARK_ACCOUNT_TOKEN!,
      },
    }
  );

  const domainData: DomainData = await res.json();

  return {
    ...data,
    ...domainData,
  };
}

export async function deleteDomain(domainId: number) {
  const user = await currentUser();

  if (!user) {
    return {
      type: ResponseType.ERROR,
      message: 'User not found',
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('domains')
    .delete()
    .eq('id', domainId)
    .eq('organization_id', user.organizationId)
    .select('domain_id')
    .single();

  if (error) {
    return {
      type: ResponseType.ERROR,
      message: error.message || 'Failed to delete domain',
    };
  }

  const res = await fetch(
    `${process.env.POSTMARK_API_URL}/domains/${data.domain_id}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'X-Postmark-Account-Token': process.env.POSTMARK_ACCOUNT_TOKEN!,
      },
    }
  );

  if (!res.ok) {
    return {
      type: ResponseType.ERROR,
      message: 'Failed to delete domain',
    };
  }

  return {
    type: ResponseType.SUCCESS,
    message: 'Domain deleted successfully',
  };
}
