import { supabase } from './supabase';

/**
 * Optimize image before upload
 * @param file The image file to optimize
 * @returns The optimized file
 */
async function optimizeImage(file: File): Promise<File> {
  // Create a canvas element to resize the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Create an image element to load the file
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Maximum dimensions
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          // Create new file from blob
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        },
        'image/jpeg',
        0.8 // Quality setting
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Handle image upload with validation and optimization
 * @param file The file to upload
 * @returns The public URL of the uploaded file
 */
export const handleImageUpload = async (file: File): Promise<string> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  // Optimize image before upload
  const optimizedFile = await optimizeImage(file);
  return uploadImage(optimizedFile);
};

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket to upload to ('images' or 'videos')
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (file: File, bucket: 'images' | 'videos'): Promise<string> => {
  // Generate a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

  // Upload the file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};

/**
 * Upload an image file to Supabase Storage
 * @param file The image file to upload
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  return uploadFile(file, 'images');
};

/**
 * Upload a video file to Supabase Storage
 * @param file The video file to upload
 * @returns The public URL of the uploaded video
 */
export const uploadVideo = async (file: File): Promise<string> => {
  return uploadFile(file, 'videos');
};