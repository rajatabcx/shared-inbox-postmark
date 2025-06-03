export enum ResponseType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}

export type ActionResponse = {
  type: ResponseType;
  message: string;
  data?: any;
};

export enum UserRole {
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export type UserRoleType = 'Admin' | 'Member';

export enum InvitationStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
}

export type InvitationStatusType = 'Pending' | 'Accepted';

export type PaginationMetadata = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

export type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string | null;
};

export interface DomainData {
  id: number;
  domain: string;
  verified: boolean;
  created_by: number;
  organization_id: number;
  domain_id: number;
  created_at: string;

  // Duplicate or alias fields (preserved for completeness)
  ID: number;
  Name: string;

  // SPF (Sender Policy Framework) fields
  SPFVerified: boolean;
  SPFHost: string;
  SPFTextValue: string;

  // DKIM (DomainKeys Identified Mail) fields
  DKIMVerified: boolean;
  WeakDKIM: boolean;
  DKIMHost: string;
  DKIMTextValue: string;
  DKIMPendingHost: string;
  DKIMPendingTextValue: string;
  DKIMRevokedHost: string;
  DKIMRevokedTextValue: string;
  SafeToRemoveRevokedKeyFromDNS: boolean;
  DKIMUpdateStatus: string; // enum preferred if known

  // Return-Path domain verification
  ReturnPathDomain: string;
  ReturnPathDomainVerified: boolean;
  ReturnPathDomainCNAMEValue: string;
}
export type EmailViewType = 'inbox' | 'all' | 'archived' | 'starred' | 'spam';
export enum EmailView {
  INBOX = 'inbox',
  ALL = 'all',
  ARCHIVED = 'archived',
  STARRED = 'starred',
  SPAM = 'spam',
}

export enum EmailStatus {
  TODO = 'Todo',
  DONE = 'Done',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  DRAFTING_REPLY = 'Drafting Reply',
}

export type EmailListItem = {
  id: number;
  from_email: string | null;
  from_name: string | null;
  subject: string;
  stripped_text: string | null;
  list_text: string;
  send_at: string | null;
  references_mail_ids: string[] | null;
  reference_count: number;
  status:
    | 'Todo'
    | 'Done'
    | 'In Progress'
    | 'In Review'
    | 'Drafting Reply'
    | null;
  user_email_status: {
    is_read: boolean;
    is_bookmarked: boolean;
    is_subscribed: boolean;
  };
  shared_inbox_id: number;
  is_starred: boolean;
  is_archived: boolean;
  is_spam: boolean;
  assignee: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  } | null;
  email_labels: {
    label: {
      id: number;
      name: string;
      color: string;
    };
  }[];
  replied: boolean;
};

export enum UserNotificationType {
  ASSIGNED = 'Assigned',
  UNASSIGNED = 'Unassigned',
  MENTIONED = 'Mentioned',
  COMMENTED = 'Commented',
  REPLIED = 'Replied',
  REPLY_RECEIVED = 'Reply Received',
}

export enum NotificationType {
  ADD_TAG = 'Add Tags',
  REMOVE_TAG = 'Remove Tag',
  ADD_CHAT = 'Add Chat',
  ASSIGNED_TO = 'Assigned To',
  REMOVE_ASSIGNEE = 'Remove Assignee',
  STATUS_UPDATE = 'Status Update',
  STARRED = 'Starred',
  ARCHIVED = 'Archived',
  UN_ARCHIVED = 'Un Archived',
  UN_STARRED = 'Un Starred',
  SUBSCRIBED = 'Subscribed',
  UNSUBSCRIBED = 'Un Subscribed',
  REPLY_RECEIVED = 'Reply Received',
  REPLY_SENT = 'Reply Sent',
}

export type Activity = {
  id: number;
  created_at: string;
  type: string;
  metadata: any;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    image_url?: string | null;
  } | null;
};

export interface EmailData {
  aliasEmail: string;
  subject: string;
  timestamp: string;
  strippedText: string;
  bodyPlain: string;
  bodyHtml: string;
  replyToMessageId: string;
  replyToEmail: string;
  messageId: string;
  referencesMailIds: string[];
  to: { email: string; name: string }[];
  fromEmail: string;
  fromName: string;
  ccs: { email: string; name: string }[];
  attachments: {
    Name: string;
    Content: string;
    ContentType: string;
    ContentLength: number;
    ContentID: string;
  }[];
  attachmentCount: number;
  spamStatus: boolean;
}

export interface EmailDetail {
  id: number;
  alias_email: string;
  list_text: string;
  body_html: string | null;
  body_plain: string | null;
  cc_emails: string[];
  mail_id: string | null;
  from_email: string | null;
  from_name: string | null;
  references_mail_ids: string[] | null;
  reply_to_mail_id: string | null;
  shared_inbox_id: number;
  subject: string;
  stripped_text: string | null;
  to_emails: string[];
  reply_to: string | null;
  created_at: string | null;
  replied: boolean | null;
  status:
    | 'Todo'
    | 'Done'
    | 'In Progress'
    | 'In Review'
    | 'Drafting Reply'
    | null;
  is_archived: boolean;
  is_starred: boolean;
  is_spam: boolean;
  organization_id: number | null;
  send_at: string | null;

  // Joined fields from related tables
  assignee: {
    id: number;
    first_name: string;
    last_name: string;
    image_url: string | null;
  } | null;

  user_email_status: {
    is_read: boolean;
    is_subscribed: boolean;
    is_bookmarked: boolean;
  };

  email_labels: {
    label: {
      id: number;
      name: string;
      color: string;
    };
  }[];

  email_attachments: {
    attachment_path: string;
    cid: string;
    original_name: string;
    is_embed: boolean;
    signed_url: string | null;
  }[];
  attachments: number;
  replyData: {
    replyTo: string;
    references: string[];
  };
  updatedSubject?: string;
}

export interface InternalChat {
  created_at: string | null;
  email_id: number;
  id: number;
  message: string;
  sender_id: number | null;
  user_profiles: {
    first_name: string;
    last_name: string;
  } | null;
}
