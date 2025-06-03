import { MessageSquare, Users, Zap, Clock } from 'lucide-react';

export const features = [
  'Assign emails to team members',
  'Internal notes and @mentions',
  'Shared email templates',
  'Collision detection',
  'Email scheduling',
  'Custom workflows',
  'Analytics and reporting',
  'Role-based permissions',
];

export const testimonials = [
  {
    quote:
      "Shared Inbox has completely transformed how our customer support team operates. We've reduced response times by 45% and improved customer satisfaction scores.",
    name: 'Alex Morgan',
    title: 'Customer Success Manager',
    company: 'TechCorp',
    initials: 'AM',
  },
  {
    quote:
      "The collaboration features are game-changing. Our team can now work together on complex customer issues without stepping on each other's toes.",
    name: 'Jamie Chen',
    title: 'Operations Director',
    company: 'Innovate Inc',
    initials: 'JC',
  },
  {
    quote:
      'Setting up Shared Inbox was incredibly easy. Within a day, our entire team was up and running with minimal training required.',
    name: 'Sam Taylor',
    title: 'IT Manager',
    company: 'Global Solutions',
    initials: 'ST',
  },
];

export const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for small teams just getting started',
    features: [
      'Up to 3 team members',
      '1 shared inbox',
      'Email templates',
      'Basic reporting',
      '24/7 email support',
    ],
    popular: false,
    buttonText: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$79',
    description: 'Ideal for growing teams with advanced needs',
    features: [
      'Up to 10 team members',
      '3 shared inboxes',
      'Advanced automation',
      'Custom workflows',
      'Priority support',
      'API access',
    ],
    popular: true,
    buttonText: 'Get Started',
  },
  {
    name: 'Enterprise',
    price: '$199',
    description: 'For large organizations with complex requirements',
    features: [
      'Unlimited team members',
      'Unlimited shared inboxes',
      'Advanced security',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantees',
      'Training & onboarding',
    ],
    popular: false,
    buttonText: 'Contact Sales',
  },
];

export const howItWorks = [
  {
    number: '01',
    title: 'Sign Up',
    description:
      'Create your team account in seconds with just an email address.',
  },
  {
    number: '02',
    title: 'Connect Your Inbox',
    description:
      'Link your existing email accounts or create a new shared address.',
  },
  {
    number: '03',
    title: 'Invite Your Team',
    description: 'Add team members and set permissions based on roles.',
  },
  {
    number: '04',
    title: 'Start Collaborating',
    description:
      'Begin managing emails together with powerful collaboration tools.',
  },
];

export const productFeatures = [
  {
    icon: MessageSquare,
    title: 'Unified Communications',
    description:
      'Manage all customer conversations in one place, ensuring nothing falls through the cracks.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Work together seamlessly with internal notes, assignments, and shared drafts.',
  },
  {
    icon: Zap,
    title: 'Automation',
    description:
      'Save time with smart rules, templates, and AI-powered suggestions.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description:
      'Never miss an important message with round-the-clock monitoring and alerts.',
  },
];

export const faqs = [
  {
    question: 'What is a shared inbox?',
    answer:
      'A shared inbox is a collaborative email management solution that allows multiple team members to access, respond to, and manage emails from a single inbox, improving team coordination and customer response times.',
  },
  {
    question: 'How does the pricing work?',
    answer:
      'Our pricing is based on the number of team members and shared inboxes you need. All plans include a 14-day free trial with no credit card required. You can upgrade, downgrade, or cancel at any time.',
  },
  {
    question: 'Can I connect my existing email address?',
    answer:
      'Yes, you can connect your existing email addresses from providers like Gmail, Outlook, or any other IMAP-supported email service. You can also create new email addresses specifically for your shared inbox.',
  },
  {
    question: 'Is there a limit to the number of emails?',
    answer:
      "No, all plans include unlimited emails. We believe you shouldn't have to worry about hitting email limits or paying extra as your communication volume grows.",
  },
  {
    question: 'How secure is my data?',
    answer:
      'We take security seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regular security audits to ensure your data remains protected.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your billing period.",
  },
];

export const comparisonTable = [
  {
    name: 'Team members',
    starter: 'Up to 3',
    pro: 'Up to 10',
    enterprise: 'Unlimited',
  },
  {
    name: 'Shared inboxes',
    starter: '1',
    pro: '3',
    enterprise: 'Unlimited',
  },
  {
    name: 'Email templates',
    starter: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Automation',
    starter: 'Basic',
    pro: 'Advanced',
    enterprise: 'Advanced',
  },
  {
    name: 'API access',
    starter: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Custom integrations',
    starter: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Priority support',
    starter: false,
    pro: true,
    enterprise: true,
  },
];

