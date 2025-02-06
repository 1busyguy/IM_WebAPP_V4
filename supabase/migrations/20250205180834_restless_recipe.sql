/*
  # Fix external links deletion and cleanup

  1. Changes
    - Consolidate external links policies
    - Add proper cleanup trigger
    - Fix cascade deletion behavior

  2. Security
    - Only content owners can modify their external links
    - Automatic cleanup of orphaned external links
*/

-- Drop existing external links policies
DROP POLICY IF EXISTS "External links are viewable by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be created by authenticated users" ON external_links;
DROP POLICY IF EXISTS "External links can be updated by content owners" ON external_links;
DROP POLICY IF EXISTS "External links can be deleted by content owners" ON external_links;

-- Create consolidated policies
CREATE POLICY "External links are viewable by authenticated users"
  ON external_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "External links can be created by authenticated users"
  ON external_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "External links can be modified by content owners"
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
  );

-- Drop existing cleanup function and triggers
DROP TRIGGER IF EXISTS cleanup_external_links_activations ON activations;
DROP TRIGGER IF EXISTS cleanup_external_links_collections ON collections;
DROP FUNCTION IF EXISTS cleanup_orphaned_external_links();

-- Create improved cleanup function
CREATE OR REPLACE FUNCTION cleanup_orphaned_external_links()
RETURNS trigger AS $$
BEGIN
  -- Delete external links that are no longer referenced
  DELETE FROM external_links
  WHERE id NOT IN (
    SELECT external_link_id FROM activations WHERE external_link_id IS NOT NULL
    UNION
    SELECT external_link_id FROM collections WHERE external_link_id IS NOT NULL
  );
  
  -- Set external_link_id to null in the parent table
  IF TG_TABLE_NAME = 'activations' THEN
    UPDATE activations SET external_link_id = NULL WHERE id = OLD.id;
  ELSIF TG_TABLE_NAME = 'collections' THEN
    UPDATE collections SET external_link_id = NULL WHERE id = OLD.id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create improved cleanup triggers
CREATE TRIGGER cleanup_external_links_activations
  AFTER UPDATE OF external_link_id OR DELETE ON activations
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_orphaned_external_links();

CREATE TRIGGER cleanup_external_links_collections
  AFTER UPDATE OF external_link_id OR DELETE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_orphaned_external_links();