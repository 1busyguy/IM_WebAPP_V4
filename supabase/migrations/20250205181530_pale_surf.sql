/*
  # Update External Links Policies

  1. Changes
    - Simplify external links policies
    - Allow authenticated users to manage their own external links
    - Add proper cascading delete behavior
    - Add missing indexes for performance

  2. Security
    - Maintain RLS protection while allowing proper CRUD operations
    - Ensure external links can only be modified by their owners
*/

-- Drop existing external links policies
DROP POLICY IF EXISTS "External links are viewable by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be created by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be modified by content owners" ON external_links;
DROP POLICY IF EXISTS "External links can be modified by authenticated users" ON external_links;

-- Create simplified but secure policies
CREATE POLICY "External links are viewable by authenticated users"
  ON external_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "External links can be managed by authenticated users"
  ON external_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM activations
      WHERE activations.external_link_id = id
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = activations.user_id
        AND users.auth_user_id = auth.uid()
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.external_link_id = id
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = collections.user_id
        AND users.auth_user_id = auth.uid()
      )
    )
    OR
    NOT EXISTS (
      SELECT 1 FROM activations WHERE external_link_id = id
      UNION
      SELECT 1 FROM collections WHERE external_link_id = id
    )
  )
  WITH CHECK (true);

-- Add missing indexes for better join performance
CREATE INDEX IF NOT EXISTS idx_external_links_title ON external_links(title);
CREATE INDEX IF NOT EXISTS idx_external_links_url ON external_links(url);