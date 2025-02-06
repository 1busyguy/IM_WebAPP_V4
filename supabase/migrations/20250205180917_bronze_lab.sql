/*
  # Fix stack depth limit exceeded error

  1. Changes
    - Simplify cleanup function to avoid recursion
    - Optimize trigger execution
    - Add proper null handling

  2. Security
    - Maintain existing security policies
    - Ensure data integrity during cleanup
*/

-- Drop existing cleanup function and triggers
DROP TRIGGER IF EXISTS cleanup_external_links_activations ON activations;
DROP TRIGGER IF EXISTS cleanup_external_links_collections ON collections;
DROP FUNCTION IF EXISTS cleanup_orphaned_external_links();

-- Create optimized cleanup function without recursion
CREATE OR REPLACE FUNCTION cleanup_orphaned_external_links()
RETURNS trigger AS $$
DECLARE
  old_external_link_id uuid;
BEGIN
  -- Store the old external link ID before it's nullified
  old_external_link_id := OLD.external_link_id;

  -- Only proceed if there was an external link
  IF old_external_link_id IS NOT NULL THEN
    -- Delete the external link if it's no longer referenced
    DELETE FROM external_links
    WHERE id = old_external_link_id
    AND NOT EXISTS (
      SELECT 1 FROM activations WHERE external_link_id = old_external_link_id
    )
    AND NOT EXISTS (
      SELECT 1 FROM collections WHERE external_link_id = old_external_link_id
    );
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create optimized triggers
CREATE TRIGGER cleanup_external_links_activations
  AFTER UPDATE OF external_link_id OR DELETE ON activations
  FOR EACH ROW
  WHEN (OLD.external_link_id IS NOT NULL)
  EXECUTE FUNCTION cleanup_orphaned_external_links();

CREATE TRIGGER cleanup_external_links_collections
  AFTER UPDATE OF external_link_id OR DELETE ON collections
  FOR EACH ROW
  WHEN (OLD.external_link_id IS NOT NULL)
  EXECUTE FUNCTION cleanup_orphaned_external_links();

-- Add statement-level trigger for bulk operations
CREATE OR REPLACE FUNCTION cleanup_orphaned_external_links_bulk()
RETURNS trigger AS $$
BEGIN
  -- Delete external links that are no longer referenced
  DELETE FROM external_links
  WHERE NOT EXISTS (
    SELECT 1 FROM activations WHERE external_link_id = external_links.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM collections WHERE external_link_id = external_links.id
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_external_links_bulk_activations
  AFTER TRUNCATE ON activations
  EXECUTE FUNCTION cleanup_orphaned_external_links_bulk();

CREATE TRIGGER cleanup_external_links_bulk_collections
  AFTER TRUNCATE ON collections
  EXECUTE FUNCTION cleanup_orphaned_external_links_bulk();