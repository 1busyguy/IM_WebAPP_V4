/*
  # Add activation_ids to collections table

  1. Changes
    - Add `activation_ids` column to collections table to store associated activation IDs
    - Column is an array of UUIDs that can be null
    - No need for a junction table since we're storing the IDs directly in the array
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'collections' 
    AND column_name = 'activation_ids'
  ) THEN
    ALTER TABLE collections 
    ADD COLUMN activation_ids uuid[] DEFAULT NULL;
  END IF;
END $$;