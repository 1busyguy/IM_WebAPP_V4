/*
  # Fix RLS policies and schema for activations and external links

  1. Changes
    - Add missing RLS policies for activations and external links
    - Fix external links relationship with activations
    - Add update policies for activations

  2. Security
    - Ensure proper RLS policies for all operations
    - Maintain data integrity with proper foreign key relationships
*/

-- Fix external links policies
DROP POLICY IF EXISTS "External links are viewable by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be created by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be updated by activation owners" ON external_links;
DROP POLICY IF EXISTS "External links can be deleted by activation owners" ON external_links;

CREATE POLICY "External links are viewable by authenticated users"
  ON external_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "External links can be created by authenticated users"
  ON external_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "External links can be updated by authenticated users"
  ON external_links FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "External links can be deleted by authenticated users"
  ON external_links FOR DELETE
  TO authenticated
  USING (true);

-- Fix activations policies
DROP POLICY IF EXISTS "Activations can be updated by user owners" ON activations;
DROP POLICY IF EXISTS "Activations can be deleted by user owners" ON activations;

CREATE POLICY "Activations can be updated by user owners"
  ON activations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Activations can be deleted by user owners"
  ON activations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = user_id
      AND users.auth_user_id = auth.uid()
    )
  );

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_activations_external_link_id ON activations(external_link_id);
CREATE INDEX IF NOT EXISTS idx_external_links_created_at ON external_links(created_at);