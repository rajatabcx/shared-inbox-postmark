'use server';
import {
  ActionResponse,
  NotificationType,
  ResponseType,
  UserNotificationType,
} from '@/lib/types';
import { currentUser } from './user';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { allChatsFromIds } from './chat';

export const toggleEmailBookmark = async ({
  emailId,
  bookmark,
}: {
  emailId: number;
  bookmark: boolean;
}): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return { message: 'Unauthorized', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('user_email_status')
    .update({
      is_bookmarked: bookmark,
    })
    .eq('email_id', emailId)
    .eq('user_profile_id', user.profileId);
  if (error) {
    return {
      message: 'Failed to bookmark email',
      type: ResponseType.ERROR,
    };
  }

  return { message: 'Bookmark updated', type: ResponseType.SUCCESS };
};

export const toggleEmailSubscription = async ({
  emailId,
  subscribe,
}: {
  emailId: number;
  subscribe: boolean;
}): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return { message: 'Unauthorized', type: ResponseType.ERROR };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('user_email_status')
    .update({
      is_subscribed: subscribe,
    })
    .eq('email_id', emailId)
    .eq('user_profile_id', user.profileId);

  if (error) {
    return {
      message: 'Failed to update subscription',
      type: ResponseType.ERROR,
    };
  }

  await supabase.from('email_activity_logs').insert({
    email_id: emailId,
    user_profile_id: user.profileId,
    type: subscribe
      ? NotificationType.SUBSCRIBED
      : NotificationType.UNSUBSCRIBED,
    metadata: {},
  });

  return { message: 'Subscription updated', type: ResponseType.SUCCESS };
};

export const getEMailSubscribers = async (
  emailId: number
): Promise<number[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('user_email_status')
    .select('user_profile_id')
    .eq('email_id', emailId)
    .eq('is_subscribed', true);

  if (error) {
    return [];
  }

  return data.map((item) => item.user_profile_id);
};

export const notifications = async () => {
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
      *,
      emails (
        id,
        subject,
        shared_inbox_id
      ),
      action_by:user_profiles!notifications_action_by_fkey (
        id,
        first_name,
        last_name,
        image_url
      )
    `
    )
    .eq('notification_for', user.profileId)
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  const mentionedChatIds = data
    .filter((item) => item.event_type === UserNotificationType.MENTIONED)
    .map((item) => (item.metadata as { message_id: number }).message_id);

  const commentedChatIds = data
    .filter((item) => item.event_type === UserNotificationType.COMMENTED)
    .map((item) => (item.metadata as { message_id: number }).message_id);

  const allChats = await allChatsFromIds({
    ids: [...mentionedChatIds, ...commentedChatIds],
  });

  const assignedToIds = data
    .filter((item) => item.event_type === UserNotificationType.ASSIGNED)
    .map((item) => (item.metadata as { assigned_to: number }).assigned_to);

  const { data: profileData } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, image_url')
    .in('id', assignedToIds);

  if (error) {
    return [];
  }

  const modifiedData = data.map((item) => {
    if (item.event_type === UserNotificationType.MENTIONED) {
      const chat = allChats.find(
        (chat) =>
          chat.id === (item.metadata as { message_id: number }).message_id
      );
      return { ...item, chat };
    } else if (item.event_type === UserNotificationType.COMMENTED) {
      const chat = allChats.find(
        (chat) =>
          chat.id === (item.metadata as { message_id: number }).message_id
      );
      return { ...item, chat };
    } else if (item.event_type === UserNotificationType.ASSIGNED) {
      const assignee = profileData?.find(
        (profile) =>
          profile.id === (item.metadata as { assigned_to: number }).assigned_to
      );
      return { ...item, assignee };
    }
    return item;
  });

  return modifiedData;
};
