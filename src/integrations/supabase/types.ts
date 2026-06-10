export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      checklist_items: {
        Row: {
          id: string;
          info: string | null;
          label: string;
          phase: string;
          sort_order: number;
        };
        Insert: {
          id: string;
          info?: string | null;
          label: string;
          phase: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          info?: string | null;
          label?: string;
          phase?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      guide_stages: {
        Row: {
          content: Json;
          icon: string | null;
          id: string;
          short_desc: string | null;
          step_number: number;
          title: string;
        };
        Insert: {
          content?: Json;
          icon?: string | null;
          id: string;
          short_desc?: string | null;
          step_number: number;
          title: string;
        };
        Update: {
          content?: Json;
          icon?: string | null;
          id?: string;
          short_desc?: string | null;
          step_number?: number;
          title?: string;
        };
        Relationships: [];
      };
      photo_spots: {
        Row: {
          angle_tips: string | null;
          best_time: string;
          best_time_label: string | null;
          best_time_reason: string | null;
          camera_tips: string | null;
          city: string;
          created_at: string;
          gps_link: string | null;
          id: string;
          image_url: string | null;
          is_premium: boolean;
          location_desc: string | null;
          popularity: number;
          tags: string[] | null;
          title: string;
          warnings: string | null;
        };
        Insert: {
          angle_tips?: string | null;
          best_time: string;
          best_time_label?: string | null;
          best_time_reason?: string | null;
          camera_tips?: string | null;
          city: string;
          created_at?: string;
          gps_link?: string | null;
          id?: string;
          image_url?: string | null;
          is_premium?: boolean;
          location_desc?: string | null;
          popularity?: number;
          tags?: string[] | null;
          title: string;
          warnings?: string | null;
        };
        Update: {
          angle_tips?: string | null;
          best_time?: string;
          best_time_label?: string | null;
          best_time_reason?: string | null;
          camera_tips?: string | null;
          city?: string;
          created_at?: string;
          gps_link?: string | null;
          id?: string;
          image_url?: string | null;
          is_premium?: boolean;
          location_desc?: string | null;
          popularity?: number;
          tags?: string[] | null;
          title?: string;
          warnings?: string | null;
        };
        Relationships: [];
      };
      practical_tips: {
        Row: {
          category: string;
          content: string;
          id: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          category: string;
          content: string;
          id?: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          category?: string;
          content?: string;
          id?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      prayer_categories: {
        Row: {
          icon: string | null;
          id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          icon?: string | null;
          id: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          icon?: string | null;
          id?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      prayers: {
        Row: {
          arabic: string;
          audio_url: string | null;
          category_id: string;
          context: string | null;
          created_at: string;
          id: string;
          latin: string;
          sort_order: number;
          title: string;
          translation: string;
        };
        Insert: {
          arabic: string;
          audio_url?: string | null;
          category_id: string;
          context?: string | null;
          created_at?: string;
          id?: string;
          latin: string;
          sort_order?: number;
          title: string;
          translation: string;
        };
        Update: {
          arabic?: string;
          audio_url?: string | null;
          category_id?: string;
          context?: string | null;
          created_at?: string;
          id?: string;
          latin?: string;
          sort_order?: number;
          title?: string;
          translation?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prayers_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "prayer_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          city: string | null;
          created_at: string;
          departure_date: string | null;
          doa_display_mode: string;
          full_name: string | null;
          id: string;
          is_premium: boolean;
          night_mode: boolean;
          updated_at: string;
        };
        Insert: {
          city?: string | null;
          created_at?: string;
          departure_date?: string | null;
          doa_display_mode?: string;
          full_name?: string | null;
          id: string;
          is_premium?: boolean;
          night_mode?: boolean;
          updated_at?: string;
        };
        Update: {
          city?: string | null;
          created_at?: string;
          departure_date?: string | null;
          doa_display_mode?: string;
          full_name?: string | null;
          id?: string;
          is_premium?: boolean;
          night_mode?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_checklist: {
        Row: {
          completed: boolean;
          item_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          item_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          item_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_checklist_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "checklist_items";
            referencedColumns: ["id"];
          },
        ];
      };
      user_favorites: {
        Row: {
          created_at: string;
          prayer_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          prayer_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          prayer_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorites_prayer_id_fkey";
            columns: ["prayer_id"];
            isOneToOne: false;
            referencedRelation: "prayers";
            referencedColumns: ["id"];
          },
        ];
      };
      user_guide_progress: {
        Row: {
          completed: boolean;
          sai_count: number;
          stage_id: string;
          tawaf_count: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          sai_count?: number;
          stage_id: string;
          tawaf_count?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          sai_count?: number;
          stage_id?: string;
          tawaf_count?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_guide_progress_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "guide_stages";
            referencedColumns: ["id"];
          },
        ];
      };
      user_itinerary: {
        Row: {
          created_at: string;
          days: Json;
          id: string;
          template: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          days?: Json;
          id?: string;
          template: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          days?: Json;
          id?: string;
          template?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_notes: {
        Row: {
          contacts: Json;
          flight_info: Json;
          travel_notes: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          contacts?: Json;
          flight_info?: Json;
          travel_notes?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          contacts?: Json;
          flight_info?: Json;
          travel_notes?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
