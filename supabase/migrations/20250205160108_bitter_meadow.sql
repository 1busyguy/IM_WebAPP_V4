/*
  # Fix collections RLS policies and schema

  1. Changes
    - Add missing RLS policies for collections
    - Add missing indexes for collections
    - Update external links policies for collections
    - Add missing collection update/delete policies

  2. Security
    - Enable proper RLS for collections table
    - Add policies for CRUD operations on collections
    - Add policies for external links related to collections
*/

-- Drop existing collection policies
DROP POLICY IF EXISTS "Collections are viewable by authenticated users" ON collections;
DROP POLICY IF EXISTS "Collections can be created by user owners" ON collections;

-- Create comprehensive collection policies
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

CREATE POLICY "Collections can be updated by user owners"
  ON collections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Collections can be deleted by user owners"
  ON collections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.auth_user_id = auth.uid()
    )
  );

-- Add missing indexes for collections
CREATE INDEX IF NOT EXISTS idx_collections_external_link_id ON collections(external_link_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON collections(created_at);
CREATE INDEX IF NOT EXISTS idx_collections_category ON collections(category);

-- Update external links policies to include collections
DROP POLICY IF EXISTS "External links are viewable by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be created by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be updated by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be deleted by authenticated users" ON external_links;

CREATE POLICY "External links are viewable by authenticated users"
  ON external_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "External links can be created by authenticated users"
  ON external_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "External links can be updated by content owners"
  ON external_links FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.external_link_id = external_links.id
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = collections.user_id
        AND users.auth_user_id = auth.uid()
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM activations
      WHERE activations.external_link_id = external_links.id
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = activations.user_id
        AND users.auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "External links can be deleted by content owners"
  ON external_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.external_link_id = external_links.id
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = collections.user_id
        AND users.auth_user_id = auth.uid()
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM activations
      WHERE activations.external_link_id = external_links.id
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = activations.user_id
        AND users.auth_user_id = auth.uid()
      )
    )
  );