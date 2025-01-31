import React, { useState } from 'react';
import { X, Pencil } from 'lucide-react';
import { Partner } from '../types';
import { TimeSeriesGraph } from './TimeSeriesGraph';
import { generatePastelColor } from '../utils/colorUtils';
import { EditPartnerModal } from './EditPartnerModal';

interface PartnerDetailsProps {
  partner: Partner;
  timeSeriesData: any[];
  metricsColors: { [key: string]: string };
  onClose: () => void;
  isGraphExpanded: boolean;
}

export const PartnerDetails: React.FC<PartnerDetailsProps> = ({
  partner,
  timeSeriesData,
  metricsColors,
  onClose,
  isGraphExpanded,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditSubmit = (partnerData: any) => {
    console.log('Editing partner:', partnerData);
    setIsEditModalOpen(false);
  };

  if (!isGraphExpanded) {
    return (
      <div className="h-full flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">{partner.company_name} Metrics</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{partner.company_name} Metrics</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 mb-4">
        <TimeSeriesGraph
          data={timeSeriesData}
          metrics={['users', 'collections', 'activations', 'scans', 'likes', 'views']}
          colors={metricsColors}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-lg shadow-sm flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: generatePastelColor(partner.id) }}
          >
            {partner.company_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {partner.first_name} {partner.last_name}
              </h3>
              <span className="text-sm text-gray-500">@{partner.username}</span>
              <span className="text-sm text-gray-500">&bull;</span>
              <span className="text-sm text-gray-500">{partner.email}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{partner.description}</p>
          </div>
        </div>
      </div>

      <EditPartnerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        partner={partner}
      />
    </div>
  );
}