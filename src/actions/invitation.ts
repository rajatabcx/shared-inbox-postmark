'use server';
import {
  createSupabaseAdminServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server';
import { ActionResponse, InvitationStatus, ResponseType } from '@/lib/types';
import { inviteSchema, joinSchema } from '@/lib/validationSchema';
import { z } from 'zod';
import { currentUser } from './user';
import { revalidatePath } from 'next/cache';
import { simpleSendEmail } from './sendEmail';

const invitationEmailTemplate = (
  inviteByName: string,
  invitedByEmail: string,
  organizationName: string,
  inviteLink: string
) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333;">
    <h2>You're invited to Replyas!</h2>

    <p>
      ${inviteByName} (<a href="mailto:${invitedByEmail}" style="color: #00bc7d;">${invitedByEmail}</a>) has just invited you to join them in Replyas, 
      a new shared inbox that ${organizationName} is using to jam on email together.
    </p>

    <p>
      👉 <a href="${inviteLink}" style="color: #00bc7d; font-weight: bold;">Click here to accept the invite</a>
    </p>

    <p>– The Replyas Team</p>
  </body>
</html>

`;

export const inviteUser = async (
  formData: z.infer<typeof inviteSchema>
): Promise<ActionResponse> => {
  const user = await currentUser();

  if (!user) {
    return { type: ResponseType.ERROR, message: 'User not found' };
  }

  const supabase = await createSupabaseServerClient();

  // check if user profile exists
  const { data: userProfile, error: userProfileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', formData.email)
    .maybeSingle();

  if (userProfileError) {
    return { type: ResponseType.ERROR, message: 'User already exists' };
  } else if (userProfile) {
    return { type: ResponseType.ERROR, message: 'User already exists' };
  }

  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({
      email: formData.email,
      role: formData.role,
      organization_id: user.organizationId,
    })
    .select(
      `
      id,
      organization:organization_id (
        name
      )
    `
    )
    .single();

  if (error) {
    return { type: ResponseType.ERROR, message: 'Invitation already sent' };
  }

  await simpleSendEmail({
    from: `${user.firstName} ${user.lastName} <notifications@${process.env.MY_DOMAIN}>`,
    to: formData.email,
    subject: 'Join me in Replyas!',
    html: invitationEmailTemplate(
      `${user.firstName} ${user.lastName}`,
      user.email,
      invitation.organization.name,
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/join/${invitation.id}`
    ),
  });

  revalidatePath('/dashboard/members', 'page');
  return { type: ResponseType.SUCCESS, message: 'Invitation sent' };
};

export const joinOrganization = async ({
  invitationId,
  formData,
}: {
  invitationId: number;
  formData: z.infer<typeof joinSchema>;
}): Promise<ActionResponse> => {
  const validatedFields = joinSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { message: 'Invalid fields', type: ResponseType.ERROR };
  }

  const inviteData = await invitationData(invitationId);

  if (!inviteData) {
    return { message: 'Invitation not found', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  const adminSupabase = await createSupabaseAdminServerClient();

  const { data, error } = await adminSupabase.auth.admin.createUser({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    email_confirm: true,
    user_metadata: {
      first_name: validatedFields.data.firstName,
      last_name: validatedFields.data.lastName,
    },
  });

  if (error || !data.user) {
    return {
      message: error?.message || 'Error creating user account',
      type: ResponseType.ERROR,
    };
  }

  const { error: userProfileError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: data.user.id,
      first_name: validatedFields.data.firstName,
      last_name: validatedFields.data.lastName,
      created_at: new Date().toISOString(),
      onboarded: true,
      email: validatedFields.data.email,
      role: inviteData.role,
      organization_id: inviteData.organization.id,
    })
    .select()
    .single();

  if (userProfileError) {
    return {
      message: userProfileError.message,
      type: ResponseType.ERROR,
    };
  }

  const { error: updateInvitationError } = await supabase
    .from('invitations')
    .update({
      status: InvitationStatus.ACCEPTED,
    })
    .eq('id', invitationId);

  if (updateInvitationError) {
    return {
      message: updateInvitationError.message,
      type: ResponseType.ERROR,
    };
  }
  // TODO: create email, status for each email for this user
  return { type: ResponseType.SUCCESS, message: 'Joined organization' };
};

export const invitationData = async (invitationId: number) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('invitations')
    .select(
      `
      *,
      organization:organization_id (
        name,
        id
      )
    `
    )
    .eq('id', invitationId)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export const pendingInvitations = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('status', InvitationStatus.PENDING);

  if (error) {
    return null;
  }

  return data;
};
