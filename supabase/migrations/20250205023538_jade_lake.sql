/*
  # Create storage buckets for media files

  1. New Buckets
    - `images` - For storing image files (collection covers, trigger images, thumbnails)
    - `videos` - For storing video files (activation videos)

  2. Security
    - Enable public access to files
    - Allow authenticated users to upload files
*/

-- Create buckets for different file types
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'Images for collections and activations', true),
  ('videos', 'Videos for activations', true);

-- Set up RLS policies for the buckets
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');