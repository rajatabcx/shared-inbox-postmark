'use server';

import { labelSchema } from '@/lib/validationSchema';
import { z } from 'zod';
import { currentUser } from './user';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ActionResponse, NotificationType, ResponseType } from '@/lib/types';

export const createLabel = async (
  label: z.infer<typeof labelSchema>
): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return { message: 'Unauthorized', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('labels')
    .insert({
      name: label.name,
      color: label.color,
      created_by: user.profileId,
      organization_id: user.organizationId,
    })
    .select();

  if (error) {
    return { message: error.message, type: ResponseType.ERROR };
  }

  return { message: 'Label created successfully', type: ResponseType.SUCCESS };
};

export const labels = async () => {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('labels')
    .select(
      `
      name, 
      color, 
      id,
      email_count:email_labels(count)
    `
    )
    .eq('organization_id', user.organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  // Transform the response to get the count value
  return data.map((label) => ({
    ...label,
    email_count: label.email_count[0].count,
  }));
};

export const updateLabel = async ({
  label,
  id,
}: {
  label: z.infer<typeof labelSchema>;
  id: number;
}) => {
  const user = await currentUser();
  if (!user) {
    return { message: 'Unauthorized', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('labels')
    .update({ name: label.name, color: label.color })
    .eq('id', id);

  if (error) {
    return { message: error.message, type: ResponseType.ERROR };
  }

  return { message: 'Label updated successfully', type: ResponseType.SUCCESS };
};

export const deleteLabel = async (id: number) => {
  const user = await currentUser();
  if (!user) {
    return { message: 'Unauthorized', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('labels').delete().eq('id', id);

  if (error) {
    return { message: error.message, type: ResponseType.ERROR };
  }

  return { message: 'Label deleted successfully', type: ResponseType.SUCCESS };
};

export const toggleEmailLabel = async ({
  emailId,
  labelId,
}: {
  emailId: number;
  labelId: number;
}) => {
  const user = await currentUser();
  if (!user) {
    return { message: 'Unauthorized', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  // First check if the label exists for this email
  const { data: existingLabel, error: checkError } = await supabase
    .from('email_labels')
    .select('label:labels(id, name, color)')
    .eq('email_id', emailId)
    .eq('label_id', labelId)
    .maybeSingle();

  if (checkError) {
    return { message: checkError.message, type: ResponseType.ERROR };
  }

  // If label exists, delete it. If it doesn't exist, insert it.
  const { data: labelData, error } = existingLabel
    ? await supabase
        .from('email_labels')
        .delete()
        .eq('email_id', emailId)
        .eq('label_id', labelId)
    : await supabase
        .from('email_labels')
        .insert({
          email_id: emailId,
          label_id: labelId,
        })
        .select('label:labels(id, name, color)')
        .single();

  if (error) {
    return {
      message: error.message,
      type: ResponseType.ERROR,
    };
  }

  await supabase.from('email_activity_logs').insert({
    email_id: emailId,
    user_profile_id: user.profileId,
    type: existingLabel
      ? NotificationType.REMOVE_TAG
      : NotificationType.ADD_TAG,
    metadata: existingLabel
      ? {
          tag_id: labelId,
          tag_name: existingLabel?.label.name,
          tag_color: existingLabel?.label.color,
        }
      : {
          tag_id: labelId,
          tag_name: labelData?.label.name,
          tag_color: labelData?.label.color,
        },
  });

  return {
    message: existingLabel
      ? 'Label removed from email'
      : 'Label added to email',
    type: ResponseType.SUCCESS,
  };
};
