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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      asset_folders: {
        Row: {
          access_level: string
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_folders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_folders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "asset_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          folder_id: string | null
          id: string
          metadata: Json | null
          mime_type: string | null
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "asset_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      board_meetings: {
        Row: {
          agenda: Json | null
          attendees: Json | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          location: string | null
          meeting_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agenda?: Json | null
          attendees?: Json | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string | null
          meeting_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agenda?: Json | null
          attendees?: Json | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string | null
          meeting_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_meetings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "board_meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_settings: {
        Row: {
          accent_color: string | null
          company_id: string | null
          font_body: string | null
          font_heading: string | null
          guidelines_content: Json | null
          id: string
          logo_dark_path: string | null
          logo_light_path: string | null
          primary_color: string | null
          secondary_color: string | null
          tagline: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          accent_color?: string | null
          company_id?: string | null
          font_body?: string | null
          font_heading?: string | null
          guidelines_content?: Json | null
          id?: string
          logo_dark_path?: string | null
          logo_light_path?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          accent_color?: string | null
          company_id?: string | null
          font_body?: string | null
          font_heading?: string | null
          guidelines_content?: Json | null
          id?: string
          logo_dark_path?: string | null
          logo_light_path?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_overrides: {
        Row: {
          created_at: string
          deck_key: string
          id: string
          language: string
          translation_key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          deck_key: string
          id?: string
          language?: string
          translation_key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          deck_key?: string
          id?: string
          language?: string
          translation_key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          category: string | null
          company_id: string | null
          content: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_global: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_global?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_global?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          board_meeting_id: string | null
          category: string | null
          company_id: string | null
          content: Json | null
          created_at: string | null
          created_by: string | null
          folder_id: string | null
          id: string
          status: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          board_meeting_id?: string | null
          category?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          folder_id?: string | null
          id?: string
          status?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          board_meeting_id?: string | null
          category?: string | null
          company_id?: string | null
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          folder_id?: string | null
          id?: string
          status?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_board_meeting_id_fkey"
            columns: ["board_meeting_id"]
            isOneToOne: false
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "asset_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      image_overrides: {
        Row: {
          created_at: string
          deck_key: string
          id: string
          image_key: string
          image_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deck_key: string
          id?: string
          image_key: string
          image_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deck_key?: string
          id?: string
          image_key?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      pitchdecks: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          hidden_slides: string[] | null
          id: string
          is_default: boolean | null
          name: string
          overrides_key: string | null
          slide_order: string[] | null
          style_overrides: Json | null
          template: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          hidden_slides?: string[] | null
          id?: string
          is_default?: boolean | null
          name: string
          overrides_key?: string | null
          slide_order?: string[] | null
          style_overrides?: Json | null
          template?: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          hidden_slides?: string[] | null
          id?: string
          is_default?: boolean | null
          name?: string
          overrides_key?: string | null
          slide_order?: string[] | null
          style_overrides?: Json | null
          template?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pitchdecks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pitchdecks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      presenter_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          slide_id: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          slide_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          slide_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      share_links: {
        Row: {
          asset_id: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          expires_at: string | null
          folder_id: string | null
          id: string
          is_active: boolean | null
          last_viewed_at: string | null
          password_hash: string | null
          pitchdeck_id: string | null
          title: string
          token: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          asset_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          folder_id?: string | null
          id?: string
          is_active?: boolean | null
          last_viewed_at?: string | null
          password_hash?: string | null
          pitchdeck_id?: string | null
          title: string
          token?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          asset_id?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          folder_id?: string | null
          id?: string
          is_active?: boolean | null
          last_viewed_at?: string | null
          password_hash?: string | null
          pitchdeck_id?: string | null
          title?: string
          token?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "share_links_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "share_links_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "asset_folders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_company_admin: { Args: { p_company_id: string }; Returns: boolean }
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
