import React from 'react';
import { Partner } from '../types';
import { Toggle } from './Toggle';
import { generatePastelColor } from '../utils/colorUtils';
import { Users, TextSelection as Collection, Zap, Scan, Eye } from 'lucide-react';

interface PartnersListProps {
  partners: Partner[];
  selectedPartnerId: string | null;
  onPartnerSelect: (partnerId: string) => void;
  onTogglePartner: (partnerId: string, isActive: boolean) => void;
}

export const PartnersList: React.FC<PartnersListProps> = ({
  partners,
  selectedPartnerId,
  onPartnerSelect,
  onTogglePartner,
}) => {
  const PartnerRow = ({ partner }: { partner: Partner }) => (
    <div
      key={partner.id}
      className={`p-3 rounded-lg shadow-sm transition-all duration-200 border border-gray-100 ${
        partner.is_active 
          ? 'bg-white hover:shadow-md cursor-pointer' 
          : 'bg-gray-100 cursor-not-allowed opacity-75'
      } ${
        selectedPartnerId === partner.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => partner.is_active && onPartnerSelect(partner.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center text-white font-bold transition-opacity ${
              !partner.is_active && 'opacity-50'
            }`}
            style={{ backgroundColor: generatePastelColor(partner.id) }}
          >
            {partner.company_name.charAt(0)}
          </div>
          <div>
            <h4 className={`font-medium text-sm ${partner.is_active ? 'text-gray-900' : 'text-gray-600'}`}>
              {partner.company_name}
            </h4>
            <p className="text-xs text-gray-500">{partner.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className={`w-4 h-4 ${partner.is_active ? 'text-indigo-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${partner.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                {partner.managers_count}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Collection className={`w-4 h-4 ${partner.is_active ? 'text-purple-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${partner.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                {partner.collections_count}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 ${partner.is_active ? 'text-amber-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${partner.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                {partner.activations_count}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Scan className={`w-4 h-4 ${partner.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${partner.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                {partner.scans_count}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Eye className={`w-4 h-4 ${partner.is_active ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${partner.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                {partner.views_count}
              </span>
            </div>
          </div>

          <Toggle
            isActive={partner.is_active}
            onChange={(isActive) => {
              onTogglePartner(partner.id, isActive);
              event?.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2 px-4">
      {partners.map((partner) => (
        <PartnerRow key={partner.id} partner={partner} />
      ))}
    </div>
  );
}