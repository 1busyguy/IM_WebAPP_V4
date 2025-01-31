import React, { useState } from 'react';
import { MetricsCard } from './components/MetricsCard';
import { TimeSeriesGraph } from './components/TimeSeriesGraph';
import { PartnersList } from './components/PartnersList';
import { UsersList } from './components/UsersList';
import { PartnerDetails } from './components/PartnerDetails';
import { PartnerLeaderboard } from './components/PartnerLeaderboard';
import { CreatePartnerModal } from './components/CreatePartnerModal';
import { CreatePartnerUserModal } from './components/CreatePartnerUserModal';
import { UserAccountPage } from './components/UserAccountPage';
import { Search, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import type { Partner, User, Metrics } from './types';

// Mock data
const mockMetrics: Metrics = {
  partners_count: Math.floor(Math.random() * 50) + 20,
  users_count: Math.floor(Math.random() * 250) + 100,
  collections_count: Math.floor(Math.random() * 500) + 200,
  activations_count: Math.floor(Math.random() * 800) + 300,
  scans_count: Math.floor(Math.random() * 900) + 400,
  collection_views: Math.floor(Math.random() * 950) + 450,
  activation_views: Math.floor(Math.random() * 900) + 400,
  likes_count: Math.floor(Math.random() * 850) + 350,
};

const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  const oneYear = new Date(now);
  oneYear.setFullYear(now.getFullYear() - 1);

  const baseValues = {
    partners: 450,
    users: 500,
    collections: 550,
    activations: 600,
    scans: 650,
    likes: 700,
    views: 750,
  };

  const monthlyGrowth = {
    partners: 1.04 + Math.random() * 0.02,
    users: 1.05 + Math.random() * 0.02,
    collections: 1.045 + Math.random() * 0.02,
    activations: 1.055 + Math.random() * 0.02,
    scans: 1.05 + Math.random() * 0.02,
    likes: 1.06 + Math.random() * 0.02,
    views: 1.065 + Math.random() * 0.02,
  };

  let currentValues = { ...baseValues };

  for (let date = new Date(oneYear); date <= now; date.setDate(date.getDate() + 1)) {
    const monthStart = date.getDate() === 1;
    
    if (monthStart) {
      Object.keys(currentValues).forEach(metric => {
        currentValues[metric] = Math.round(currentValues[metric] * monthlyGrowth[metric]);
      });
    }

    const dayData = {
      timestamp: date.toISOString(),
      partners: Math.round(currentValues.partners * (1 + (Math.random() - 0.5) * 0.1)),
      users: Math.round(currentValues.users * (1 + (Math.random() - 0.5) * 0.15)),
      collections: Math.round(currentValues.collections * (1 + (Math.random() - 0.5) * 0.12)),
      activations: Math.round(currentValues.activations * (1 + (Math.random() - 0.5) * 0.13)),
      scans: Math.round(currentValues.scans * (1 + (Math.random() - 0.5) * 0.14)),
      likes: Math.round(currentValues.likes * (1 + (Math.random() - 0.5) * 0.16)),
      views: Math.round(currentValues.views * (1 + (Math.random() - 0.5) * 0.11)),
    };

    if (Math.random() < 0.05) {
      const metrics = Object.keys(dayData).filter(key => key !== 'timestamp');
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
      const spikeMultiplier = Math.random() < 0.7 ? 1.2 : 0.85;
      dayData[randomMetric] = Math.round(dayData[randomMetric] * spikeMultiplier);
    }

    data.push(dayData);
  }

  return data;
};

const mockTimeSeriesData = generateTimeSeriesData();

