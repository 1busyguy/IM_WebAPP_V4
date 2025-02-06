import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FolderKanban, Search, Plus, Play, Pencil, Trash2 } from 'lucide-react';
import { useCollectionStore } from '../../store/collectionStore';
import { useActivationStore } from '../../store/activationStore';
import { CreateCollectionModal } from './CreateCollectionModal';
import { EditCollectionModal } from './EditCollectionModal';
import { DeleteDialog } from '../ui/DeleteDialog';

export function CollectionList() {
  const { userId } = useParams<{ userId: string }>();
  const { collections, loading, error, fetchCollections, deleteCollection } = useCollectionStore();
  const { activations, fetchActivations } = useActivationStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingCollection, setDeletingCollection] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCollections(userId);
      fetchActivations(userId);
    }
  }, [userId, fetchCollections, fetchActivations]);

  const handleDelete = async () => {
    if (!deletingCollection) return;
    
    setDeleteLoading(true);
    try {
      await deleteCollection(deletingCollection);
      setDeletingCollection(null);
    } catch (error) {
      console.error('Failed to delete collection:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2 className="text-2xl font-bold text-gray-900">Collections</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Collection
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {filteredCollections.length === 0 ? (
        <div className="text-center py-12">
          <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new collection.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => {
            const collectionActivations = activations.filter(
              activation => collection.activation_ids?.includes(activation.id)
            );

            return (
              <div
                key={collection.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative h-48">
                  {collection.cover_image_url ? (
                    <img
                      src={collection.cover_image_url}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FolderKanban className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {collection.category && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {collection.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {collection.description}
                    </p>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Play className="h-4 w-4 mr-1" />
                      <span>{collectionActivations.length} Activations</span>
                    </div>
                    {collectionActivations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {collectionActivations.map(activation => (
                          <span
                            key={activation.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {activation.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingCollection(collection.id)}
                      className="inline-flex items-center p-1 border border-transparent text-sm font-medium rounded text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCollection(collection.id)}
                      className="inline-flex items-center p-1 border border-transparent text-sm font-medium rounded text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {userId && (
        <>
          <CreateCollectionModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            userId={userId}
            availableActivations={activations}
          />
          <EditCollectionModal
            isOpen={!!editingCollection}
            onClose={() => setEditingCollection(null)}
            collectionId={editingCollection}
            userId={userId}
            availableActivations={activations}
          />
          <DeleteDialog
            isOpen={!!deletingCollection}
            onClose={() => setDeletingCollection(null)}
            onConfirm={handleDelete}
            title="Delete Collection"
            message="Are you sure you want to delete this collection? This action cannot be undone and will permanently delete the collection and all associated data."
            loading={deleteLoading}
          />
        </>
      )}
    </div>
  );
}