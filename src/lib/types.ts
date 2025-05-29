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
  Name: string;
  SPFVerified: boolean;
  SPFHost: string;
  SPFTextValue: string;
  DKIMVerified: boolean;
  WeakDKIM: boolean;
  DKIMHost: string;
  DKIMTextValue: string;
  DKIMPendingHost: string;
  DKIMPendingTextValue: string;
  DKIMRevokedHost: string;
  DKIMRevokedTextValue: string;
  SafeToRemoveRevokedKeyFromDNS: boolean;
  DKIMUpdateStatus: string;
  ReturnPathDomain: string;
  ReturnPathDomainVerified: boolean;
  ReturnPathDomainCNAMEValue: string;
  ID: number;
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
  subject: string;
  stripped_text: string | null;
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
  strippedHtml: string;
  strippedSignature: string;
  bodyPlain: string;
  bodyHtml: string;
  replyToMessageId: string;
  replyToEmail: string;
  messageId: string;
  referencesMailIds: string[];
  dateWithTimezone: string;
  to: string;
  from: string;
  ccEmail: string[];
  attachments: { attachment: File; cid: string }[];
  attachmentCount: number;
}

export interface EmailDetail {
  id: number;
  alias_email: string;
  body_html: string | null;
  body_plain: string | null;
  cc_email: string[] | null;
  mail_id: string | null;
  from_email: string | null;
  references_mail_ids: string[] | null;
  reply_to_mail_id: string | null;
  shared_inbox_id: number;
  subject: string;
  stripped_html: string | null;
  stripped_signature: string | null;
  stripped_text: string | null;
  to_email: string | null;
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
  }[];
  attachments: number;
  replyData: {
    replyTo: string;
    references: string[];
  };
  updatedSubject?: string;
}
