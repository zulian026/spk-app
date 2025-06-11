// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      laptops: {
        Row: {
          id: string;
          name: string;
          brand: string;
          price: number;
          processor: string;
          processor_score: number;
          ram: number;
          storage: number;
          storage_type: string;
          graphics_card: string | null;
          graphics_type: string;
          screen_size: number;
          screen_resolution: string;
          screen_type: string;
          weight: number;
          thickness: number | null;
          battery_capacity: number | null;
          battery_life: number | null;
          operating_system: string;
          wifi_standard: string;
          bluetooth_version: string;
          usb_ports: number;
          has_hdmi: boolean;
          has_usb_c: boolean;
          image_url: string | null;
          description: string | null;
          availability_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          price: number;
          processor: string;
          processor_score?: number;
          ram: number;
          storage: number;
          storage_type?: string;
          graphics_card?: string | null;
          graphics_type?: string;
          screen_size: number;
          screen_resolution: string;
          screen_type?: string;
          weight: number;
          thickness?: number | null;
          battery_capacity?: number | null;
          battery_life?: number | null;
          operating_system?: string;
          wifi_standard?: string;
          bluetooth_version?: string;
          usb_ports?: number;
          has_hdmi?: boolean;
          has_usb_c?: boolean;
          image_url?: string | null;
          description?: string | null;
          availability_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          price?: number;
          processor?: string;
          processor_score?: number;
          ram?: number;
          storage?: number;
          storage_type?: string;
          graphics_card?: string | null;
          graphics_type?: string;
          screen_size?: number;
          screen_resolution?: string;
          screen_type?: string;
          weight?: number;
          thickness?: number | null;
          battery_capacity?: number | null;
          battery_life?: number | null;
          operating_system?: string;
          wifi_standard?: string;
          bluetooth_version?: string;
          usb_ports?: number;
          has_hdmi?: boolean;
          has_usb_c?: boolean;
          image_url?: string | null;
          description?: string | null;
          availability_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      criteria: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          is_benefit: boolean;
          unit: string | null;
          min_value: number;
          max_value: number;
          default_weight: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          is_benefit?: boolean;
          unit?: string | null;
          min_value?: number;
          max_value?: number;
          default_weight?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          is_benefit?: boolean;
          unit?: string | null;
          min_value?: number;
          max_value?: number;
          default_weight?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          price_weight: number;
          performance_weight: number;
          ram_weight: number;
          storage_weight: number;
          weight_importance: number;
          battery_weight: number;
          max_budget: number | null;
          min_budget: number;
          preferred_brands: string[] | null;
          primary_usage: string | null;
          screen_size_preference: string | null;
          preference_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          price_weight?: number;
          performance_weight?: number;
          ram_weight?: number;
          storage_weight?: number;
          weight_importance?: number;
          battery_weight?: number;
          max_budget?: number | null;
          min_budget?: number;
          preferred_brands?: string[] | null;
          primary_usage?: string | null;
          screen_size_preference?: string | null;
          preference_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          price_weight?: number;
          performance_weight?: number;
          ram_weight?: number;
          storage_weight?: number;
          weight_importance?: number;
          battery_weight?: number;
          max_budget?: number | null;
          min_budget?: number;
          preferred_brands?: string[] | null;
          primary_usage?: string | null;
          screen_size_preference?: string | null;
          preference_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          preference_id: string;
          laptop_id: string;
          topsis_score: number;
          rank_position: number;
          normalized_values: any | null;
          weighted_values: any | null;
          distance_positive: number | null;
          distance_negative: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          preference_id: string;
          laptop_id: string;
          topsis_score: number;
          rank_position: number;
          normalized_values?: any | null;
          weighted_values?: any | null;
          distance_positive?: number | null;
          distance_negative?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          preference_id?: string;
          laptop_id?: string;
          topsis_score?: number;
          rank_position?: number;
          normalized_values?: any | null;
          weighted_values?: any | null;
          distance_positive?: number | null;
          distance_negative?: number | null;
          created_at?: string;
        };
      };
      laptop_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
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
  };
}
