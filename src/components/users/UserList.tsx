import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useActivationStore } from '../../store/activationStore';
import { useCollectionStore } from '../../store/collectionStore';
import { User, FolderKanban, Play, Search } from 'lucide-react';
import { CreateUserModal } from './CreateUserModal';

export function UserList() {
  const navigate = useNavigate();
  const { partnerId } = useParams<{ partnerId: string }>();
  const { users, loading, error, fetchUsers } = useUserStore();
  const { activations, fetchActivations } = useActivationStore();
  const { collections, fetchCollections } = useCollectionStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (partnerId) {
      fetchUsers(partnerId);
    }
  }, [partnerId, fetchUsers]);

  // Fetch collections and activations for all users
  useEffect(() => {
    const fetchUserData = async () => {
      for (const user of users) {
        await fetchCollections(user.id);
        await fetchActivations(user.id);
      }
    };
    
    if (users.length > 0) {
      fetchUserData();
    }
  }, [users, fetchCollections, fetchActivations]);

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get counts for each user
  const getUserCounts = (userId: string) => ({
    collections: collections.filter(c => c.user_id === userId).length,
    activations: activations.filter(a => a.user_id === userId).length
  });

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

  if (!partnerId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
        No partner selected
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add User
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => {
          const counts = getUserCounts(user.id);
          return (
            <div
              key={user.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-around text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FolderKanban className="h-4 w-4" />
                    <span>{counts.collections} Collections</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{counts.activations} Activations</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/users/${user.id}/collections`)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => navigate(`/users/${user.id}/activations`)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    Activations
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        partnerId={partnerId}
      />
    </div>
  );
}