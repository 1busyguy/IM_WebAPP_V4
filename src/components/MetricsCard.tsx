import React from 'react';
import { Metrics } from '../types';

interface MetricsCardProps {
  metrics: Metrics;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-500 capitalize">
            {key.replace(/_/g, ' ')}
          </h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
};