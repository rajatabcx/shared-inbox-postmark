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
