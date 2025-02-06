/*
  # Fix external links deletion

  1. Changes
    - Add stricter RLS policies for external links
    - Add function to clean up orphaned external links
    - Add trigger to handle external link deletion

  2. Security
    - Only content owners can modify their external links
    - Automatic cleanup of orphaned external links
*/

-- Drop existing external links policies
DROP POLICY IF EXISTS "External links are viewable by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be created by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be modified by authenticated users" ON external_links;

-- Create more restrictive policies
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
  );

CREATE POLICY "External links can be deleted by content owners"
  ON external_links FOR DELETE
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
  );

-- Create function to clean up orphaned external links
CREATE OR REPLACE FUNCTION cleanup_orphaned_external_links()
RETURNS trigger AS $$
BEGIN
  DELETE FROM external_links
  WHERE id NOT IN (
    SELECT external_link_id FROM activations WHERE external_link_id IS NOT NULL
    UNION
    SELECT external_link_id FROM collections WHERE external_link_id IS NOT NULL
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to clean up orphaned external links
DROP TRIGGER IF EXISTS cleanup_external_links_activations ON activations;
CREATE TRIGGER cleanup_external_links_activations
  AFTER UPDATE OR DELETE ON activations
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_orphaned_external_links();

DROP TRIGGER IF EXISTS cleanup_external_links_collections ON collections;
CREATE TRIGGER cleanup_external_links_collections
  AFTER UPDATE OR DELETE ON collections
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_orphaned_external_links();