export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      domains: {
        Row: {
          created_at: string | null
          created_by: number
          domain: string
          domain_id: string
          id: number
          organization_id: number
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by: number
          domain: string
          domain_id: string
          id?: never
          organization_id: number
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: number
          domain?: string
          domain_id?: string
          id?: never
          organization_id?: number
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_activity_logs: {
        Row: {
          created_at: string
          email_id: number
          id: number
          metadata: Json | null
          type: Database["public"]["Enums"]["notification_type"]
          user_profile_id: number | null
        }
        Insert: {
          created_at?: string
          email_id: number
          id?: never
          metadata?: Json | null
          type: Database["public"]["Enums"]["notification_type"]
          user_profile_id?: number | null
        }
        Update: {
          created_at?: string
          email_id?: number
          id?: never
          metadata?: Json | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_activity_logs_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_activity_logs_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_aliases: {
        Row: {
          address: string
          created_at: string | null
          created_by: number
          display_name: string | null
          domain_id: number
          id: number
        }
        Insert: {
          address: string
          created_at?: string | null
          created_by: number
          display_name?: string | null
          domain_id: number
          id?: never
        }
        Update: {
          address?: string
          created_at?: string | null
          created_by?: number
          display_name?: string | null
          domain_id?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "email_aliases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_aliases_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      email_attachments: {
        Row: {
          attachment_path: string
          cid: string
          created_at: string | null
          email_id: number
          id: number
        }
        Insert: {
          attachment_path: string
          cid: string
          created_at?: string | null
          email_id: number
          id?: never
        }
        Update: {
          attachment_path?: string
          cid?: string
          created_at?: string | null
          email_id?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_labels: {
        Row: {
          email_id: number
          label_id: number
        }
        Insert: {
          email_id: number
          label_id: number
        }
        Update: {
          email_id?: number
          label_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_labels_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
        ]
      }
      email_references: {
        Row: {
          email_id: number
          id: number
          referenced_email_id: number
        }
        Insert: {
          email_id: number
          id?: number
          referenced_email_id: number
        }
        Update: {
          email_id?: number
          id?: number
          referenced_email_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "email_references_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_references_referenced_email_id_fkey"
            columns: ["referenced_email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          alias_email: string
          assignee: number | null
          attachments: number
          body_html: string | null
          body_plain: string | null
          cc_email: string[] | null
          created_at: string | null
          from_email: string
          id: number
          is_archived: boolean
          is_reply: boolean
          is_spam: boolean
          is_starred: boolean
          mail_id: string
          organization_id: number | null
          references_mail_ids: string[]
          replied: boolean
          reply_to: string | null
          reply_to_mail_id: string | null
          send_at: string
          shared_inbox_id: number
          status: Database["public"]["Enums"]["EmailStatus"]
          stripped_html: string | null
          stripped_signature: string | null
          stripped_text: string | null
          subject: string
          to_email: string
        }
        Insert: {
          alias_email: string
          assignee?: number | null
          attachments?: number
          body_html?: string | null
          body_plain?: string | null
          cc_email?: string[] | null
          created_at?: string | null
          from_email: string
          id?: number
          is_archived?: boolean
          is_reply?: boolean
          is_spam?: boolean
          is_starred?: boolean
          mail_id: string
          organization_id?: number | null
          references_mail_ids?: string[]
          replied?: boolean
          reply_to?: string | null
          reply_to_mail_id?: string | null
          send_at: string
          shared_inbox_id: number
          status?: Database["public"]["Enums"]["EmailStatus"]
          stripped_html?: string | null
          stripped_signature?: string | null
          stripped_text?: string | null
          subject: string
          to_email: string
        }
        Update: {
          alias_email?: string
          assignee?: number | null
          attachments?: number
          body_html?: string | null
          body_plain?: string | null
          cc_email?: string[] | null
          created_at?: string | null
          from_email?: string
          id?: number
          is_archived?: boolean
          is_reply?: boolean
          is_spam?: boolean
          is_starred?: boolean
          mail_id?: string
          organization_id?: number | null
          references_mail_ids?: string[]
          replied?: boolean
          reply_to?: string | null
          reply_to_mail_id?: string | null
          send_at?: string
          shared_inbox_id?: number
          status?: Database["public"]["Enums"]["EmailStatus"]
          stripped_html?: string | null
          stripped_signature?: string | null
          stripped_text?: string | null
          subject?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_assignee_fkey"
            columns: ["assignee"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_shared_inbox_id_fkey"
            columns: ["shared_inbox_id"]
            isOneToOne: false
            referencedRelation: "shared_inboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_message_mentions: {
        Row: {
          created_at: string | null
          id: number
          internal_message_id: number
          user_profile_id: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          internal_message_id: number
          user_profile_id: number
        }
        Update: {
          created_at?: string | null
          id?: never
          internal_message_id?: number
          user_profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "internal_message_mentions_internal_message_id_fkey"
            columns: ["internal_message_id"]
            isOneToOne: false
            referencedRelation: "internal_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_message_mentions_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_messages: {
        Row: {
          created_at: string | null
          email_id: number
          id: number
          message: string
          sender_id: number | null
        }
        Insert: {
          created_at?: string | null
          email_id: number
          id?: number
          message: string
          sender_id?: number | null
        }
        Update: {
          created_at?: string | null
          email_id?: number
          id?: number
          message?: string
          sender_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_messages_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_messages_sender_profile_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string
          id: number
          organization_id: number
          role: Database["public"]["Enums"]["Role"]
          status: Database["public"]["Enums"]["InvitationStatus"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          organization_id: number
          role?: Database["public"]["Enums"]["Role"]
          status?: Database["public"]["Enums"]["InvitationStatus"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          organization_id?: number
          role?: Database["public"]["Enums"]["Role"]
          status?: Database["public"]["Enums"]["InvitationStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          color: string
          created_at: string | null
          created_by: number
          id: number
          name: string
          organization_id: number
        }
        Insert: {
          color: string
          created_at?: string | null
          created_by: number
          id?: never
          name: string
          organization_id: number
        }
        Update: {
          color?: string
          created_at?: string | null
          created_by?: number
          id?: never
          name?: string
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "labels_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_by: number
          created_at: string
          email_id: number
          event_type: Database["public"]["Enums"]["user_notification_type"]
          id: number
          is_read: boolean
          metadata: Json
          notification_for: number
        }
        Insert: {
          action_by: number
          created_at?: string
          email_id: number
          event_type: Database["public"]["Enums"]["user_notification_type"]
          id?: number
          is_read?: boolean
          metadata: Json
          notification_for: number
        }
        Update: {
          action_by?: number
          created_at?: string
          email_id?: number
          event_type?: Database["public"]["Enums"]["user_notification_type"]
          id?: number
          is_read?: boolean
          metadata?: Json
          notification_for?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_action_by_fkey"
            columns: ["action_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_profile_id_fkey"
            columns: ["notification_for"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          created_by: number | null
          id: number
          industry: string | null
          name: string
          size: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          id?: number
          industry?: string | null
          name: string
          size?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          id?: number
          industry?: string | null
          name?: string
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_inboxes: {
        Row: {
          created_at: string
          created_by: number
          email_alias: string
          forwarding_email: string
          id: number
          name: string
          organization_id: number
        }
        Insert: {
          created_at?: string
          created_by: number
          email_alias: string
          forwarding_email: string
          id?: number
          name: string
          organization_id: number
        }
        Update: {
          created_at?: string
          created_by?: number
          email_alias?: string
          forwarding_email?: string
          id?: number
          name?: string
          organization_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "shared_inboxes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_inboxes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_email_status: {
        Row: {
          email_id: number
          id: number
          is_bookmarked: boolean
          is_read: boolean
          is_subscribed: boolean
          user_profile_id: number
        }
        Insert: {
          email_id: number
          id?: number
          is_bookmarked?: boolean
          is_read?: boolean
          is_subscribed?: boolean
          user_profile_id: number
        }
        Update: {
          email_id?: number
          id?: number
          is_bookmarked?: boolean
          is_read?: boolean
          is_subscribed?: boolean
          user_profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_email_status_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_email_status_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: number
          image_url: string | null
          job_title: string | null
          last_name: string
          onboarded: boolean
          organization_id: number | null
          role: Database["public"]["Enums"]["Role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: number
          image_url?: string | null
          job_title?: string | null
          last_name: string
          onboarded: boolean
          organization_id?: number | null
          role?: Database["public"]["Enums"]["Role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: number
          image_url?: string | null
          job_title?: string | null
          last_name?: string
          onboarded?: boolean
          organization_id?: number | null
          role?: Database["public"]["Enums"]["Role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      EmailStatus:
        | "Todo"
        | "Done"
        | "In Progress"
        | "In Review"
        | "Drafting Reply"
      InvitationStatus: "Accepted" | "Pending"
      notification_type:
        | "Add Tags"
        | "Remove Tag"
        | "Add Chat"
        | "Assigned To"
        | "Status Update"
        | "Starred"
        | "Archived"
        | "Un Archived"
        | "Un Starred"
        | "Subscribed"
        | "Un Subscribed"
        | "Reply Received"
        | "Reply Sent"
        | "Remove Assignee"
      Role: "Admin" | "Member"
      user_notification_type:
        | "Assigned"
        | "Unassigned"
        | "Mentioned"
        | "Replied"
        | "Commented"
        | "Reply Received"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      EmailStatus: [
        "Todo",
        "Done",
        "In Progress",
        "In Review",
        "Drafting Reply",
      ],
      InvitationStatus: ["Accepted", "Pending"],
      notification_type: [
        "Add Tags",
        "Remove Tag",
        "Add Chat",
        "Assigned To",
        "Status Update",
        "Starred",
        "Archived",
        "Un Archived",
        "Un Starred",
        "Subscribed",
        "Un Subscribed",
        "Reply Received",
        "Reply Sent",
        "Remove Assignee",
      ],
      Role: ["Admin", "Member"],
      user_notification_type: [
        "Assigned",
        "Unassigned",
        "Mentioned",
        "Replied",
        "Commented",
        "Reply Received",
      ],
    },
  },
} as const
