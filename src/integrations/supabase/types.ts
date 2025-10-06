export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      onboarding_responses: {
        Row: {
          age_range: string | null
          brand_colors: string[] | null
          brand_name: string | null
          brand_personality: Json | null
          budget_range: string | null
          challenges: string | null
          competitors: string | null
          created_at: string
          elevator_pitch: string | null
          extra_notes: string | null
          five_year_vision: string | null
          fonts: string[] | null
          gender_focus: string | null
          id: string
          income_level: string | null
          industry: string | null
          inspiration_files: string[] | null
          invoice_blocks: Json | null
          invoice_blocks_edited_at: string | null
          launch_timing: string | null
          likes_dislikes: string | null
          offerings: string | null
          one_year_vision: string | null
          online_link: string | null
          primary_audience: string | null
          problem_solved: string | null
          proposal_blocks: Json | null
          proposal_blocks_edited_at: string | null
          sender_email: string | null
          sender_name: string | null
          session_id: string | null
          tagline: string | null
          updated_at: string
          user_id: string | null
          usp: string | null
        }
        Insert: {
          age_range?: string | null
          brand_colors?: string[] | null
          brand_name?: string | null
          brand_personality?: Json | null
          budget_range?: string | null
          challenges?: string | null
          competitors?: string | null
          created_at?: string
          elevator_pitch?: string | null
          extra_notes?: string | null
          five_year_vision?: string | null
          fonts?: string[] | null
          gender_focus?: string | null
          id?: string
          income_level?: string | null
          industry?: string | null
          inspiration_files?: string[] | null
          invoice_blocks?: Json | null
          invoice_blocks_edited_at?: string | null
          launch_timing?: string | null
          likes_dislikes?: string | null
          offerings?: string | null
          one_year_vision?: string | null
          online_link?: string | null
          primary_audience?: string | null
          problem_solved?: string | null
          proposal_blocks?: Json | null
          proposal_blocks_edited_at?: string | null
          sender_email?: string | null
          sender_name?: string | null
          session_id?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string | null
          usp?: string | null
        }
        Update: {
          age_range?: string | null
          brand_colors?: string[] | null
          brand_name?: string | null
          brand_personality?: Json | null
          budget_range?: string | null
          challenges?: string | null
          competitors?: string | null
          created_at?: string
          elevator_pitch?: string | null
          extra_notes?: string | null
          five_year_vision?: string | null
          fonts?: string[] | null
          gender_focus?: string | null
          id?: string
          income_level?: string | null
          industry?: string | null
          inspiration_files?: string[] | null
          invoice_blocks?: Json | null
          invoice_blocks_edited_at?: string | null
          launch_timing?: string | null
          likes_dislikes?: string | null
          offerings?: string | null
          one_year_vision?: string | null
          online_link?: string | null
          primary_audience?: string | null
          problem_solved?: string | null
          proposal_blocks?: Json | null
          proposal_blocks_edited_at?: string | null
          sender_email?: string | null
          sender_name?: string | null
          session_id?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string | null
          usp?: string | null
        }
        Relationships: []
      }
      portfolio_media: {
        Row: {
          created_at: string
          display_order: number
          file_name: string
          file_size: number | null
          id: string
          is_cover: boolean | null
          media_type: string
          portfolio_id: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          file_name: string
          file_size?: number | null
          id?: string
          is_cover?: boolean | null
          media_type: string
          portfolio_id: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_name?: string
          file_size?: number | null
          id?: string
          is_cover?: boolean | null
          media_type?: string
          portfolio_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_media_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_partners: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          portfolio_id: string | null
          social_link: string | null
          social_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          portfolio_id?: string | null
          social_link?: string | null
          social_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          portfolio_id?: string | null
          social_link?: string | null
          social_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_partners_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          brand_name: string | null
          category: string | null
          client: string | null
          cover_url: string
          created_at: string | null
          description: string | null
          full_image_url: string | null
          id: string
          is_multiple_partners: boolean | null
          is_published: boolean | null
          media_type: string | null
          media_url: string
          order_index: number | null
          slug: string | null
          tagline: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          year: string | null
        }
        Insert: {
          brand_name?: string | null
          category?: string | null
          client?: string | null
          cover_url?: string
          created_at?: string | null
          description?: string | null
          full_image_url?: string | null
          id?: string
          is_multiple_partners?: boolean | null
          is_published?: boolean | null
          media_type?: string | null
          media_url: string
          order_index?: number | null
          slug?: string | null
          tagline?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          year?: string | null
        }
        Update: {
          brand_name?: string | null
          category?: string | null
          client?: string | null
          cover_url?: string
          created_at?: string | null
          description?: string | null
          full_image_url?: string | null
          id?: string
          is_multiple_partners?: boolean | null
          is_published?: boolean | null
          media_type?: string | null
          media_url?: string
          order_index?: number | null
          slug?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          year?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          reason: string | null
          requested_role: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          reason?: string | null
          requested_role: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          reason?: string | null
          requested_role?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          is_approved: boolean | null
          is_moderator: boolean | null
          is_worker: boolean | null
          requested_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_moderator?: boolean | null
          is_worker?: boolean | null
          requested_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_moderator?: boolean | null
          is_worker?: boolean | null
          requested_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          content: string
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          updated_at: string | null
          version: string
        }
        Insert: {
          content: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
          version: string
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      volumes: {
        Row: {
          content: string[] | null
          created_at: string
          goal: string
          hero_image_url: string | null
          id: string
          is_featured: boolean
          is_latest: boolean
          is_published: boolean
          lead_paragraph: string | null
          order_index: number
          slug: string
          summary: string
          title: string
          updated_at: string | null
          volume_number: string
          writer: string
        }
        Insert: {
          content?: string[] | null
          created_at?: string
          goal: string
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_latest?: boolean
          is_published?: boolean
          lead_paragraph?: string | null
          order_index?: number
          slug: string
          summary: string
          title: string
          updated_at?: string | null
          volume_number: string
          writer: string
        }
        Update: {
          content?: string[] | null
          created_at?: string
          goal?: string
          hero_image_url?: string | null
          id?: string
          is_featured?: boolean
          is_latest?: boolean
          is_published?: boolean
          lead_paragraph?: string | null
          order_index?: number
          slug?: string
          summary?: string
          title?: string
          updated_at?: string | null
          volume_number?: string
          writer?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activatepromptversion: {
        Args: { p_version: string }
        Returns: Json
      }
      approve_role_request: {
        Args: { approver_id: string; request_id: string }
        Returns: boolean
      }
      getactivesystemprompt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      getprompthistory: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      reject_role_request: {
        Args: { approver_id: string; request_id: string; review_notes?: string }
        Returns: boolean
      }
      updatesystemprompt: {
        Args: { p_content: string; p_description?: string; p_version: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
