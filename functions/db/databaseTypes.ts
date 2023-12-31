export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      card_review: {
        Row: {
          card_id: number
          created_at: string
          ease_factor: number
          interval: number
          last_review_date: string
          user_id: number
        }
        Insert: {
          card_id: number
          created_at?: string
          ease_factor?: number
          interval: number
          last_review_date?: string
          user_id: number
        }
        Update: {
          card_id?: number
          created_at?: string
          ease_factor?: number
          interval?: number
          last_review_date?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_review_card_id_fkey"
            columns: ["card_id"]
            referencedRelation: "deck_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_review_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      deck: {
        Row: {
          author_id: number | null
          available_in: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          name: string
          share_id: string
          speak_field: string | null
          speak_locale: string | null
        }
        Insert: {
          author_id?: number | null
          available_in?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name: string
          share_id: string
          speak_field?: string | null
          speak_locale?: string | null
        }
        Update: {
          author_id?: number | null
          available_in?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name?: string
          share_id?: string
          speak_field?: string | null
          speak_locale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "deck_category"
            referencedColumns: ["id"]
          }
        ]
      }
      deck_access: {
        Row: {
          author_id: number
          created_at: string
          deck_id: number
          duration_days: number | null
          id: number
          processed_at: string | null
          share_id: string
          usage_started_at: string | null
          used_by: number | null
        }
        Insert: {
          author_id: number
          created_at?: string
          deck_id: number
          duration_days?: number | null
          id?: number
          processed_at?: string | null
          share_id: string
          usage_started_at?: string | null
          used_by?: number | null
        }
        Update: {
          author_id?: number
          created_at?: string
          deck_id?: number
          duration_days?: number | null
          id?: number
          processed_at?: string | null
          share_id?: string
          usage_started_at?: string | null
          used_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_access_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_access_deck_id_fkey"
            columns: ["deck_id"]
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_access_used_by_fkey"
            columns: ["used_by"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      deck_card: {
        Row: {
          back: string
          created_at: string
          deck_id: number
          example: string | null
          front: string
          id: number
          updated_at: string
        }
        Insert: {
          back: string
          created_at?: string
          deck_id: number
          example?: string | null
          front: string
          id?: number
          updated_at?: string
        }
        Update: {
          back?: string
          created_at?: string
          deck_id?: number
          example?: string | null
          front?: string
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deck_card_deck_id_fkey"
            columns: ["deck_id"]
            referencedRelation: "deck"
            referencedColumns: ["id"]
          }
        ]
      }
      deck_category: {
        Row: {
          created_at: string
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      deck_folder: {
        Row: {
          created_at: string
          deck_id: number
          folder_id: number
        }
        Insert: {
          created_at?: string
          deck_id: number
          folder_id: number
        }
        Update: {
          created_at?: string
          deck_id?: number
          folder_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "deck_folder_deck_id_fkey"
            columns: ["deck_id"]
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_folder_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folder"
            referencedColumns: ["id"]
          }
        ]
      }
      folder: {
        Row: {
          author_id: number
          created_at: string
          description: string | null
          id: number
          title: string
        }
        Insert: {
          author_id: number
          created_at?: string
          description?: string | null
          id?: number
          title: string
        }
        Update: {
          author_id?: number
          created_at?: string
          description?: string | null
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "folder_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      notification: {
        Row: {
          created_at: string
          id: number
          info: Json | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          info?: Json | null
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          info?: Json | null
          type?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          first_name: string | null
          id: number
          is_admin: boolean
          is_remind_enabled: boolean
          is_speaking_card_enabled: boolean | null
          language_code: string | null
          last_name: string | null
          last_reminded_date: string | null
          last_used: string | null
          server_bot_state: Json | null
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: number
          is_admin?: boolean
          is_remind_enabled?: boolean
          is_speaking_card_enabled?: boolean | null
          language_code?: string | null
          last_name?: string | null
          last_reminded_date?: string | null
          last_used?: string | null
          server_bot_state?: Json | null
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: number
          is_admin?: boolean
          is_remind_enabled?: boolean
          is_speaking_card_enabled?: boolean | null
          language_code?: string | null
          last_name?: string | null
          last_reminded_date?: string | null
          last_used?: string | null
          server_bot_state?: Json | null
          username?: string | null
        }
        Relationships: []
      }
      user_deck: {
        Row: {
          created_at: string
          deck_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          deck_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          deck_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_deck_deck_id_fkey"
            columns: ["deck_id"]
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_deck_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      user_features: {
        Row: {
          advanced_share: boolean
          created_at: string
          id: number
          user_id: number
        }
        Insert: {
          advanced_share?: boolean
          created_at?: string
          id?: number
          user_id: number
        }
        Update: {
          advanced_share?: boolean
          created_at?: string
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_features_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      user_folder: {
        Row: {
          created_at: string
          folder_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          folder_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          folder_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_folder_folder_id_fkey"
            columns: ["folder_id"]
            referencedRelation: "folder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_folder_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_decks_by_author: {
        Args: {
          usr_id: number
        }
        Returns: {
          author_id: number | null
          available_in: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          name: string
          share_id: string
          speak_field: string | null
          speak_locale: string | null
        }[]
      }
      get_cards_to_review: {
        Args: {
          usr_id: number
        }
        Returns: {
          id: number
          deck_id: number
          type: string
        }[]
      }
      get_folder_with_decks: {
        Args: {
          usr_id: number
        }
        Returns: {
          folder_id: number
          folder_title: string
          folder_description: string
          folder_author_id: number
          deck_id: number
        }[]
      }
      get_unadded_public_decks: {
        Args: {
          user_id: number
        }
        Returns: {
          author_id: number | null
          available_in: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: number
          is_public: boolean
          name: string
          share_id: string
          speak_field: string | null
          speak_locale: string | null
        }[]
      }
      get_unadded_public_decks_smart: {
        Args: {
          user_id_param: number
        }
        Returns: {
          id: number
          created_at: string
          name: string
          author_id: number
          description: string
          is_public: boolean
          share_id: string
          speak_locale: string
          speak_field: string
          available_in: string
          category_id: string
          category_name: string
          category_logo: string
        }[]
      }
      get_user_decks_deck_id: {
        Args: {
          usr_id: number
        }
        Returns: {
          id: number
        }[]
      }
      get_users_with_review_to_notify: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: number
          review_count: number
          last_reminded_date: string
          is_admin: boolean
        }[]
      }
      get_users_with_review_to_notify2: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: number
          review_count: number
          last_reminded_date: string
          is_admin: boolean
          language_code: string
        }[]
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

