import { useEffect, useState } from 'react';
import { usePartnerStore } from '../../store/partnerStore';
import { useUserStore } from '../../store/userStore';
import { useCollectionStore } from '../../store/collectionStore';
import { useActivationStore } from '../../store/activationStore';
import { Users, Building2, FolderKanban, Play, Search, SortAsc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreatePartnerModal } from './CreatePartnerModal';

export function PartnerList() {
  const { partners, loading, error, fetchPartners } = usePartnerStore();
  const { users, fetchUsers } = useUserStore();
  const { collections, fetchCollections } = useCollectionStore();
  const { activations, fetchActivations } = useActivationStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'users' | 'collections' | 'activations'>('name');

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Fetch all data for each partner
  useEffect(() => {
    const fetchAllData = async () => {
      for (const partner of partners) {
        // Fetch users for this partner
        await fetchUsers(partner.id);
        
        // Get all users for this partner
        const partnerUsers = users.filter(user => user.partner_id === partner.id);
        
        // Fetch collections and activations for each user
        for (const user of partnerUsers) {
          await fetchCollections(user.id);
          await fetchActivations(user.id);
        }
      }
    };

    if (partners.length > 0) {
      fetchAllData();
    }
  }, [partners, fetchUsers, fetchCollections, fetchActivations]);

  const getPartnerCounts = (partnerId: string) => {
    // Get all users for this partner
    const partnerUsers = users.filter(user => user.partner_id === partnerId);
    const userIds = partnerUsers.map(user => user.id);

    return {
      users: partnerUsers.length,
      collections: collections.filter(c => userIds.includes(c.user_id)).length,
      activations: activations.filter(a => userIds.includes(a.user_id)).length
    };
  };

  const filteredPartners = partners
    .filter(partner => 
      partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.company_name.localeCompare(b.company_name);
        case 'users':
          return getPartnerCounts(b.id).users - getPartnerCounts(a.id).users;
        case 'collections':
          return getPartnerCounts(b.id).collections - getPartnerCounts(a.id).collections;
        case 'activations':
          return getPartnerCounts(b.id).activations - getPartnerCounts(a.id).activations;
        default:
          return 0;
      }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Partners</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Partner
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <SortAsc className="h-5 w-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="name">Company Name</option>
            <option value="users">Users Count</option>
            <option value="collections">Collections Count</option>
            <option value="activations">Activations Count</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => {
          const counts = getPartnerCounts(partner.id);
          return (
            <Link
              key={partner.id}
              to={`/partners/${partner.id}`}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {partner.avatar_url ? (
                      <img
                        src={partner.avatar_url}
                        alt={partner.company_name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {partner.company_name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {partner.first_name} {partner.last_name}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{counts.users} Users</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FolderKanban className="h-4 w-4" />
                    <span>{counts.collections} Collections</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{counts.activations} Activations</span>
                  </div>
                </div>

                {partner.company_description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {partner.company_description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <CreatePartnerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}