import React, { useState, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';

interface ExternalLink {
  title: string;
  url: string;
  image: File | null;
  imagePreview?: string;
}

interface Activation {
  id: string;
  title: string;
  description: string;
  image: File | null;
  imagePreview?: string;
  video: File | null;
  videoPreview?: string;
  externalLinks: ExternalLink[];
  status: 'draft' | 'published';
}

interface EditActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activationData: Activation) => void;
  activation: Activation;
}

export const EditActivationModal: React.FC<EditActivationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activation
}) => {
  const [formData, setFormData] = useState<Activation>({
    id: '',
    title: '',
    description: '',
    image: null,
    video: null,
    externalLinks: [],
    status: 'draft', // Set default to draft
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [currentLink, setCurrentLink] = useState<ExternalLink>({
    title: '',
    url: '',
    image: null,
  });

  useEffect(() => {
    if (activation) {
      setFormData({
        ...activation,
        status: activation.status || 'draft', // Ensure status is set with draft as default
      });
      if (activation.imagePreview) {
        setImagePreview(activation.imagePreview);
      }
      if (activation.videoPreview) {
        setVideoPreview(activation.videoPreview);
      }
    }
  }, [activation]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, video: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentLink({
          ...currentLink,
          image: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addExternalLink = () => {
    if (currentLink.title.trim() && currentLink.url.trim() && currentLink.image) {
      setFormData({
        ...formData,
        externalLinks: [...formData.externalLinks, currentLink],
      });
      setCurrentLink({ title: '', url: '', image: null });
    }
  };

  const removeExternalLink = (index: number) => {
    setFormData({
      ...formData,
      externalLinks: formData.externalLinks.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Edit Activation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Media Uploads */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activation Image
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Image</span>
                        <span className="text-xs text-gray-400 mt-1">Upload HD images that match the Video Dimensions</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activation Video
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Video</span>
                        <span className="text-xs text-gray-400 mt-1">Upload HD video that match the Image Dimensions</span>
                        <span className="text-xs text-gray-400">25 meg max</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Text Fields and External Links */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External Links
                </label>
                <div className="space-y-4">
                  {formData.externalLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={link.imagePreview}
                          alt={link.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{link.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExternalLink(index)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ))}

                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {currentLink.imagePreview ? (
                          <img
                            src={currentLink.imagePreview}
                            alt="Link preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLinkImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={currentLink.title}
                          onChange={(e) => setCurrentLink({ ...currentLink, title: e.target.value })}
                          placeholder="Link title"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="url"
                            value={currentLink.url}
                            onChange={(e) => setCurrentLink({ ...currentLink, url: e.target.value })}
                            placeholder="https://"
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={addExternalLink}
                            disabled={!currentLink.title || !currentLink.url || !currentLink.image}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center space-x-3 mt-8 pt-6 border-t">
            {/* Status Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    formData.status === 'draft'
                      ? 'bg-gray-200 text-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    formData.status === 'published'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};