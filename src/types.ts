export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  partner_id: string;
  collections_count: number;
  activations_count: number;
  scans_count: number;
  likes_count: number;
  views_count: number;
  is_active: boolean;
  created_at: string;
  description?: string;
  social_media?: {
    x: string;
    instagram: string;
    tiktok: string;
  };
}

export interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  description: string;
  username: string;
  email: string;
  logo_url: string;
  managers_count: number;
  users_count: number;
  collections_count: number;
  activations_count: number;
  scans_count: number;
  likes_count: number;
  views_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Metrics {
  partners_count?: number;
  users_count?: number;
  collections_count?: number;
  activations_count?: number;
  scans_count?: number;
  collection_views?: number;
  activation_views?: number;
  likes_count?: number;
  views_count?: number;
}