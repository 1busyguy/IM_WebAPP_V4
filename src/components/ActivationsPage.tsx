import React, { useState } from 'react';
import { Plus, X, LayoutDashboard, TextSelection as Collection, Zap, Eye, Heart, Pencil, Trash2, Scan } from 'lucide-react';
import { User } from '../types';
import { CreateActivationModal } from './CreateActivationModal';
import { EditActivationModal } from './EditActivationModal';

interface ActivationsPageProps {
  user: User;
  onClose: () => void;
  onDashboardClick: () => void;
  onNavigate: (tab: 'dashboard' | 'collections' | 'activations') => void;
}

interface ActivationCard {
  id: string;
  title: string;
  description: string;
  color: string;
  stats: {
    scans: number;
    views: number;
    likes: number;
  };
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activationTitle: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activationTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Activation</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-medium text-gray-900">{activationTitle}</span>? This action cannot be undone.
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

const mockActivations: ActivationCard[] = [
  {
    id: '1',
    title: 'Summer Campaign',
    description: 'Seasonal promotion for summer products',
    color: generateRandomColor(),
    stats: {
      scans: 156,
      views: 433,
      likes: 89
    }
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'New product line introduction',
    color: generateRandomColor(),
    stats: {
      scans: 234,
      views: 645,
      likes: 112
    }
  },
  {
    id: '3',
    title: 'Holiday Special',
    description: 'Holiday season promotional campaign',
    color: generateRandomColor(),
    stats: {
      scans: 378,
      views: 828,
      likes: 245
    }
  },
  {
    id: '4',
    title: 'Brand Awareness',
    description: 'Building brand recognition campaign',
    color: generateRandomColor(),
    stats: {
      scans: 189,
      views: 456,
      likes: 67
    }
  },
  {
    id: '5',
    title: 'Customer Loyalty',
    description: 'Rewards program for loyal customers',
    color: generateRandomColor(),
    stats: {
      scans: 298,
      views: 741,
      likes: 156
    }
  },
  {
    id: '6',
    title: 'Flash Sale',
    description: 'Limited time promotional event',
    color: generateRandomColor(),
    stats: {
      scans: 145,
      views: 337,
      likes: 45
    }
  }
];

export const ActivationsPage: React.FC<ActivationsPageProps> = ({
  user,
  onClose,
  onDashboardClick,
  onNavigate,
}) => {
  const [activations, setActivations] = useState(mockActivations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivation, setSelectedActivation] = useState<ActivationCard | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activationToDelete, setActivationToDelete] = useState<ActivationCard | null>(null);

  const handleUserSummaryClick = () => {
    onNavigate('dashboard');
  };

  const handleCreateActivation = (activationData: {
    title: string;
    description: string;
    image: File | null;
    video: File | null;
    externalLinks: {
      title: string;
      url: string;
      image: File | null;
    }[];
  }) => {
    console.log('Creating activation:', activationData);
    setIsCreateModalOpen(false);
  };

  const handleEditClick = (activation: ActivationCard) => {
    setSelectedActivation(activation);
    setIsEditModalOpen(true);
  };

  const handleEditActivation = (activationData: any) => {
    console.log('Editing activation:', activationData);
    setIsEditModalOpen(false);
    setSelectedActivation(null);
  };

  const handleDeleteClick = (activation: ActivationCard) => {
    setActivationToDelete(activation);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (activationToDelete) {
      setActivations(activations.filter(a => a.id !== activationToDelete.id));
      setIsDeleteDialogOpen(false);
      setActivationToDelete(null);
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
            <h2 className="text-3xl font-bold text-blue-600">Activations</h2>
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
                onClick={() => onNavigate('collections')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <Collection className="w-5 h-5" />
                <span>Collections</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white shadow-md transform scale-105"
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
            <h3 className="text-xl font-semibold">My Activations</h3>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Activation</span>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {activations.map((activation) => (
              <div 
                key={activation.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* SVG Placeholder */}
                <div 
                  className="relative aspect-video flex items-center justify-center"
                  style={{ backgroundColor: activation.color }}
                >
                  <Zap className="w-16 h-16 text-gray-600 opacity-50" />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-2">{activation.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{activation.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Scan className="w-4 h-4" />
                        <span>{activation.stats.scans}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <Eye className="w-4 h-4" />
                        <span>{activation.stats.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-rose-600">
                        <Heart className="w-4 h-4" />
                        <span>{activation.stats.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleEditClick(activation)}
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleDeleteClick(activation)}
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

      <CreateActivationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateActivation}
      />

      {selectedActivation && (
        <EditActivationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedActivation(null);
          }}
          onSubmit={handleEditActivation}
          activation={{
            id: selectedActivation.id,
            title: selectedActivation.title,
            description: selectedActivation.description,
            image: null,
            video: null,
            externalLinks: [],
            color: selectedActivation.color
          }}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setActivationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        activationTitle={activationToDelete?.title || ''}
      />
    </div>
  );
};