export const footerLinks = {
  product: [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Integrations', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Roadmap', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Tutorials', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Support Center', href: '#' },
    { name: 'API Reference', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Contact Us', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export const CALL_LINK = 'https://cal.com/rajat-mondal';

export const INDUSTRIES = [
  'Technology',
  'Logistics',
  'Manufacturing',
  'Professional Services',
  'Financial Services',
  'Travel & Hospitality',
  'Healthcare',
  'Retail',
  'Non-profit',
  'Education',
  'Real Estate',
  'Consumer Services',
  'Other',
] as const;

export const COMPANY_SIZES = [
  '1 - 10 employees',
  '11 - 50 employees',
  '51 - 100 employees',
  '101 - 150 employees',
  '151 - 250 employees',
  '251 - 1,000 employees',
  '1,001+ employees',
] as const;

export function getColorForInbox(): string {
  const colors = [
    '#3b82f6', // blue
    '#22c55e', // green
    '#a855f7', // purple
    '#ef4444', // red
    '#eab308', // yellow
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#f97316', // orange
    '#8b5cf6', // violet
    '#14b8a6', // teal
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

export const LIST_LIMIT = 25;

export const darkThemeColors: Record<string, { text: string; bg: string }> = {
  Crimson: {
    text: '#FFDEE9',
    bg: '#70001F',
  },
  Emerald: {
    text: '#D2FFE8',
    bg: '#014D40',
  },
  Sapphire: {
    text: '#DAF4FF',
    bg: '#002E5D',
  },
  Amber: {
    text: '#FFF7D6',
    bg: '#7A4D00',
  },
  Violet: {
    text: '#F0E9FF',
    bg: '#4B0082',
  },
  Cyan: {
    text: '#E0FFFF',
    bg: '#00575B',
  },
  Rose: {
    text: '#FFE5EC',
    bg: '#6B0012',
  },
  Lime: {
    text: '#F4FFD2',
    bg: '#3B5E00',
  },
  Indigo: {
    text: '#E6E8FF',
    bg: '#2C2A72',
  },
  Charcoal: {
    text: '#E2E2E2',
    bg: '#1B1B1B',
  },
};

export const lightThemeColors: Record<string, { text: string; bg: string }> = {
  Crimson: {
    text: '#8B0000',
    bg: '#FFE4E8',
  },
  Emerald: {
    text: '#006B47',
    bg: '#E8F5F0',
  },
  Sapphire: {
    text: '#1E3A8A',
    bg: '#E0F2FE',
  },
  Amber: {
    text: '#92400E',
    bg: '#FEF3C7',
  },
  Violet: {
    text: '#5B21B6',
    bg: '#F3E8FF',
  },
  Cyan: {
    text: '#155E63',
    bg: '#CFFAFE',
  },
  Rose: {
    text: '#9F1239',
    bg: '#FFE4E6',
  },
  Lime: {
    text: '#365314',
    bg: '#F7FEE7',
  },
  Indigo: {
    text: '#3730A3',
    bg: '#E0E7FF',
  },
  Charcoal: {
    text: '#374151',
    bg: '#F9FAFB',
  },
};

export function isValidEmail(email: string): boolean {
  const match = email.match(/<([^>]+)>/);
  const emailToValidate = match ? match[1] : email.trim();

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(emailToValidate);
}

export function getDistinctEmails(
  toEmails: string[],
  replyTo: string | null
): string[] {
  // Helper to extract the actual email address
  const extractEmail = (input: string) => {
    const match = input.match(/<([^>]+)>/);
    return match ? match[1].trim() : input.trim();
  };

  const emailMap = new Map<string, string>();

  // Add all toEmails, using the email address as the key
  for (const e of toEmails) {
    const email = extractEmail(e);
    if (!emailMap.has(email)) {
      emailMap.set(email, e);
    }
  }

  // For replyTo, always set/overwrite so its format is preserved
  if (replyTo) {
    const replyToEmail = extractEmail(replyTo);
    emailMap.set(replyToEmail, replyTo);
  }

  return Array.from(emailMap.values());
}

export const MESSAGE_IFRAME_ROOT_ID = 'replyas-root';
export const MESSAGE_IFRAME_BLOCKQUOTE_ID = 'replyas-blockquote';
export const MESSAGE_IFRAME_TOGGLE_ID = 'replyas-toggle';
