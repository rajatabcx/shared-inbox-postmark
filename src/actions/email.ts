'use server';
import {
  createSupabaseAdminServerClient,
  createSupabaseServerClient,
} from '@/lib/supabase/server';
import {
  ActionResponse,
  Activity,
  EmailData,
  EmailDetail,
  EmailListItem,
  EmailStatus,
  EmailViewType,
  NotificationType,
  PaginationMetadata,
  ResponseType,
  UserNotificationType,
} from '@/lib/types';
import { currentUser } from './user';
import { LIST_LIMIT } from '@/lib/const';
import { chatListForEmail } from './chat';
import { getEMailSubscribers } from './notification';

function processBase64Data(base64String: string) {
  // Remove data URL prefix if present
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;

  // Convert to ArrayBuffer
  const buffer = Buffer.from(base64Data, 'base64');
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  // Now you can work with the ArrayBuffer
  // Example: create a Uint8Array view
  const uint8Array = new Uint8Array(arrayBuffer);

  return uint8Array; // or return arrayBuffer directly
}

const handleEmailReferences = async (
  referencesMailIds: string[],
  emailId: number,
  emailStrippedText: string,
  emailSubject: string
) => {
  if (referencesMailIds.length > 0) {
    const supabase = await createSupabaseAdminServerClient();
    console.log(`⏳Saving email references⏳`);
    const { data: referencedEmails, error: referencedEmailsError } =
      await supabase
        .from('emails')
        .select('id, references_mail_ids')
        .in('mail_id', referencesMailIds);

    if (referencedEmailsError) {
      console.error(
        '❌Error getting referenced emails:❌',
        referencedEmailsError
      );
    }

    const { error: referenceError } = await supabase
      .from('email_references')
      .insert(
        referencedEmails?.map((email) => ({
          email_id: emailId,
          referenced_email_id: email.id,
        })) ?? []
      );

    await supabase.from('email_activity_logs').insert(
      referencedEmails?.map((email) => ({
        email_id: email.id,
        type: NotificationType.REPLY_RECEIVED,
        metadata: {
          referenced_email_id: emailId,
        },
      })) ?? []
    );

    await supabase.from('emails').update({ is_reply: true }).eq('id', emailId);

    const firstEmailId = referencedEmails?.reduce((minEmail, currentEmail) => {
      if (
        !minEmail ||
        currentEmail.references_mail_ids.length <
          minEmail.references_mail_ids.length
      ) {
        return currentEmail;
      }
      return minEmail;
    }, null as (typeof referencedEmails)[0] | null)?.id;

    if (referenceError) {
      console.error('❌Error saving email references:❌', referenceError);
    }
    if (firstEmailId) {
      await supabase
        .from('emails')
        .update({ list_text: emailStrippedText, subject: emailSubject })
        .eq('id', firstEmailId);
    }
    console.log(`✅Email references saved✅`);
  }
};

const handleEmailStatus = async (
  emailId: number,
  allMembers: { id: number }[]
) => {
  const supabase = await createSupabaseAdminServerClient();
  console.log(`⏳Saving user email status⏳`);
  const { error: userEmailStatusError } = await supabase
    .from('user_email_status')
    .insert(
      allMembers?.map((member) => ({
        email_id: emailId,
        user_profile_id: member.id,
        is_read: false,
      })) ?? []
    );

  if (userEmailStatusError) {
    console.error('❌Error saving user email status:❌', userEmailStatusError);
  }
  console.log(`✅User email status saved✅`);
};

