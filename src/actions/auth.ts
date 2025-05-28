'use server';
import {
  createSupabaseAdminServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server';
import { signinSchema, signupSchema } from '@/lib/validationSchema';
import { z } from 'zod';
import { simpleSendEmail } from './sendEmail';
import { ActionResponse, ResponseType, UserRole } from '@/lib/types';

const emailConfirmationTemplate = (name: string, confirmationURL: string) => `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; color: #333;">
    <p>
     Hi ${name}, we are really excited to see you checking out Replyas! Let's get you verified 
    </p>

    <p>👉<a href="${confirmationURL}" style="color: #00bc7d; font-weight: bold;">&nbsp;Click here to verify and get started</a></p>

    <p>– The Replyas Team</p>
  </body>
</html>
`;

export const signup = async (
  formData: z.infer<typeof signupSchema>
): Promise<ActionResponse> => {
  const validatedFields = signupSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { message: 'Invalid fields', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();
  const supabaseAdmin = await createSupabaseAdminServerClient();

  // 1. Create the user account first
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    email: validatedFields.data.email,
    type: 'signup',
    password: validatedFields.data.password,
    options: {
      data: {
        first_name: validatedFields.data.firstName,
        last_name: validatedFields.data.lastName,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/email-confirmed`,
    },
  });

  if (error || !data.user) {
    return {
      message: error?.message || 'Error creating user account',
      type: ResponseType.ERROR,
    };
  }

  // 2. Create the user profile
  const { data: userProfileData, error: userProfileError } = await supabase
    .from('user_profiles')
    .insert({
      user_id: data.user.id,
      first_name: validatedFields.data.firstName,
      last_name: validatedFields.data.lastName,
      created_at: new Date().toISOString(),
      onboarded: false,
      job_title: validatedFields.data.jobTitle,
      email: validatedFields.data.email,
      role: UserRole.ADMIN,
    })
    .select()
    .single();

  if (userProfileError) {
    return {
      message: userProfileError.message,
      type: ResponseType.ERROR,
    };
  }

  // 3. Create the organization with the user ID
  const { data: organizationData, error: organizationError } = await supabase
    .from('organizations')
    .insert({
      name: validatedFields.data.company,
      created_by: userProfileData.id,
      industry: validatedFields.data.industry,
      size: validatedFields.data.companySize,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (organizationError) {
    return {
      message: organizationError?.message || 'Error creating organization',
      type: ResponseType.ERROR,
    };
  }

  // 3. Create the organization membership to connect user and organization
  const orgId = organizationData.id;
  const { error: userProfileUpdateError } = await supabase
    .from('user_profiles')
    .update({
      organization_id: orgId,
    })
    .eq('id', userProfileData.id);

  if (userProfileUpdateError) {
    return {
      message: userProfileUpdateError.message,
      type: ResponseType.ERROR,
    };
  }

  await simpleSendEmail({
    from: `Rajat from Replyas <notifications@${process.env.MY_DOMAIN}>`,
    to: validatedFields.data.email,
    subject: 'Verify your new Replyas account!',
    html: emailConfirmationTemplate(
      validatedFields.data.firstName,
      data.properties.action_link
    ),
  });

  return {
    message: 'Account created successfully',
    type: ResponseType.SUCCESS,
  };
};

export const signin = async (
  formData: z.infer<typeof signinSchema>
): Promise<ActionResponse> => {
  const validatedFields = signinSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { message: 'Invalid fields', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      message: error?.message || 'Error signing in',
      type: ResponseType.ERROR,
    };
  }
  return { message: 'Signed in successfully', type: ResponseType.SUCCESS };
};

export const signout = async (): Promise<ActionResponse> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { message: error.message, type: ResponseType.ERROR };
  }

  return { message: 'Signed out successfully', type: ResponseType.SUCCESS };
};
