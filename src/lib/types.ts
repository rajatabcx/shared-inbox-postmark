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
