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
