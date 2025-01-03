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
      ai_training_data: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bot_activities: {
        Row: {
          chat_id: number
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          message_id: number | null
          message_type: string | null
          user_id: string | null
        }
        Insert: {
          chat_id: number
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          message_id?: number | null
          message_type?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: number
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          message_id?: number | null
          message_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_activities_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      bot_users: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          telegram_user_id: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          telegram_user_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          telegram_user_id?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      channels: {
        Row: {
          chat_id: number
          created_at: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          chat_id: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          chat_id?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      expense: {
        Row: {
          amount: string | null
          category: Database["public"]["Enums"]["expense_category"] | null
          date: string | null
          expense_note: string | null
          expenses_row_id: string | null
          uuid: number
        }
        Insert: {
          amount?: string | null
          category?: Database["public"]["Enums"]["expense_category"] | null
          date?: string | null
          expense_note?: string | null
          expenses_row_id?: string | null
          uuid?: number
        }
        Update: {
          amount?: string | null
          category?: Database["public"]["Enums"]["expense_category"] | null
          date?: string | null
          expense_note?: string | null
          expenses_row_id?: string | null
          uuid?: number
        }
        Relationships: []
      }
      google_sheets_config: {
        Row: {
          auto_sync: boolean | null
          created_at: string | null
          header_mapping: Json | null
          id: string
          is_headers_mapped: boolean | null
          sheet_gid: string | null
          sheet_name: string | null
          spreadsheet_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_sync?: boolean | null
          created_at?: string | null
          header_mapping?: Json | null
          id?: string
          is_headers_mapped?: boolean | null
          sheet_gid?: string | null
          sheet_name?: string | null
          spreadsheet_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_sync?: boolean | null
          created_at?: string | null
          header_mapping?: Json | null
          id?: string
          is_headers_mapped?: boolean | null
          sheet_gid?: string | null
          sheet_name?: string | null
          spreadsheet_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          additional_data: Json | null
          caption: string | null
          chat_id: number | null
          created_at: string | null
          file_name: string
          file_url: string
          google_drive_id: string | null
          google_drive_url: string | null
          id: string
          media_group_id: string | null
          media_type: string
          metadata: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_data?: Json | null
          caption?: string | null
          chat_id?: number | null
          created_at?: string | null
          file_name: string
          file_url: string
          google_drive_id?: string | null
          google_drive_url?: string | null
          id?: string
          media_group_id?: string | null
          media_type: string
          metadata?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_data?: Json | null
          caption?: string | null
          chat_id?: number | null
          created_at?: string | null
          file_name?: string
          file_url?: string
          google_drive_id?: string | null
          google_drive_url?: string | null
          id?: string
          media_group_id?: string | null
          media_type?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_media_channel"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["chat_id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: number | null
          created_at: string | null
          id: string
          media_type: string | null
          media_url: string | null
          message_id: number
          sender_name: string
          text: string | null
          user_id: string
        }
        Insert: {
          chat_id?: number | null
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_id: number
          sender_name: string
          text?: string | null
          user_id: string
        }
        Update: {
          chat_id?: number | null
          created_at?: string | null
          id?: string
          media_type?: string | null
          media_url?: string | null
          message_id?: number
          sender_name?: string
          text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_configurations: {
        Row: {
          body_params: Json | null
          created_at: string | null
          headers: Json | null
          id: string
          method: string
          name: string
          query_params: Json | null
          updated_at: string | null
          user_id: string
          webhook_url_id: string
        }
        Insert: {
          body_params?: Json | null
          created_at?: string | null
          headers?: Json | null
          id?: string
          method: string
          name: string
          query_params?: Json | null
          updated_at?: string | null
          user_id: string
          webhook_url_id: string
        }
        Update: {
          body_params?: Json | null
          created_at?: string | null
          headers?: Json | null
          id?: string
          method?: string
          name?: string
          query_params?: Json | null
          updated_at?: string | null
          user_id?: string
          webhook_url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_configurations_webhook_url_id_fkey"
            columns: ["webhook_url_id"]
            isOneToOne: false
            referencedRelation: "webhook_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_history: {
        Row: {
          fields_sent: string[]
          id: string
          media_count: number
          schedule_type: string
          sent_at: string | null
          status: string
          webhook_url_id: string
        }
        Insert: {
          fields_sent: string[]
          id?: string
          media_count: number
          schedule_type: string
          sent_at?: string | null
          status: string
          webhook_url_id: string
        }
        Update: {
          fields_sent?: string[]
          id?: string
          media_count?: number
          schedule_type?: string
          sent_at?: string | null
          status?: string
          webhook_url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_history_webhook_url_id_fkey"
            columns: ["webhook_url_id"]
            isOneToOne: false
            referencedRelation: "webhook_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_urls: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_safe_query: {
        Args: {
          query_text: string
        }
        Returns: Json
      }
      get_media_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      upload_media: {
        Args: {
          p_user_id: string
          p_chat_id: number
          p_file_name: string
          p_media_type: string
          p_caption?: string
        }
        Returns: string
      }
    }
    Enums: {
      expense_category:
        | "company_supplies"
        | "rent_utility"
        | "payroll"
        | "manufacture"
        | "tp_expenses"
        | "grow_expenses"
        | "miscellaneous"
        | "transportation"
        | "dc_expenses"
        | "automatic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
