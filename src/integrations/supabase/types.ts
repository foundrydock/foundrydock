export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
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
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      asset_folders: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          access_level: 'public' | 'link' | 'private'
          icon: string | null
          sort_order: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          access_level?: 'public' | 'link' | 'private'
          icon?: string | null
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          access_level?: 'public' | 'link' | 'private'
          icon?: string | null
          sort_order?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          id: string
          folder_id: string | null
          name: string
          description: string | null
          file_path: string
          file_name: string
          file_type: string
          file_size: number
          mime_type: string | null
          thumbnail_url: string | null
          tags: string[]
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          folder_id?: string | null
          name: string
          description?: string | null
          file_path: string
          file_name: string
          file_type: string
          file_size?: number
          mime_type?: string | null
          thumbnail_url?: string | null
          tags?: string[]
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          folder_id?: string | null
          name?: string
          description?: string | null
          file_path?: string
          file_name?: string
          file_type?: string
          file_size?: number
          mime_type?: string | null
          thumbnail_url?: string | null
          tags?: string[]
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      share_links: {
        Row: {
          id: string
          token: string
          title: string
          description: string | null
          folder_id: string | null
          asset_id: string | null
          pitchdeck_id: string | null
          password_hash: string | null
          expires_at: string | null
          view_count: number
          last_viewed_at: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          token?: string
          title: string
          description?: string | null
          folder_id?: string | null
          asset_id?: string | null
          pitchdeck_id?: string | null
          password_hash?: string | null
          expires_at?: string | null
          view_count?: number
          last_viewed_at?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          token?: string
          title?: string
          description?: string | null
          folder_id?: string | null
          asset_id?: string | null
          pitchdeck_id?: string | null
          password_hash?: string | null
          expires_at?: string | null
          view_count?: number
          last_viewed_at?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pitchdecks: {
        Row: {
          id: string
          name: string
          template: string
          slide_order: string[]
          hidden_slides: string[]
          style_overrides: Json
          overrides_key: string | null
          is_default: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          template?: string
          slide_order?: string[]
          hidden_slides?: string[]
          style_overrides?: Json
          overrides_key?: string | null
          is_default?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          template?: string
          slide_order?: string[]
          hidden_slides?: string[]
          style_overrides?: Json
          overrides_key?: string | null
          is_default?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
