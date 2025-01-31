import React from 'react';
import { User } from '../types';
import { Toggle } from './Toggle';
import { generatePastelColor } from '../utils/colorUtils';
import { TextSelection as Collection, Zap, Scan, Eye, Heart } from 'lucide-react';

interface UsersListProps {
  users: User[];
  onToggleUser: (userId: string, isActive: boolean) => void;
  onUserSelect: (user: User) => void;
}

export const UsersList: React.FC<UsersListProps> = ({ users, onToggleUser, onUserSelect }) => {
  return (
    <div className="space-y-2 px-4">
      {users.map((user) => (
        <div
          key={user.id}
          className={`p-3 rounded-lg shadow-sm transition-all duration-200 border border-gray-100 ${
            user.is_active 
              ? 'bg-white hover:shadow-md cursor-pointer' 
              : 'bg-gray-100 opacity-75'
          }`}
          onClick={() => user.is_active && onUserSelect(user)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-white font-bold text-sm transition-opacity ${
                  !user.is_active && 'opacity-50'
                }`}
                style={{ backgroundColor: generatePastelColor(user.id) }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className={`font-medium text-sm ${user.is_active ? 'text-gray-900' : 'text-gray-600'}`}>
                  {user.name}
                </h4>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Collection className={`w-4 h-4 ${user.is_active ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${user.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {user.collections_count}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Zap className={`w-4 h-4 ${user.is_active ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${user.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {user.activations_count}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Scan className={`w-4 h-4 ${user.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${user.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {user.scans_count}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Eye className={`w-4 h-4 ${user.is_active ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${user.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {user.views_count}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Heart className={`w-4 h-4 ${user.is_active ? 'text-rose-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${user.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {user.likes_count}
                  </span>
                </div>
              </div>

              <Toggle
                isActive={user.is_active}
                onChange={(isActive) => {
                  onToggleUser(user.id, isActive);
                  event?.stopPropagation();
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}