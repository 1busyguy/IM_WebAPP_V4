import React, { useState } from 'react';
import { X, Upload, Plus, XCircle } from 'lucide-react';

interface ExternalLink {
  title: string;
  url: string;
  image: File | null;
  imagePreview?: string;
}

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (collectionData: {
    title: string;
    description: string;
    category: string;
    activations: string[];
    externalLinks: ExternalLink[];
    cover_image: File | null;
  }) => void;
}

const CATEGORIES = [
  'Art & Design',
  'Technology',
  'Fashion',
  'Music',
  'Sports',
  'Food & Drink',
  'Travel',
  'Education',
  'Entertainment',
  'Business',
  'Health & Wellness',
  'Lifestyle'
];

const ACTIVATIONS = [
  { id: 'summer-campaign', name: 'Summer Campaign 2024' },
  { id: 'product-launch', name: 'New Product Launch' },
  { id: 'holiday-special', name: 'Holiday Special Event' },
  { id: 'brand-awareness', name: 'Brand Awareness Campaign' },
  { id: 'customer-loyalty', name: 'Customer Loyalty Program' },
  { id: 'flash-sale', name: 'Flash Sale Event' }
];

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    activations: [] as string[],
    externalLinks: [] as ExternalLink[],
    cover_image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentLink, setCurrentLink] = useState<ExternalLink>({
    title: '',
    url: '',
    image: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, cover_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
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

  const handleActivationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId && !formData.activations.includes(selectedId)) {
      setFormData({
        ...formData,
        activations: [...formData.activations, selectedId],
      });
      e.target.value = ''; // Reset select after selection
    }
  };

  const removeActivation = (activationId: string) => {
    setFormData({
      ...formData,
      activations: formData.activations.filter(id => id !== activationId),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Create New Collection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Cover
                </label>
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Image</span>
                        <span className="text-xs text-gray-400 mt-1">1920 x 1080 recommended</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {previewUrl && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData({ ...formData, cover_image: null });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                  required
                  style={{ minHeight: '100px' }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activations
                </label>
                <div className="space-y-3">
                  <select
                    onChange={handleActivationChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Add activation</option>
                    {ACTIVATIONS.filter(activation => !formData.activations.includes(activation.id)).map((activation) => (
                      <option key={activation.id} value={activation.id}>
                        {activation.name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.activations.map((activationId) => {
                      const activation = ACTIVATIONS.find(a => a.id === activationId);
                      return (
                        <div
                          key={activationId}
                          className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
                        >
                          <span className="text-sm">{activation?.name}</span>
                          <button
                            type="button"
                            onClick={() => removeActivation(activationId)}
                            className="hover:text-blue-900"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
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
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};