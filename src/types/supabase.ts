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
      partners: {
        Row: {
          id: string
          user_id: string
          company_name: string
          company_description: string | null
          avatar_url: string | null
          first_name: string
          last_name: string
          username: string
          social_links: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          company_description?: string | null
          avatar_url?: string | null
          first_name: string
          last_name: string
          username: string
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          company_description?: string | null
          avatar_url?: string | null
          first_name?: string
          last_name?: string
          username?: string
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          partner_id: string
          auth_user_id: string
          first_name: string
          last_name: string
          username: string
          avatar_url: string | null
          social_links: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          auth_user_id: string
          first_name: string
          last_name: string
          username: string
          avatar_url?: string | null
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          auth_user_id?: string
          first_name?: string
          last_name?: string
          username?: string
          avatar_url?: string | null
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_image_url: string | null
          category: string | null
          external_link_id: string | null
          activation_ids: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          category?: string | null
          external_link_id?: string | null
          activation_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          category?: string | null
          external_link_id?: string | null
          activation_ids?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      activations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          trigger_image_url: string
          video_url: string
          external_link_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          trigger_image_url: string
          video_url: string
          external_link_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          trigger_image_url?: string
          video_url?: string
          external_link_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}