const handleEmailAttachments = async (
  attachments: {
    Name: string;
    Content: string;
    ContentType: string;
    ContentLength: number;
    ContentID: string;
  }[],
  orgName: string,
  sharedInboxName: string,
  emailId: number
) => {
  const fileData: { path: string; cid: string; name: string }[] = [];
  const supabase = await createSupabaseAdminServerClient();

  // Upload all attachments in parallel
  const uploadPromises = attachments.map((attachment) =>
    supabase.storage
      .from('attachments')
      .upload(
        `${orgName}/${sharedInboxName}/${new Date().getTime()}-${
          attachment.Name
        }`,
        processBase64Data(attachment.Content)
      )
  );

  const uploadResults = await Promise.all(uploadPromises);

  // Process results based on array position
  uploadResults.forEach((result, index) => {
    const { data: attachmentData, error: attachmentError } = result;
    const attachment = attachments[index];

    if (attachmentError) {
      console.error(
        '❌Error saving email attachment:❌',
        attachmentError.message
      );
    }
    if (attachmentData) {
      fileData.push({
        path: attachmentData.path,
        cid: attachment.ContentID,
        name: attachment.Name,
      });
    }
  });

  const { error: updateError } = await supabase
    .from('email_attachments')
    .insert(
      fileData.map((file) => ({
        attachment_path: file.path,
        cid: file.cid,
        email_id: emailId,
        original_name: file.name,
      }))
    );

  if (updateError) {
    console.error('❌Error saving email attachments to table:❌', updateError);
  }

  return fileData;
};

export const saveEmail = async (email: EmailData) => {
  console.log('⏳Started workflow for saving email⏳');
  const supabase = await createSupabaseAdminServerClient();
  console.log('🔄Getting shared inbox🔄');
  const { data: sharedInbox, error: sharedInboxError } = await supabase
    .from('shared_inboxes')
    .select(
      'id, email_alias, organization_id, name, organization:organizations(name)'
    )
    .eq('email_alias', email.aliasEmail)
    .single();

  if (sharedInboxError) {
    console.error('Error getting shared inbox:', sharedInboxError);
    return;
  }

  const { data: allMembers, error: allMembersError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('organization_id', sharedInbox.organization_id);

  if (allMembersError) {
    console.error('Error getting all members:', allMembersError);
    return;
  }

  console.log(`✅shared inbox: ${sharedInbox.email_alias}✅`);
  console.log(`⏳Saving email⏳`);
  const { data: emailData, error } = await supabase
    .from('emails')
    .insert({
      alias_email: email.aliasEmail,
      body_html: email.bodyHtml,
      body_plain: email.bodyPlain,
      cc_emails: email.ccs.map((cc) =>
        cc.name ? `${cc.name} <${cc.email}>` : cc.email
      ),
      send_at: new Date(email.timestamp).toISOString(),
      from_email: email.fromEmail,
      from_name: email.fromName,
      mail_id: email.messageId,
      references_mail_ids: email.referencesMailIds,
      reply_to_mail_id: email.replyToMessageId || null,
      shared_inbox_id: sharedInbox.id,
      subject: email.subject,
      stripped_text: email.strippedText,
      to_emails: email.to.map((to) =>
        to.name ? `${to.name} <${to.email}>` : to.email
      ),
      reply_to: email.replyToEmail,
      created_at: new Date().toISOString(),
      status: EmailStatus.TODO,
      assignee: null,
      organization_id: sharedInbox.organization_id,
      attachments: email.attachmentCount,
      is_spam: email.spamStatus,
      list_text: email.strippedText,
    })
    .select('id')
    .single();

  if (error) {
    console.error('❌Error saving email:❌', error);
    return;
  }
  console.log(`✅Email saved: ${emailData.id}✅`);

  await handleEmailAttachments(
    email.attachments,
    sharedInbox.organization.name,
    sharedInbox.name!,
    emailData.id
  );

  await handleEmailReferences(
    email.referencesMailIds,
    emailData.id,
    email.strippedText,
    email.subject
  );

  // need status only for parent emails
  if (!email.referencesMailIds.length) {
    await handleEmailStatus(emailData.id, allMembers);
  }

  console.log(`🌟Email saved successfully🌟`);
};

export const emailList = async ({
  inboxId,
  view,
  page,
  search,
}: {
  inboxId: number;
  view: EmailViewType;
  page: number;
  search: string;
}): Promise<{
  data: EmailListItem[];
  metadata: PaginationMetadata;
}> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      data: [],
      metadata: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
      },
    };
  }

  const query = supabase
    .from('emails')
    .select(
      `
      id,
      from_email,
      from_name,
      subject,
      stripped_text,
      send_at,
      list_text,
      references_mail_ids,
      status,
      shared_inbox_id,
      user_email_status!inner(is_read, is_bookmarked, is_subscribed),
      assignee:user_profiles(id, first_name, last_name, image_url),
      is_starred,
      is_archived,
      is_spam,
      email_labels(
        label:labels(
          id,
          name,
          color
        )
      ),
      reference_count: email_references!referenced_email_id(count),
      replied
    `,
      { count: 'exact' }
    )
    .not('is_reply', 'is', true)
    .eq('shared_inbox_id', inboxId)
    .eq('user_email_status.user_profile_id', user.profileId)
    .order('send_at', { ascending: false });

  if (view === 'archived') {
    query.eq('is_archived', true);
  } else if (view === 'starred') {
    query.eq('is_starred', true);
  } else if (view === 'inbox') {
    query.eq('is_archived', false).eq('is_spam', false);
  } else if (view === 'spam') {
    query.eq('is_spam', true);
  }

  if (search) {
    query.or(`subject.ilike.%${search}%,stripped_text.ilike.%${search}%`);
  }

  const { count, error: countError } = await query;

  const { data, error } = await query.range(
    (page - 1) * LIST_LIMIT,
    page * LIST_LIMIT - 1
  );

  if (error || countError) {
    return {
      data: [],
      metadata: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
      },
    };
  }

  const totalPages = Math.ceil((count || 0) / LIST_LIMIT);

  return {
    data: data.map((email) => ({
      ...email,
      user_email_status: email.user_email_status[0],
      reference_count: email.reference_count[0]?.count || 0,
    })),
    metadata: {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      totalItems: count || 0,
      currentPage: page,
    },
  };
};

