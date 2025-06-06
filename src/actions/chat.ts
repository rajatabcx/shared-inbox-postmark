'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { currentUser } from './user';
import {
  ActionResponse,
  NotificationType,
  ResponseType,
  UserNotificationType,
} from '@/lib/types';
import { load } from 'cheerio';
import { getEMailSubscribers } from './notification';

export const addInternalComment = async ({
  comment,
  mailId,
  mentions,
}: {
  comment: string;
  mailId: number;
  mentions: number[];
}): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('internal_messages')
    .insert({
      email_id: mailId,
      sender_id: user.profileId,
      message: comment,
    })
    .select('id')
    .single();

  if (error) {
    return {
      message: error.message,
      type: ResponseType.ERROR,
    };
  }
  await supabase.from('internal_message_mentions').insert(
    mentions.map((mention) => ({
      user_profile_id: mention,
      internal_message_id: data.id,
    }))
  );
  await supabase.from('email_activity_logs').insert({
    email_id: mailId,
    user_profile_id: user.profileId,
    type: NotificationType.ADD_CHAT,
    metadata: {
      message_id: data.id,
    },
  });
  const allEmailSubscribers = await getEMailSubscribers(mailId);

  const emailSubscribersExceptMentions = allEmailSubscribers
    .filter((subscriber) => !mentions.includes(subscriber))
    .map((subs) => ({
      notificationFor: subs,
      NotificationType: UserNotificationType.COMMENTED,
    }));

  const emailMentions = mentions.map((mention) => ({
    notificationFor: mention,
    NotificationType: UserNotificationType.MENTIONED,
  }));

  const allUserNotifications = [
    ...emailSubscribersExceptMentions,
    ...emailMentions,
  ].filter((item) => item.notificationFor !== user.profileId);

  await supabase.from('notifications').insert(
    allUserNotifications.map((notification) => ({
      email_id: mailId,
      notification_for: notification.notificationFor,
      event_type: notification.NotificationType,
      metadata: {
        message_id: data.id,
      },
      action_by: user.profileId,
    }))
  );
  return { message: 'Internal comment added', type: ResponseType.SUCCESS };
};

function updateMentionsInHTML(
  rawHtml: string,
  userMap: Record<string, { name: string; imageUrl: string | null }>
): string {
  const $ = load(rawHtml, null, false); // Disable auto html/body wrapping

  $('[data-user-id]').each((_, el) => {
    const $el = $(el);
    const userId = $el.attr('data-user-id');
    const fullName = userMap[userId ?? ''].name || 'Unknown';
    // we might use it later
    // const imageUrl = userMap[userId ?? ''].imageUrl || null;

    $el.text(`@${fullName}`);
  });

  // Extract only the inner HTML (no <html> or <body>)
  return $.root().html() ?? '';
}

export const chatListForEmail = async ({ mailId }: { mailId: number }) => {
  const user = await currentUser();
  if (!user) {
    return [];
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('internal_messages')
    .select(
      `*, 
      user_profiles(first_name, last_name, image_url), 
      internal_message_mentions(user_profile_id, user_profiles(first_name, last_name, image_url))`
    )
    .eq('email_id', mailId)
    .order('created_at', { ascending: true });

  if (error) {
    return [];
  }

  // For each message, call updateMentionListHtml with the message and userMap
  const updatedChats = data.map((item) => {
    const userMap: Record<string, { name: string; imageUrl: string | null }> =
      item.internal_message_mentions.reduce((acc, mention) => {
        if (mention.user_profiles) {
          acc[mention.user_profile_id] = {
            name: `${mention.user_profiles.first_name} ${mention.user_profiles.last_name}`,
            imageUrl: mention.user_profiles.image_url || null,
          };
        }
        return acc;
      }, {} as Record<string, { name: string; imageUrl: string | null }>);
    return {
      ...item,
      message: updateMentionsInHTML(item.message, userMap),
    };
  });

  return updatedChats;
};

export const allChatsFromIds = async ({ ids }: { ids: number[] }) => {
  const user = await currentUser();
  if (!user) {
    return [];
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('internal_messages')
    .select(
      `*, 
      user_profiles(first_name, last_name, image_url), 
      internal_message_mentions(user_profile_id, user_profiles(first_name, last_name, image_url))`
    )
    .in('id', ids)
    .order('created_at', { ascending: true });

  if (error) {
    return [];
  }

  // For each message, call updateMentionListHtml with the message and userMap
  const updatedChats = data.map((item) => {
    const userMap: Record<string, { name: string; imageUrl: string | null }> =
      item.internal_message_mentions.reduce((acc, mention) => {
        if (mention.user_profiles) {
          acc[mention.user_profile_id] = {
            name: `${mention.user_profiles.first_name} ${mention.user_profiles.last_name}`,
            imageUrl: mention.user_profiles.image_url || null,
          };
        }
        return acc;
      }, {} as Record<string, { name: string; imageUrl: string | null }>);
    return {
      ...item,
      message: updateMentionsInHTML(item.message, userMap),
    };
  });

  return updatedChats;
};
