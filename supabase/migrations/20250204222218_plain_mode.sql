/*
  # Initial Schema Setup for Partners Management System

  1. New Tables
    - `partners`
      - Core partner information including company details
      - Linked to auth.users for authentication
    - `users`
      - User profiles linked to partners
      - Contains personal and social media information
    - `collections`
      - Collection of activations with metadata
      - Linked to users
    - `activations`
      - Stores activation details and media links
      - Linked to collections
    - `collection_activations`
      - Junction table for collections and activations
    - `external_links`
      - Reusable structure for external links with images

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated access
    - Hierarchical access control (partners -> users -> collections -> activations)

  3. Relationships
    - Partners have many users
    - Users have many collections and activations
    - Collections can have many activations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  company_name text NOT NULL,
  company_description text,
  avatar_url text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  username text NOT NULL UNIQUE,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table (managed under partners)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid REFERENCES partners(id) ON DELETE CASCADE,
  auth_user_id uuid REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  username text NOT NULL UNIQUE,
  avatar_url text,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- External links table
CREATE TABLE IF NOT EXISTS external_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  url text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cover_image_url text,
  category text,
  external_link_id uuid REFERENCES external_links(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activations table
CREATE TABLE IF NOT EXISTS activations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  trigger_image_url text NOT NULL,
  video_url text NOT NULL,
  external_link_id uuid REFERENCES external_links(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Junction table for collections and activations
CREATE TABLE IF NOT EXISTS collection_activations (
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  activation_id uuid REFERENCES activations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (collection_id, activation_id)
);

-- Enable RLS on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_links ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Partners policies
CREATE POLICY "Partners are viewable by authenticated users"
  ON partners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Partners can be created by authenticated users"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can be updated by owner"
  ON partners FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users policies
CREATE POLICY "Users are viewable by authenticated users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can be created by partner owners"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Collections policies
CREATE POLICY "Collections are viewable by authenticated users"
  ON collections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Collections can be created by user owners"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.auth_user_id = auth.uid()
    )
  );

-- Activations policies
CREATE POLICY "Activations are viewable by authenticated users"
  ON activations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Activations can be created by user owners"
  ON activations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.auth_user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_users_partner_id ON users(partner_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_activations_user_id ON activations(user_id);