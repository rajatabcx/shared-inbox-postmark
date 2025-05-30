'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ActionResponse, ResponseType } from '@/lib/types';
import { profileSchema } from '@/lib/validationSchema';
import {} from 'next/cache';
import { z } from 'zod';

export const currentUser = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is found, return null
  if (!user) {
    return null;
  }

  // Get the organization(s) the user belongs to
  const { data: memberData } = await supabase
    .from('user_profiles')
    .select(
      'organization_id, onboarded, first_name, last_name, email,id, role, image_url'
    )
    .eq('user_id', user.id)
    .single();

  if (!memberData) {
    return null;
  }

  // Return user with their organization ID
  return {
    organizationId: memberData.organization_id as number,
    profileId: memberData.id,
    id: user.id,
    onboarded: memberData.onboarded,
    firstName: memberData.first_name,
    lastName: memberData.last_name,
    email: memberData.email,
    imageUrl: memberData.image_url,
  };
};

export const updateUserOnboarding = async (): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return {
      message: 'Unauthenticated',
      type: ResponseType.ERROR,
    };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('user_profiles')
    .update({ onboarded: true })
    .eq('id', user.profileId);

  if (error) {
    return {
      message: error?.message || 'Error updating user onboarding',
      type: ResponseType.ERROR,
    };
  }

  return {
    message: 'User onboarding updated successfully',
    type: ResponseType.SUCCESS,
  };
};

export const userOrganization = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user.organizationId)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export const updateUserProfile = async (
  values: z.infer<typeof profileSchema>
) => {
  // 1. Validate the input using Zod
  const parseResult = profileSchema.safeParse(values);
  if (!parseResult.success) {
    // Return or throw validation errors as needed
    return {
      message: 'Validation failed',
      errors: parseResult.error.flatten(),
      type: ResponseType.ERROR,
    };
  }
  const validatedValues = parseResult.data;

  // 2. Check if the current user exists
  const user = await currentUser();
  if (!user) {
    return {
      message: 'Unauthenticated',
      type: ResponseType.ERROR,
    };
  }

  // 3. Update the profile of the current user
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('user_profiles')
    .update({
      first_name: validatedValues.firstName,
      last_name: validatedValues.lastName,
      email: validatedValues.email,
      image_url: validatedValues.imageUrl,
    })
    .eq('id', user.profileId);

  if (error) {
    return {
      message: error?.message || 'Error updating user profile',
      type: ResponseType.ERROR,
    };
  }

  return {
    message: 'User profile updated successfully',
    type: ResponseType.SUCCESS,
  };
};
