import { z } from 'zod';
import { UserRole } from './types';

export const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  company: z.string().min(1, { message: 'Company name is required' }),
  jobTitle: z.string().min(1, { message: 'Job title is required' }),
  industry: z.string().min(1, { message: 'Please select an industry' }),
  companySize: z.string().min(1, { message: 'Please select company size' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const signinSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  imageUrl: z.string().optional(),
});

export const inboxSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

export const inviteSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  role: z.nativeEnum(UserRole, {
    message: 'Please select a role',
  }),
});

export const joinSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const internalCommentSchema = z.object({
  comment: z.string().min(1, { message: 'Comment is required' }),
  mentions: z.array(z.number()).optional(),
});

export const domainSchema = z.object({
  domain: z.string().min(1, { message: 'Domain is required' }),
});

export const emailAliasSchema = z.object({
  alias: z.string().min(1, { message: 'Alias is required' }),
  displayName: z.string().min(1, { message: 'Display name is required' }),
});

export const labelSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  color: z.string().min(1, { message: 'Color is required' }),
});

export const emailReplyFormSchema = z.object({
  from: z.string().min(1, { message: 'From is required' }),
  to: z.array(z.string()).min(1, { message: 'To is required' }),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
  message: z.string().min(1, { message: 'Message is required' }),
  archive: z.boolean().optional(),
  messageText: z.string().min(1, { message: 'Message is required' }),
});
