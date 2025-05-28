import React from 'react';
import ProfileForm from '@/components/dashboard/profile/ProfileForm';
import { currentUser } from '@/actions/user';

export default async function ProfilePage() {
  const user = await currentUser();

  return <ProfileForm user={user!} />;
}