const mockPartners: Partner[] = [
  {
    id: 'p11',
    first_name: 'Sarah',
    last_name: 'Chen',
    company_name: 'TechVision Solutions',
    description: 'Pioneering AI-driven solutions for enterprise automation and digital transformation.',
    username: 'techvision',
    email: 'sarah.chen@techvision.io',
    logo_url: 'https://source.unsplash.com/100x100/?tech',
    managers_count: 8,
    users_count: 175,
    collections_count: 90,
    activations_count: 120,
    scans_count: 130,
    likes_count: 220,
    views_count: 250,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p12',
    first_name: 'Marcus',
    last_name: 'Rodriguez',
    company_name: 'EcoSmart Industries',
    description: 'Sustainable manufacturing solutions for a greener tomorrow.',
    username: 'ecosmart',
    email: 'marcus@ecosmart.com',
    logo_url: 'https://source.unsplash.com/100x100/?green',
    managers_count: 12,
    users_count: 120,
    collections_count: 110,
    activations_count: 80,
    scans_count: 190,
    likes_count: 190,
    views_count: 180,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p13',
    first_name: 'Emma',
    last_name: 'Thompson',
    company_name: 'HealthPlus Medical',
    description: 'Advanced healthcare technology solutions for modern medical facilities.',
    username: 'healthplus',
    email: 'emma.t@healthplus.med',
    logo_url: 'https://source.unsplash.com/100x100/?medical',
    managers_count: 15,
    users_count: 220,
    collections_count: 150,
    activations_count: 180,
    scans_count: 220,
    likes_count: 250,
    views_count: 220,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p14',
    first_name: 'Alexander',
    last_name: 'Petrov',
    company_name: 'Quantum Dynamics',
    description: 'Cutting-edge quantum computing solutions for complex data processing.',
    username: 'quantumdyn',
    email: 'alex@quantumdynamics.tech',
    logo_url: 'https://source.unsplash.com/100x100/?quantum',
    managers_count: 6,
    users_count: 150,
    collections_count: 80,
    activations_count: 110,
    scans_count: 150,
    likes_count: 180,
    views_count: 120,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p15',
    first_name: 'Sophia',
    last_name: 'Nakamura',
    company_name: 'FoodTech Innovations',
    description: 'Revolutionary food technology solutions for sustainable agriculture and smart kitchens.',
    username: 'foodtech',
    email: 'sophia@foodtech.io',
    logo_url: 'https://source.unsplash.com/100x100/?food',
    managers_count: 10,
    users_count: 195,
    collections_count: 140,
    activations_count: 160,
    scans_count: 210,
    likes_count: 280,
    views_count: 310,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `u${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  avatar_url: `https://source.unsplash.com/100x100/?portrait&sig=${i}`,
  partner_id: mockPartners[i % mockPartners.length].id,
  collections_count: Math.floor(Math.random() * 25) + 5,
  activations_count: Math.floor(Math.random() * 30) + 10,
  scans_count: Math.floor(Math.random() * 40) + 15,
  likes_count: Math.floor(Math.random() * 50) + 20,
  views_count: Math.floor(Math.random() * 60) + 25,
  is_active: true,
  created_at: new Date().toISOString(),
}));

