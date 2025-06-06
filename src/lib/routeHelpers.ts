// Static Routes
export const routes = {
  // Home/Landing page
  home: () => '/',

  // Authentication routes
  auth: {
    signIn: () => '/auth/sign-in',
    signUp: () => '/auth/sign-up',
    emailSent: () => '/auth/email-sent',
    emailConfirmed: () => '/auth/email-confirmed',
    join: (inviteSlug: string) => `/auth/join/${inviteSlug}`,
  },

  // Onboarding routes
  onboarding: {
    intro: () => '/onboarding/intro',
    invite: () => '/onboarding/invite',
    inbox: () => '/onboarding/inbox',
  },

  // Dashboard routes
  dashboard: {
    root: () => '/dashboard',
    profile: () => '/dashboard/profile',
    members: () => '/dashboard/members',

    // Inbox routes
    inbox: {
      details: (inboxSlug: string) => `/dashboard/inbox/${inboxSlug}`,
      setup: (inboxSlug: string) => `/dashboard/inbox/${inboxSlug}/setup`,
      email: (inboxSlug: string, emailId: string) =>
        `/dashboard/inbox/${inboxSlug}/email/${emailId}`,
    },

    // Other dashboard sections
    notifications: () => '/dashboard/notifications',
    myTickets: () => '/dashboard/my-tickets',
    labels: () => '/dashboard/labels',
    domains: () => '/dashboard/domains',
    domain: (domainId: string) => `/dashboard/domains/${domainId}`,
    bookmarked: () => '/dashboard/bookmarked',
  },

  // API routes
  api: {
    webhook: {
      postmark: () => '/api/webhook/postmark',
    },
  },
} as const;
