import { useState, useRef } from 'react';
import { useActivationStore } from '../../store/activationStore';
import { X, Upload, Video, Wand } from 'lucide-react';
import { handleImageUpload, uploadVideo } from '../../lib/storage';
import { analyzeImage } from '../../lib/vision';

interface CreateActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function CreateActivationModal({ isOpen, onClose, userId }: CreateActivationModalProps) {
  const { createActivation } = useActivationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Refs for file inputs
  const triggerImageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const linkImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trigger_image_url: '',
    video_url: '',
    external_link: {
      title: '',
      url: '',
      image_url: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.trigger_image_url) {
        throw new Error('Trigger image is required');
      }
      if (!formData.video_url) {
        throw new Error('Video is required');
      }

      // Prepare external link data if provided
      const externalLink = formData.external_link.title && formData.external_link.url
        ? {
            title: formData.external_link.title,
            url: formData.external_link.url,
            image_url: formData.external_link.image_url || null
          }
        : undefined;

      // Create the activation
      await createActivation({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        trigger_image_url: formData.trigger_image_url,
        video_url: formData.video_url,
        user_id: userId,
        external_link: externalLink
      });

      onClose();
    } catch (err) {
      console.error('Failed to create activation:', err);
      setError(err instanceof Error ? err.message : 'Failed to create activation');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAnalyzing(true);
      const url = await handleImageUpload(file);
      setFormData(prev => ({ ...prev, trigger_image_url: url }));

      // Analyze the image using GPT-4 Vision
      const analysis = await analyzeImage(file);
      
      // Update form with the analysis results
      setFormData(prev => ({
        ...prev,
        title: analysis.title,
        description: analysis.description
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadVideo(file);
      setFormData(prev => ({ ...prev, video_url: url }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload video');
    }
  };

  const handleLinkImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await handleImageUpload(file);
      setFormData(prev => ({
        ...prev,
        external_link: { ...prev.external_link, image_url: url }
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-[1024px] max-w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Activation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="grid grid-cols-2 gap-8">
              {/* Trigger Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Image
                </label>
                <div 
                  onClick={() => triggerImageRef.current?.click()}
                  className="relative h-[240px] w-full rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center"
                >
                  {formData.trigger_image_url ? (
                    <>
                      <img
                        src={formData.trigger_image_url}
                        alt="Trigger"
                        className="h-full w-full rounded-lg object-cover"
                      />
                      {analyzing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <Wand className="h-8 w-8 mx-auto mb-2 animate-spin" />
                            <p className="text-sm">Analyzing image...</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500">Click to upload trigger image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                      <p className="text-xs text-indigo-600 mt-2">Image will be analyzed automatically</p>
                    </>
                  )}
                  <input
                    ref={triggerImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleTriggerImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video
                </label>
                <div 
                  onClick={() => videoRef.current?.click()}
                  className="relative h-[240px] w-full rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center"
                >
                  {formData.video_url ? (
                    <video
                      src={formData.video_url}
                      className="h-full w-full rounded-lg object-cover"
                      controls
                    />
                  ) : (
                    <>
                      <Video className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500">Click to upload video</p>
                      <p className="text-xs text-gray-400 mt-1">MP4, WebM up to 100MB</p>
                    </>
                  )}
                  <input
                    ref={videoRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter activation title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter activation description"
                />
              </div>

              {/* Compact External Link Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-4">External Link</h3>
                <div className="grid grid-cols-[120px,1fr,2fr] gap-4 items-start">
                  <div>
                    <div 
                      onClick={() => linkImageRef.current?.click()}
                      className="relative h-[80px] w-[80px] rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center justify-center"
                    >
                      {formData.external_link.image_url ? (
                        <img
                          src={formData.external_link.image_url}
                          alt="Link thumbnail"
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-gray-400" />
                      )}
                      <input
                        ref={linkImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLinkImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formData.external_link.title}
                      onChange={(e) => setFormData({
                        ...formData,
                        external_link: { ...formData.external_link, title: e.target.value }
                      })}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Link title"
                    />
                  </div>

                  <div>
                    <input
                      type="url"
                      value={formData.external_link.url}
                      onChange={(e) => setFormData({
                        ...formData,
                        external_link: { ...formData.external_link, url: e.target.value }
                      })}
                      className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Activation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}