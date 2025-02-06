import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Search, Plus, Video, Pencil, Trash2 } from 'lucide-react';
import { useActivationStore } from '../../store/activationStore';
import { CreateActivationModal } from './CreateActivationModal';
import { EditActivationModal } from './EditActivationModal';
import { DeleteDialog } from '../ui/DeleteDialog';

export function ActivationList() {
  const { userId } = useParams<{ userId: string }>();
  const { activations, loading, error, fetchActivations, deleteActivation } = useActivationStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingActivation, setEditingActivation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingActivation, setDeletingActivation] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchActivations(userId);
    }
  }, [userId, fetchActivations]);

  const handleDelete = async () => {
    if (!deletingActivation) return;
    
    setDeleteLoading(true);
    try {
      await deleteActivation(deletingActivation);
      setDeletingActivation(null);
    } catch (error) {
      console.error('Failed to delete activation:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredActivations = activations.filter(activation =>
    activation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
        No user selected
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Activations</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Activation
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search activations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {filteredActivations.length === 0 ? (
        <div className="text-center py-12">
          <Play className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No activations</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new activation.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActivations.map((activation) => (
            <div
              key={activation.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative h-48">
                <img
                  src={activation.trigger_image_url}
                  alt={activation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <Video className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {activation.title}
                </h3>
                {activation.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {activation.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={activation.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Watch Video
                  </a>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingActivation(activation.id)}
                      className="inline-flex items-center p-1 border border-transparent text-sm font-medium rounded text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingActivation(activation.id)}
                      className="inline-flex items-center p-1 border border-transparent text-sm font-medium rounded text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {userId && (
        <>
          <CreateActivationModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            userId={userId}
          />
          <EditActivationModal
            isOpen={!!editingActivation}
            onClose={() => setEditingActivation(null)}
            activationId={editingActivation}
            userId={userId}
          />
          <DeleteDialog
            isOpen={!!deletingActivation}
            onClose={() => setDeletingActivation(null)}
            onConfirm={handleDelete}
            title="Delete Activation"
            message="Are you sure you want to delete this activation? This action cannot be undone and will permanently delete the activation and all associated data."
            loading={deleteLoading}
          />
        </>
      )}
    </div>
  );
}