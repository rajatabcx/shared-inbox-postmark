import { listInboxes } from '@/actions/inbox';
import { redirect } from 'next/navigation';

export default async function index() {
  const inboxes = await listInboxes();
  if (inboxes.length) {
    redirect(`/dashboard/inbox/${inboxes[0].id}`);
  }

  return null;
}
