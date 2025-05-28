import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Replyas',
  description: 'Sign in to your account to get started with Replyas',
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
