import { routes } from '@/lib/routeHelpers';
import { redirect } from 'next/navigation';

export default async function index() {
  redirect(routes.dashboard.myTickets());
}
