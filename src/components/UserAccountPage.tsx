import React, { useState } from 'react';
import { Upload, X, LayoutDashboard, TextSelection as Collection, Zap, Instagram, Twitter, Share2, Linkedin } from 'lucide-react';
import { User } from '../types';
import { TimeSeriesGraph } from './TimeSeriesGraph';
import { CollectionsPage } from './CollectionsPage';
import { ActivationsPage } from './ActivationsPage';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User Account</h3>
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete the account for <span className="font-medium text-gray-900">{userName}</span>?
        </p>
        <p className="text-red-600 text-sm mb-6">
          This action cannot be undone. All user data, including collections and activations will be permanently deleted.
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
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

interface UserAccountPageProps {
  user: User;
  onClose: () => void;
  onDashboardClick: () => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({
  user,
  onClose,
  onDashboardClick,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'collections' | 'activations'>('dashboard');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.name.split(' ')[0] || '',
    last_name: user.name.split(' ')[1] || '',
    username: user.username || '',
    email: user.email,
    password: '',
    profile: user.description || '',
    date_of_birth: '',
    phone: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'N/A',
    social_media: {
      x: '',
      instagram: '',
      tiktok: '',
      linkedin: '',
    },
  });

  if (activeTab === 'collections') {
    return (
      <CollectionsPage
        user={user}
        onClose={onClose}
        onDashboardClick={onDashboardClick}
        onNavigate={setActiveTab}
      />
    );
  }

  if (activeTab === 'activations') {
    return (
      <ActivationsPage
        user={user}
        onClose={onClose}
        onDashboardClick={onDashboardClick}
        onNavigate={setActiveTab}
      />
    );
  }

  const metrics = {
    main: [
      { label: 'Scans Count', value: '946' },
      { label: 'Collections Count', value: '487' },
      { label: 'Activations Count', value: '744' },
    ],
    secondary: [
      { label: 'Collection Views', value: '1091' },
      { label: 'Activation Views', value: '806' },
      { label: 'Likes Count', value: '1170' },
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting user:', user.id);
    setIsDeleteDialogOpen(false);
    onClose();
  };

  const metricsColors = {
    collections: '#82ca9d',
    views: '#8884d8',
    activations: '#ffc658',
    scans: '#ff7300',
    likes: '#d53e4f',
  };

  const mockTimeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      timestamp: date.toISOString(),
      collections: Math.floor(Math.random() * 100) + 400,
      views: Math.floor(Math.random() * 100) + 800,
      activations: Math.floor(Math.random() * 100) + 600,
      scans: Math.floor(Math.random() * 100) + 900,
      likes: Math.floor(Math.random() * 100) + 1000,
    };
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 
              className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={onDashboardClick}
            >
              Admin Dashboard
            </h1>
            <span className="text-gray-500">&gt;</span>
            <h2 className="text-3xl font-bold text-blue-600">User Account</h2>
          </div>
          <button
            onClick={onClose}
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
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>User Summary</span>
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'collections'
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Collection className="w-5 h-5" />
                <span>Collections</span>
              </button>
              <button
                onClick={() => setActiveTab('activations')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'activations'
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Activations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-200 overflow-hidden cursor-pointer hover:bg-gray-300 transition-colors">
                    <Upload className="w-8 h-8 text-gray-500 mb-1" />
                    <span className="text-xs text-gray-500">512 x 512</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Description
                    </label>
                    <textarea
                      value={formData.profile}
                      onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Write a brief description..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Graph */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-[400px]">
                <TimeSeriesGraph
                  data={mockTimeSeriesData}
                  metrics={['collections', 'views', 'activations', 'scans', 'likes']}
                  colors={metricsColors}
                />
              </div>
            </div>

            {/* Main Metrics Grid - Adjusted margin */}
            <div className="grid grid-cols-3 gap-4 mt-[100px]">
              {metrics.main.map((metric) => (
                <div key={metric.label} className="bg-white rounded-lg shadow p-4 h-[88px]">
                  <h3 className="text-sm text-gray-500">{metric.label}</h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* User Information Form */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col" style={{ minHeight: '479px' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">User Information</h3>
              </div>

              <form id="userForm" onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex space-x-4">
                      {(['MALE', 'FEMALE', 'N/A'] as const).map((gender) => (
                        <label key={gender} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as typeof formData.gender })}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Twitter className="w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://x.com/username"
                          value={formData.social_media.x}
                          onChange={(e) => setFormData({
                            ...formData,
                            social_media: { ...formData.social_media, x: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Instagram className="w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://instagram.com/username"
                          value={formData.social_media.instagram}
                          onChange={(e) => setFormData({
                            ...formData,
                            social_media: { ...formData.social_media, instagram: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://tiktok.com/@username"
                          value={formData.social_media.tiktok}
                          onChange={(e) => setFormData({
                            ...formData,
                            social_media: { ...formData.social_media, tiktok: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Linkedin className="w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={formData.social_media.linkedin}
                          onChange={(e) => setFormData({
                            ...formData,
                            social_media: { ...formData.social_media, linkedin: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                </div>

                {/* Footer with Save and Delete buttons */}
                <div className="flex justify-between pt-6 mt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Delete User
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Secondary Metrics Grid - Same margin as left side */}
            <div className="grid grid-cols-3 gap-4 mt-[100px]">
              {metrics.secondary.map((metric) => (
                <div key={metric.label} className="bg-white rounded-lg shadow p-4 h-[88px]">
                  <h3 className="text-sm text-gray-500">{metric.label}</h3>
                  <p className="text-xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        userName={`${formData.first_name} ${formData.last_name}`.trim()}
      />
    </div>
  );
};