function App() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const selectedPartner = partners.find((p) => p.id === selectedPartnerId);
  const associatedUsers = users.filter((u) => u.partner_id === selectedPartnerId);

  const handleDashboardClick = () => {
    setSelectedUser(null);
    setSelectedPartnerId(null);
  };

  const handlePartnerSelect = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setIsLeaderboardExpanded(true);
  };

  const handlePartnerClose = () => {
    setSelectedPartnerId(null);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleUserClose = () => {
    setSelectedUser(null);
  };

  const handleReturnToUserSummary = () => {
    setSelectedUser(selectedUser);
  };

  const handleCreatePartner = (partnerData: {
    first_name: string;
    last_name: string;
    company_name: string;
    description: string;
    username: string;
    email: string;
  }) => {
    console.log('Creating partner:', partnerData);
    setIsCreateModalOpen(false);
  };

  const handleCreateUser = (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    gender: 'MALE' | 'FEMALE' | 'N/A';
    date_of_birth: string;
    social_media: {
      x: string;
      instagram: string;
      tiktok: string;
    };
    profile_picture: File | null;
  }) => {
    console.log('Creating user:', userData);
    setIsCreateUserModalOpen(false);
  };

  const handleTogglePartner = (partnerId: string, isActive: boolean) => {
    setPartners(prevPartners =>
      prevPartners.map(partner =>
        partner.id === partnerId ? { ...partner, is_active: isActive } : partner
      )
    );
  };

  const handleToggleUser = (userId: string, isActive: boolean) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, is_active: isActive } : user
      )
    );
  };

  const filteredPartners = partners.filter(partner =>
    partner.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = associatedUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const metricsColors = {
    partners: '#ff7300',
    users: '#8884d8',
    collections: '#82ca9d',
    activations: '#ffc658',
    scans: '#d53e4f',
    likes: '#fc8d59',
    views: '#99d594',
  };

  if (selectedUser) {
    return (
      <UserAccountPage 
        user={selectedUser} 
        onClose={handleUserClose}
        onDashboardClick={handleDashboardClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 
          className="text-3xl font-bold mb-6 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleDashboardClick}
        >
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side - 1/2 width */}
          <div className="space-y-6">
            {/* Top Graph - 2/3 height */}
            <div className="bg-white rounded-lg shadow p-4" style={{ height: 'calc(66vh - 6rem)' }}>
              <div className="w-full h-full">
                <TimeSeriesGraph
                  data={mockTimeSeriesData}
                  metrics={['partners', 'users', 'collections', 'activations', 'scans', 'views']}
                  colors={metricsColors}
                />
              </div>
            </div>

            {/* Bottom Metrics - 1/3 height */}
            <div className="bg-white rounded-lg shadow" style={{ height: 'calc(33vh - 6rem)' }}>
              <h2 className="text-xl font-semibold p-4">Overall Metrics</h2>
              <MetricsCard metrics={mockMetrics} />
            </div>
          </div>

          {/* Right Side - 1/2 width */}
          <div className="space-y-6">
            {/* Top Right - Partner Details or Leaderboard */}
            <div 
              className={`bg-white rounded-lg shadow transition-all duration-300 ease-in-out ${
                isLeaderboardExpanded ? 'h-[calc(66vh-6rem)]' : 'h-16'
              }`}
            >
              {selectedPartner ? (
                <PartnerDetails
                  partner={selectedPartner}
                  timeSeriesData={mockTimeSeriesData}
                  metricsColors={metricsColors}
                  onClose={handlePartnerClose}
                  isGraphExpanded={isLeaderboardExpanded}
                />
              ) : (
                <PartnerLeaderboard
                  partners={partners}
                  isExpanded={isLeaderboardExpanded}
                  onToggleExpand={() => setIsLeaderboardExpanded(!isLeaderboardExpanded)}
                />
              )}
            </div>

            {/* Bottom Right - Partners/Users List */}
            <div 
              className={`bg-white rounded-lg shadow transition-all duration-300 ease-in-out ${
                isLeaderboardExpanded ? 'h-[calc(33vh-6rem)]' : 'h-[calc(100vh-22rem)]'
              }`}
            >
              {selectedPartner ? (
                <>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-semibold">Users</h2>
                      <button
                        onClick={() => setIsCreateUserModalOpen(true)}
                        className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <button
                      onClick={() => setIsLeaderboardExpanded(!isLeaderboardExpanded)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isLeaderboardExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="relative w-full max-w-md mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="overflow-auto" style={{ maxHeight: isLeaderboardExpanded ? 'calc(33vh - 15rem)' : 'calc(100vh - 31rem)' }}>
                      <UsersList
                        users={filteredUsers}
                        onToggleUser={handleToggleUser}
                        onUserSelect={handleUserSelect}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-semibold">Partners</h2>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <button
                      onClick={() => setIsLeaderboardExpanded(!isLeaderboardExpanded)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isLeaderboardExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="relative w-full max-w-md mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search partners..."
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="overflow-auto" style={{ maxHeight: isLeaderboardExpanded ? 'calc(33vh - 15rem)' : 'calc(100vh - 31rem)' }}>
                      <PartnersList
                        partners={filteredPartners}
                        selectedPartnerId={selectedPartnerId}
                        onPartnerSelect={handlePartnerSelect}
                        onTogglePartner={handleTogglePartner}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreatePartnerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePartner}
      />

      <CreatePartnerUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}

export default App;