export const myEmailList = async ({
  page,
  search,
}: {
  page: number;
  search: string;
}): Promise<{ data: EmailListItem[]; metadata: PaginationMetadata }> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      data: [],
      metadata: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
      },
    };
  }
  const query = supabase
    .from('emails')
    .select(
      `
    id,
    from_email,
    from_name,
    subject,
    stripped_text,
    send_at,
    list_text,
    references_mail_ids,
    status,
    shared_inbox_id,
    user_email_status!inner(is_read, is_bookmarked, is_subscribed),
    assignee:user_profiles(id, first_name, last_name, image_url),
    is_starred,
    is_archived,
    is_spam,
    email_labels(
      label:labels(
        id,
        name,
        color
      )
    ),
    reference_count: email_references!referenced_email_id(count),
    replied
  `,
      { count: 'exact' }
    )
    .not('replied', 'is', true)
    .eq('user_email_status.user_profile_id', user.profileId)
    .eq('assignee', user.profileId)
    .order('send_at', { ascending: false });

  if (search) {
    query.or(`subject.ilike.%${search}%,stripped_text.ilike.%${search}%`);
  }

  const { count, error: countError } = await query;

  const { data, error } = await query.range(
    (page - 1) * LIST_LIMIT,
    page * LIST_LIMIT - 1
  );

  if (error || countError) {
    return {
      data: [],
      metadata: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
      },
    };
  }
  const totalPages = Math.ceil((count || 0) / LIST_LIMIT);

  return {
    data: data.map((email) => ({
      ...email,
      user_email_status: email.user_email_status[0],
      reference_count: email.reference_count[0]?.count || 0,
    })),
    metadata: {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      totalItems: count || 0,
      currentPage: page,
    },
  };
};

export const toggleEmailReadStatus = async ({
  emailId,
  status,
}: {
  emailId: number;
  status: boolean;
}): Promise<ActionResponse> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }
  const { error } = await supabase
    .from('user_email_status')
    .update({ is_read: status })
    .eq('email_id', emailId)
    .eq('user_profile_id', user.profileId);

  if (error) {
    return {
      message: 'Error updating email read status',
      type: ResponseType.ERROR,
    };
  }
  return {
    message: 'Email read status updated',
    type: ResponseType.SUCCESS,
  };
};

