/*
  # Add RLS policies for external_links table

  1. Security Changes
    - Add RLS policies for external_links table to allow:
      - Select access for authenticated users
      - Insert access for authenticated users
      - Update access for authenticated users who own the related activation
      - Delete access for authenticated users who own the related activation

  2. Notes
    - Policies ensure users can only manage external links related to their activations
    - All authenticated users can view external links
*/

-- External links policies
CREATE POLICY "External links are viewable by authenticated users"
  ON external_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "External links can be created by authenticated users"
  ON external_links FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "External links can be updated by activation owners"
  ON external_links FOR UPDATE
  TO authenticated
  USING (
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

CREATE POLICY "External links can be deleted by activation owners"
  ON external_links FOR DELETE
  TO authenticated
  USING (
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