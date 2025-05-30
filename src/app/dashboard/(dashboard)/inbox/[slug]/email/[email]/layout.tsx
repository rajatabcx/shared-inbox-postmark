import { emailDetails } from '@/actions/email';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; email: string }>;
}): Promise<Metadata> {
  const { email } = await params;
  const emailData = await emailDetails({ emailId: Number(email) });
  if (!emailData) {
    return {
      title: 'Email Not Found | Replyas',
      description: 'Email not found',
    };
  }

  return {
    title: `${emailData.email?.subject} | Replyas`,
    description: `Email details for message`,
  };
}

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
