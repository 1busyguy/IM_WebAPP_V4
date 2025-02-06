import { useState, useRef } from 'react';
import { useCollectionStore } from '../../store/collectionStore';
import { X, Upload, Wand, Check } from 'lucide-react';
import { handleImageUpload } from '../../lib/storage';
import { analyzeImage } from '../../lib/vision';
import type { Database } from '../../types/supabase';

type Activation = Database['public']['Tables']['activations']['Row'];

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  availableActivations: Activation[];
}

const CATEGORIES = [
  'Art & Design',
  'Business',
  'Education',
  'Entertainment',
  'Fashion',
  'Food & Drink',
  'Health & Fitness',
  'Lifestyle',
  'Music',
  'Photography',
  'Sports',
  'Technology',
  'Travel',
  'Other'
];

export function CreateCollectionModal({ isOpen, onClose, userId, availableActivations }: CreateCollectionModalProps) {
  const { createCollection } = useCollectionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Refs for file inputs
  const coverImageRef = useRef<HTMLInputElement>(null);
  const linkImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    cover_image_url: '',
    activation_ids: [] as string[],
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

      // Prepare external link data if provided
      const externalLink = formData.external_link.title && formData.external_link.url
        ? {
            title: formData.external_link.title,
            url: formData.external_link.url,
            image_url: formData.external_link.image_url || null
          }
        : undefined;

      // Create the collection
      await createCollection({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category || null,
        cover_image_url: formData.cover_image_url || null,
        activation_ids: formData.activation_ids,
        user_id: userId,
        external_link: externalLink
      });

      onClose();
    } catch (err) {
      console.error('Failed to create collection:', err);
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAnalyzing(true);
      const url = await handleImageUpload(file);
      setFormData(prev => ({ ...prev, cover_image_url: url }));

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

  const toggleActivation = (activationId: string) => {
    setFormData(prev => ({
      ...prev,
      activation_ids: prev.activation_ids.includes(activationId)
        ? prev.activation_ids.filter(id => id !== activationId)
        : [...prev.activation_ids, activationId]
    }));
  };

  const filteredActivations = availableActivations.filter(activation =>
    activation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-[1280px] max-w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Collection</h2>
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

        <div className="flex-1 overflow-hidden flex">
          {/* Left side - Collection details */}
          <div className="w-2/3 p-6 overflow-y-auto">
            <form id="collection-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div 
                  onClick={() => coverImageRef.current?.click()}
                  className="relative h-[240px] w-full rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center"
                >
                  {formData.cover_image_url ? (
                    <>
                      <img
                        src={formData.cover_image_url}
                        alt="Cover"
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
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload cover image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-gray-400 text-xs">({formData.title.length}/25)</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={25}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value.slice(0, 25) })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 text-xs">({formData.description.length}/250)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={250}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 250) })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter description"
                />
              </div>

              {/* External Link */}
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-3">External Link</h3>
                <div className="grid grid-cols-[80px,1fr,1.5fr] gap-3 items-start">
                  <div>
                    <div 
                      onClick={() => linkImageRef.current?.click()}
                      className="h-[60px] w-[60px] rounded-md border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center justify-center"
                    >
                      {formData.external_link.image_url ? (
                        <img
                          src={formData.external_link.image_url}
                          alt="Link thumbnail"
                          className="h-full w-full rounded-md object-cover"
                        />
                      ) : (
                        <Upload className="h-5 w-5 text-gray-400" />
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

                  <input
                    type="text"
                    value={formData.external_link.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      external_link: { ...formData.external_link, title: e.target.value }
                    })}
                    className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Link title"
                  />

                  <input
                    type="url"
                    value={formData.external_link.url}
                    onChange={(e) => setFormData({
                      ...formData,
                      external_link: { ...formData.external_link, url: e.target.value }
                    })}
                    className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right side - Activations selection */}
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Select Activations
                </h3>
                <input
                  type="text"
                  placeholder="Search activations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-2">
                {filteredActivations.map(activation => (
                  <div
                    key={activation.id}
                    onClick={() => toggleActivation(activation.id)}
                    className={`relative rounded-md border cursor-pointer p-3 transition-all ${
                      formData.activation_ids.includes(activation.id)
                        ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-50'
                        : 'border-gray-200 hover:border-indigo-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={activation.trigger_image_url}
                          alt={activation.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activation.title}
                        </p>
                        {activation.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {activation.description}
                          </p>
                        )}
                      </div>
                      {formData.activation_ids.includes(activation.id) && (
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-indigo-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {formData.activation_ids.length} activation{formData.activation_ids.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="collection-form"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Collection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}