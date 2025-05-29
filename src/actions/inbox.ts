'use server';
import { z } from 'zod';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ActionResponse, ResponseType } from '@/lib/types';
import { inboxSchema } from '@/lib/validationSchema';
import { currentUser } from './user';

export async function createInbox(
  formData: z.infer<typeof inboxSchema>
): Promise<ActionResponse> {
  const validatedFields = inboxSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { message: 'Invalid fields', type: ResponseType.ERROR };
  }

  const user = await currentUser();

  if (!user) {
    return { message: 'User not found', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  // Get organization name
  const { data: orgData } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', user.organizationId)
    .single();

  if (!orgData) {
    return { message: 'Organization not found', type: ResponseType.ERROR };
  }

  const sanitizedInboxName = validatedFields.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  // Sanitize organization name: convert to lowercase, replace spaces with hyphens, remove special characters
  const sanitizedOrgName = orgData.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Combine inbox name, org name, and random ID
  const emailAlias = `${sanitizedOrgName}-${sanitizedInboxName}`;

  const { data, error } = await supabase
    .from('shared_inboxes')
    .insert({
      name: validatedFields.data.name,
      organization_id: user.organizationId,
      forwarding_email: `${emailAlias}@${process.env.MY_DOMAIN}`,
      email_alias: emailAlias,
    })
    .select('id')
    .single();

  if (error) {
    return { message: error.message, type: ResponseType.ERROR };
  }

  return { message: 'Inbox created successfully', type: ResponseType.SUCCESS };
}

export async function listInboxes() {
  const user = await currentUser();

  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('shared_inboxes')
    .select('id,name')
    .eq('organization_id', user.organizationId);

  if (error) {
    return [];
  }

  return data;
}

export const getInbox = async (id: number) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('shared_inboxes')
    .select('*')
    .eq('id', id)
    .eq('organization_id', user.organizationId)
    .single();

  return data;
};

export async function deleteInbox(id: number) {
  const user = await currentUser();

  if (!user) {
    return { message: 'User not found', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('shared_inboxes')
    .delete()
    .eq('id', id)
    .eq('organization_id', user.organizationId);

  if (error) {
    return { message: error.message, type: ResponseType.ERROR };
  }

  return { message: 'Inbox deleted successfully', type: ResponseType.SUCCESS };
}
