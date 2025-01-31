import React from 'react';
import { Trophy, Users, Scan, Eye, TextSelection as Collection, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Partner } from '../types';
import { generatePastelColor } from '../utils/colorUtils';

interface PartnerLeaderboardProps {
  partners: Partner[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface LeaderboardCategory {
  title: string;
  icon: React.ReactNode;
  key: keyof Partner;
}

export const PartnerLeaderboard: React.FC<PartnerLeaderboardProps> = ({ 
  partners,
  isExpanded,
  onToggleExpand
}) => {
  const categories: LeaderboardCategory[] = [
    { title: 'Most Users', icon: <Users className="w-5 h-5" />, key: 'users_count' },
    { title: 'Most Scans', icon: <Scan className="w-5 h-5" />, key: 'scans_count' },
    { title: 'Most Views', icon: <Eye className="w-5 h-5" />, key: 'views_count' },
    { title: 'Most Collections', icon: <Collection className="w-5 h-5" />, key: 'collections_count' },
    { title: 'Most Activations', icon: <Zap className="w-5 h-5" />, key: 'activations_count' },
  ];

  const getTopPartner = (key: keyof Partner) => {
    return [...partners].sort((a, b) => (b[key] as number) - (a[key] as number))[0];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Partner Leaderboard</h2>
        <button
          onClick={onToggleExpand}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="flex-1 space-y-4 p-4 pt-0 overflow-auto">
          {categories.map(({ title, icon, key }) => {
            const topPartner = getTopPartner(key);
            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-lg font-semibold text-gray-900">{topPartner.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {(topPartner[key] as number).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{key.replace('_count', '')}</p>
                  </div>
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-lg shadow-sm flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: generatePastelColor(topPartner.id) }}
                    >
                      {topPartner.company_name.charAt(0)}
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500 absolute -top-2 -right-2 drop-shadow-md" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}