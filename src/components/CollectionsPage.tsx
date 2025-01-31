import React, { useState } from 'react';
import { Plus, X, LayoutDashboard, TextSelection as Collection, Zap, Eye, Heart, Pencil, Trash2, Scan } from 'lucide-react';
import { User } from '../types';
import { CreateCollectionModal } from './CreateCollectionModal';
import { EditCollectionModal } from './EditCollectionModal';

interface CollectionsPageProps {
  user: User;
  onClose: () => void;
  onDashboardClick: () => void;
  onNavigate: (tab: 'dashboard' | 'collections' | 'activations') => void;
}

interface CollectionCard {
  id: string;
  title: string;
  description: string;
  color: string;
  category: string;
  activations: string[];
  externalLinks: {
    title: string;
    url: string;
    image: File | null;
    imagePreview?: string;
  }[];
  cover_image: File | null;
  imagePreview?: string;
  stats: {
    activations: number;
    scans: number;
    views: number;
    likes: number;
  };
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  collectionTitle: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collectionTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Collection</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-900">{collectionTitle}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 90%)`;
};

const mockCollections: CollectionCard[] = [
  {
    id: '1',
    title: 'Farah.AI',
    description: 'The Many sides to Farah AI',
    color: generateRandomColor(),
    category: 'Technology',
    activations: ['summer-campaign', 'product-launch'],
    externalLinks: [],
    cover_image: null,
    stats: {
      activations: 89,
      scans: 156,
      views: 33,
      likes: 0
    }
  },
  {
    id: '2',
    title: 'Digital Art Collection',
    description: 'Exploring the boundaries of digital creativity',
    color: generateRandomColor(),
    category: 'Art',
    activations: [],
    externalLinks: [],
    cover_image: null,
    stats: {
      activations: 67,
      scans: 234,
      views: 45,
      likes: 12
    }
  },
  {
    id: '3',
    title: 'Future Tech',
    description: 'Tomorrow\'s innovations today',
    color: generateRandomColor(),
    category: 'Technology',
    activations: [],
    externalLinks: [],
    cover_image: null,
    stats: {
      activations: 45,
      scans: 178,
      views: 28,
      likes: 15
    }
  },
  {
    id: '4',
    title: 'AI Portraits',
    description: 'The art of artificial intelligence',
    color: generateRandomColor(),
    category: 'Art',
    activations: [],
    externalLinks: [],
    cover_image: null,
    stats: {
      activations: 112,
      scans: 289,
      views: 56,
      likes: 23
    }
  },
  {
    id: '5',
    title: 'Virtual Worlds',
    description: 'Exploring digital landscapes',
    color: generateRandomColor(),
    category: 'Technology',
    activations: [],
    externalLinks: [],
    cover_image: null,
    stats: {
      activations: 78,
      scans: 198,
      views: 41,
      likes: 18
    }
  },
  {
    id: '6',
    title: 'Tech Fusion',
    description: 'Where technology meets art',
    color: generateRandomColor(),
    category: 'Technology',
    activations: [],
    externalLinks: [],
    cover_image: null,
    stats: {
      activations: 94,
      scans: 245,
      views: 37,
      likes: 9
    }
  }
];

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  user,
  onClose,
  onDashboardClick,
  onNavigate,
}) => {
  const [collections, setCollections] = useState(mockCollections);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionCard | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<CollectionCard | null>(null);

  const handleUserSummaryClick = () => {
    onNavigate('dashboard');
  };

  const handleCreateCollection = (collectionData: {
    title: string;
    description: string;
    category: string;
    activations: string[];
    externalLinks: {
      title: string;
      url: string;
      image: File | null;
    }[];
    cover_image: File | null;
  }) => {
    console.log('Creating collection:', collectionData);
    setIsCreateModalOpen(false);
  };

  const handleEditCollection = (collectionData: CollectionCard) => {
    console.log('Editing collection:', collectionData);
    setIsEditModalOpen(false);
    setSelectedCollection(null);
  };

  const handleEditClick = (collection: CollectionCard) => {
    setSelectedCollection(collection);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (collection: CollectionCard) => {
    setCollectionToDelete(collection);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (collectionToDelete) {
      setCollections(collections.filter(c => c.id !== collectionToDelete.id));
      setIsDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h1 
              className="text-3xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={onDashboardClick}
            >
              Admin Dashboard
            </h1>
            <span className="text-gray-500">&gt;</span>
            <h2 
              className="text-3xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleUserSummaryClick}
            >
              User Account
            </h2>
            <span className="text-gray-500">&gt;</span>
            <h2 className="text-3xl font-bold text-blue-600">Collections</h2>
          </div>
          <button
            onClick={onDashboardClick}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-8 py-3">
              <button
                onClick={handleUserSummaryClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>User Summary</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white shadow-md transform scale-105"
              >
                <Collection className="w-5 h-5" />
                <span>Collections</span>
              </button>
              <button
                onClick={() => onNavigate('activations')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <Zap className="w-5 h-5" />
                <span>Activations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">My Collections</h3>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Collection</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div 
                key={collection.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div 
                  className="relative aspect-video flex items-center justify-center"
                  style={{ backgroundColor: collection.color }}
                >
                  <Collection className="w-16 h-16 text-gray-600 opacity-50" />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-2">{collection.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Scan className="w-4 h-4" />
                        <span>{collection.stats.scans}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Eye className="w-4 h-4" />
                        <span>{collection.stats.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-rose-600">
                        <Heart className="w-4 h-4" />
                        <span>{collection.stats.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Zap className="w-4 h-4" />
                        <span>{collection.stats.activations}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleEditClick(collection)}
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleDeleteClick(collection)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCollection}
      />

      {selectedCollection && (
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCollection(null);
          }}
          onSubmit={handleEditCollection}
          collection={selectedCollection}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCollectionToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        collectionTitle={collectionToDelete?.title || ''}
      />
    </div>
  );
};