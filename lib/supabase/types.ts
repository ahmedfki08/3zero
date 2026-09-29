export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      club_applications: {
        Row: {
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          motivation: string | null
          phone: string | null
          pillar_focus: string | null
          status: string
          submitted_at: string
          year_of_study: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          motivation?: string | null
          phone?: string | null
          pillar_focus?: string | null
          status?: string
          submitted_at?: string
          year_of_study?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          motivation?: string | null
          phone?: string | null
          pillar_focus?: string | null
          status?: string
          submitted_at?: string
          year_of_study?: string | null
        }
        Relationships: []
      }
      event_form_fields: {
        Row: {
          created_at: string
          event_id: string
          field_key: string
          id: string
          label: string
          options: Json | null
          required: boolean
          sort_order: number
          type: string
        }
        Insert: {
          created_at?: string
          event_id: string
          field_key: string
          id?: string
          label: string
          options?: Json | null
          required?: boolean
          sort_order?: number
          type: string
        }
        Update: {
          created_at?: string
          event_id?: string
          field_key?: string
          id?: string
          label?: string
          options?: Json | null
          required?: boolean
          sort_order?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_form_fields_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_form_fields_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      event_images: {
        Row: {
          alt_text: string | null
          created_at: string
          event_id: string
          id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          event_id: string
          id?: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          event_id?: string
          id?: string
          sort_order?: number
          url: string
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          email: string | null
          event_id: string
          id: string
          responses: Json
          status: string
          submitted_at: string
        }
        Insert: {
          email?: string | null
          event_id: string
          id?: string
          responses?: Json
          status?: string
          submitted_at?: string
        }
        Update: {
          email?: string | null
          event_id?: string
          id?: string
          responses?: Json
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendee_count: number | null
          barcode_number: string | null
          capacity: number | null
          category: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          draft: boolean
          ends_at: string
          highlights: string[] | null
          id: string
          is_featured: boolean
          location_city: string | null
          location_map_url: string | null
          location_room: string | null
          location_venue: string | null
          override_status: string | null
          pillar_id: string | null
          recap: string | null
          requirements: string[] | null
          slug: string
          speakers: Json | null
          starts_at: string
          tagline: string | null
          timezone: string
          title: string
          updated_at: string
        }
        Insert: {
          attendee_count?: number | null
          barcode_number?: string | null
          capacity?: number | null
          category: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          draft?: boolean
          ends_at: string
          highlights?: string[] | null
          id?: string
          is_featured?: boolean
          location_city?: string | null
          location_map_url?: string | null
          location_room?: string | null
          location_venue?: string | null
          override_status?: string | null
          pillar_id?: string | null
          recap?: string | null
          requirements?: string[] | null
          slug: string
          speakers?: Json | null
          starts_at: string
          tagline?: string | null
          timezone?: string
          title: string
          updated_at?: string
        }
        Update: {
          attendee_count?: number | null
          barcode_number?: string | null
          capacity?: number | null
          category?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          draft?: boolean
          ends_at?: string
          highlights?: string[] | null
          id?: string
          is_featured?: boolean
          location_city?: string | null
          location_map_url?: string | null
          location_room?: string | null
          location_venue?: string | null
          override_status?: string | null
          pillar_id?: string | null
          recap?: string | null
          requirements?: string[] | null
          slug?: string
          speakers?: Json | null
          starts_at?: string
          tagline?: string | null
          timezone?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      events_with_status: {
        Row: {
          attendee_count: number | null
          barcode_number: string | null
          capacity: number | null
          category: string | null
          computed_status: string | null
          confirmed_count: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          draft: boolean | null
          ends_at: string | null
          highlights: string[] | null
          id: string | null
          is_featured: boolean | null
          location_city: string | null
          location_map_url: string | null
          location_room: string | null
          location_venue: string | null
          override_status: string | null
          pillar_id: string | null
          recap: string | null
          requirements: string[] | null
          slug: string | null
          speakers: Json | null
          starts_at: string | null
          tagline: string | null
          timezone: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