export const emailDetails = async ({
  emailId,
}: {
  emailId: number;
}): Promise<{ email: EmailDetail | null; activities: Activity[] }> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      email: null,
      activities: [],
    };
  }
  const { data, error } = await supabase
    .from('emails')
    .select(
      `
      *,
      assignee:user_profiles(id, first_name, last_name, image_url),
      user_email_status!inner(is_read, is_bookmarked, is_subscribed),
      email_labels(
      label:labels(
        id,
        name,
        color
      )
    ),
    email_attachments(
      attachment_path,
      cid,
      original_name
    ),
    attachments,
    mail_id
    `
    )
    .eq('id', emailId)
    .eq('user_email_status.user_profile_id', user.profileId)
    .single();

  if (error) {
    return {
      email: null,
      activities: [],
    };
  }

  if (!data.user_email_status[0].is_read) {
    toggleEmailReadStatus({
      emailId,
      status: true,
    });
  }

  // get the last email where reference emails contains mailId
  const { data: referenceEmails } = await supabase
    .from('emails')
    .select('mail_id,references_mail_ids,send_at,subject')
    .contains('references_mail_ids', [data.mail_id])
    .order('send_at', { ascending: false })
    .limit(1);

  const lastReferenceEmail = referenceEmails?.[0];

  const updatedReferences = lastReferenceEmail
    ? [
        ...(lastReferenceEmail.references_mail_ids || []),
        lastReferenceEmail.mail_id,
      ]
    : [...(data.references_mail_ids || []), data.mail_id];

  const activities = await emailActivityLogs({ emailId });

  return {
    email: {
      ...data,
      user_email_status: data.user_email_status[0],
      replyData: {
        replyTo: lastReferenceEmail?.mail_id || data.mail_id,
        references: updatedReferences,
      },
      ...(lastReferenceEmail
        ? {
            updatedSubject: lastReferenceEmail.subject,
          }
        : {}),
    },
    activities,
  };
};

export const updateEmailStatus = async ({
  emailId,
  status,
  oldStatus,
}: {
  emailId: number;
  status: EmailStatus;
  oldStatus: EmailStatus;
}) => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }
  const { error } = await supabase
    .from('emails')
    .update({ status })
    .eq('id', emailId)
    .select('shared_inbox_id')
    .single();

  if (error) {
    return {
      message: 'Error updating email status',
      type: ResponseType.ERROR,
    };
  }

  await supabase.from('email_activity_logs').insert({
    email_id: emailId,
    user_profile_id: user.profileId,
    type: NotificationType.STATUS_UPDATE,
    metadata: {
      new_status: status,
      old_status: oldStatus,
    },
  });

  return {
    message: 'Email status updated',
    type: ResponseType.SUCCESS,
  };
};

export const updateEmailAssignee = async ({
  emailId,
  assigneeId,
}: {
  emailId: number;
  assigneeId?: number;
  assigneeName?: string;
  assigneeImageUrl?: string | null;
}) => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }
  const { error } = await supabase
    .from('emails')
    .update({ assignee: assigneeId || null })
    .eq('id', emailId)
    .select('shared_inbox_id')
    .single();

  if (error) {
    return {
      message: 'Error updating email assignee',
      type: ResponseType.ERROR,
    };
  }

  // assignee must follow email
  const emailSubscribers = await getEMailSubscribers(emailId);

  const emailSubscribersExceptMe = emailSubscribers.filter(
    (subscriber) => subscriber !== user.profileId
  );

  if (assigneeId) {
    await supabase
      .from('user_email_status')
      .update({
        is_subscribed: true,
      })
      .eq('email_id', emailId)
      .eq('user_profile_id', assigneeId);

    // if assigned add notification to assignee

    await supabase.from('notifications').insert(
      emailSubscribersExceptMe.map((subscriber) => ({
        email_id: emailId,
        notification_for: subscriber,
        event_type: UserNotificationType.ASSIGNED,
        metadata: {
          assigned_to: assigneeId,
        },
        action_by: user.profileId,
      }))
    );
  } else {
    // add notification for previous assignee

    await supabase.from('notifications').insert(
      emailSubscribersExceptMe.map((subscriber) => ({
        email_id: emailId,
        notification_for: subscriber,
        event_type: UserNotificationType.UNASSIGNED,
        metadata: {},
        action_by: user.profileId,
      }))
    );
  }

  await supabase.from('email_activity_logs').insert({
    email_id: emailId,
    user_profile_id: user.profileId,
    type: assigneeId
      ? NotificationType.ASSIGNED_TO
      : NotificationType.REMOVE_ASSIGNEE,
    metadata: assigneeId
      ? {
          assigned_to: assigneeId,
        }
      : {},
  });

  return {
    message: 'Email assignee updated',
    type: ResponseType.SUCCESS,
  };
};

