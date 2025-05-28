import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Replyas',
  description: 'Create your account to get started with Replyas',
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
