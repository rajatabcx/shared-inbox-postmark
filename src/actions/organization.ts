'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { currentUser } from './user';
import { Member } from '@/lib/types';

export async function organizationMembers(name?: string): Promise<Member[]> {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const query = supabase
    .from('user_profiles')
    .select('id, first_name, last_name, email, image_url')
    .eq('organization_id', user.organizationId);

  if (name) {
    query.ilike('concat(first_name, " ", last_name)', `%${name}%`);
  }

  const { data: orgMembers, error: orgError } = await query;

  if (orgError) {
    return [];
  }

  return orgMembers;
}