export const toggleEmailArchive = async ({
  emailId,
  archive,
}: {
  emailId: number;
  archive: boolean;
}): Promise<ActionResponse> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }
  const { error } = await supabase
    .from('emails')
    .update({
      is_archived: archive,
      ...(archive ? { is_spam: false } : {}),
    })
    .eq('id', emailId)
    .select('shared_inbox_id')
    .single();

  if (error) {
    return {
      message: 'Error updating email archive',
      type: ResponseType.ERROR,
    };
  }

  await supabase.from('email_activity_logs').insert({
    email_id: emailId,
    user_profile_id: user.profileId,
    type: archive ? NotificationType.ARCHIVED : NotificationType.UN_ARCHIVED,
    metadata: {},
  });

  return {
    message: 'Email archive updated',
    type: ResponseType.SUCCESS,
  };
};

export const toggleEmailStar = async ({
  emailId,
  star,
}: {
  emailId: number;
  star: boolean;
}): Promise<ActionResponse> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }
  const { error } = await supabase
    .from('emails')
    .update({ is_starred: star })
    .eq('id', emailId)
    .select('shared_inbox_id')
    .single();

  if (error) {
    return {
      message: 'Error updating email starred',
      type: ResponseType.ERROR,
    };
  }

  await supabase.from('email_activity_logs').insert({
    email_id: emailId,
    user_profile_id: user.profileId,
    type: star ? NotificationType.STARRED : NotificationType.UN_STARRED,
    metadata: {},
  });

  return {
    message: 'Email starred updated',
    type: ResponseType.SUCCESS,
  };
};

async function allExternalEmailReplies(allReferencedEmailIds: number[]) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('emails')
    .select(
      `
        id,
        subject,
        from_email,
        from_name,
        to_emails,
        send_at,
        body_html,
        body_plain,
        stripped_text
    `
    )
    .in('id', allReferencedEmailIds);

  if (error) {
    return [];
  }

  // Flatten the result to just the email details
  const allExternalEmails: {
    id: number;
    subject: string;
    from_email: string;
    from_name: string;
    to_email: string;
    send_at: string;
    html: string;
  }[] = [];
  for (const email of data) {
    allExternalEmails.push({
      id: email.id,
      subject: email.subject,
      from_email: email.from_email,
      from_name: email.from_name,
      to_email: email.to_emails?.join(', '),
      send_at: email.send_at,
      html: email.body_html || email.body_plain || '',
    });
  }

  return allExternalEmails;
}

