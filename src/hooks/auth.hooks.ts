import { useMutation } from '@tanstack/react-query';
import { signin, signout, signup } from '@/actions/auth';
import { signinSchema, signupSchema } from '@/lib/validationSchema';
import { z } from 'zod';

export const useSignin = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof signinSchema>) => {
      const res = await signin(data);
      return res;
    },
  });

export const useSignup = () =>
  useMutation({
    mutationFn: async (data: z.infer<typeof signupSchema>) => {
      const res = await signup(data);
      return res;
    },
  });

export const useSignout = () =>
  useMutation({
    mutationFn: async () => {
      const res = await signout();
      return res;
    },
  });