export const emailActivityLogs = async ({
  emailId,
}: {
  emailId: number;
}): Promise<Activity[]> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('email_activity_logs')
    .select(
      `
      id,
      created_at,
      type,
      metadata,
      user:user_profiles(id, first_name, last_name, image_url)
    `
    )
    .eq('email_id', emailId)
    .order('created_at', { ascending: true });

  const allInternalChats = await chatListForEmail({ mailId: emailId });

  const allReferencedEmailIds =
    data
      ?.filter((item) => item.type === NotificationType.REPLY_RECEIVED)
      .map(
        (item) =>
          (item.metadata as { referenced_email_id: number }).referenced_email_id
      ) ?? [];

  const allReplyEmailIds =
    data
      ?.filter((item) => item.type === NotificationType.REPLY_SENT)
      .map(
        (item) =>
          (item.metadata as { referenced_email_id: number }).referenced_email_id
      ) ?? [];

  const externalEmails = await allExternalEmailReplies(allReferencedEmailIds);
  const replyEmails = await allExternalEmailReplies(allReplyEmailIds);

  const allAssigneeIds =
    data
      ?.filter((item) => item.type === NotificationType.ASSIGNED_TO)
      .map((item) => (item.metadata as { assigned_to: number }).assigned_to) ??
    [];

  const { data: profileData } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, image_url')
    .in('id', allAssigneeIds);

  const modifiedData = data?.map((item) => {
    if (item.type === NotificationType.ADD_CHAT) {
      const chat = allInternalChats?.find(
        (chat) =>
          chat.id === (item.metadata as { message_id: number }).message_id
      );
      return {
        ...item,
        metadata: {
          message_id: (item.metadata as { message_id: number }).message_id,
          message: chat?.message,
          sender: chat?.user_profiles,
          sentAt: chat?.created_at,
        },
      };
    } else if (item.type === NotificationType.ASSIGNED_TO) {
      const assignee = profileData?.find(
        (profile) =>
          profile.id === (item.metadata as { assigned_to: number }).assigned_to
      );

      return {
        ...item,
        metadata: {
          assignee_name: `${assignee?.first_name} ${assignee?.last_name}`,
          assignee_image_url: assignee?.image_url,
          assignee_id: assignee?.id,
        },
      };
    } else if (item.type === NotificationType.REPLY_RECEIVED) {
      const externalEmailData = externalEmails.find(
        (email) =>
          email.id ===
          (item.metadata as { referenced_email_id: number }).referenced_email_id
      );
      return {
        ...item,
        metadata: {
          ...(item.metadata as {}),
          ...externalEmailData,
        },
      };
    } else if (item.type === NotificationType.REPLY_SENT) {
      const replyEmail = replyEmails.find(
        (email) =>
          email.id ===
          (item.metadata as { referenced_email_id: number }).referenced_email_id
      );
      return {
        ...item,
        metadata: {
          ...(item.metadata as {}),
          ...replyEmail,
          reply: true,
        },
      };
    }
    return item;
  });

  if (error) {
    return [];
  }

  return modifiedData || [];
};

export const toggleEmailSpam = async ({
  emailId,
  spam,
}: {
  emailId: number;
  spam: boolean;
}): Promise<ActionResponse> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      message: 'User not found',
      type: ResponseType.ERROR,
    };
  }

  const { error } = await supabase
    .from('emails')
    .update({
      is_spam: spam,
      ...(spam ? { is_archived: false } : {}),
    })
    .eq('id', emailId)
    .select('shared_inbox_id')
    .single();

  if (error) {
    return {
      message: 'Error updating email spam',
      type: ResponseType.ERROR,
    };
  }

  return {
    message: 'Email spam updated',
    type: ResponseType.SUCCESS,
  };
};

export const bookmarkedEmailList = async ({
  page,
  search,
}: {
  page: number;
  search: string;
}): Promise<{ data: EmailListItem[]; metadata: PaginationMetadata }> => {
  const supabase = await createSupabaseServerClient();
  const user = await currentUser();
  if (!user) {
    return {
      data: [],
      metadata: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
      },
    };
  }
  const query = supabase
    .from('emails')
    .select(
      `
    id,
    from_email,
    from_name,
    subject,
    stripped_text,
    send_at,
    list_text,
    references_mail_ids,
    status,
    shared_inbox_id,
    user_email_status!inner(is_read, is_bookmarked, is_subscribed),
    assignee:user_profiles(id, first_name, last_name, image_url),
    is_starred,
    is_archived,
    is_spam,
    email_labels(
      label:labels(
        id,
        name,
        color
      )
    ),
    reference_count: email_references!referenced_email_id(count),
    replied
  `,
      { count: 'exact' }
    )
    .not('replied', 'is', true)
    .eq('user_email_status.user_profile_id', user.profileId)
    .eq('user_email_status.is_bookmarked', true)
    .order('send_at', { ascending: false });

  if (search) {
    query.or(`subject.ilike.%${search}%,stripped_text.ilike.%${search}%`);
  }

  const { count, error: countError } = await query;

  const { data, error } = await query.range(
    (page - 1) * LIST_LIMIT,
    page * LIST_LIMIT - 1
  );

  if (error || countError) {
    return {
      data: [],
      metadata: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 0,
        totalItems: 0,
        currentPage: page,
      },
    };
  }
  const totalPages = Math.ceil((count || 0) / LIST_LIMIT);

  return {
    data: data.map((email) => ({
      ...email,
      user_email_status: email.user_email_status[0],
      reference_count: email.reference_count[0]?.count || 0,
    })),
    metadata: {
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalPages,
      totalItems: count || 0,
      currentPage: page,
    },
  };
};
