import React from 'react';
import { CalendarDays, LineChart, BarChart } from 'lucide-react';

interface TimeSeriesControlsProps {
  metrics: string[];
  selectedMetric: string | null;
  dateRange: string;
  graphType: 'line' | 'bar';
  onMetricChange: (metric: string | null) => void;
  onDateRangeChange: (range: string) => void;
  onGraphTypeChange: (type: 'line' | 'bar') => void;
}

const DATE_RANGES = [
  { label: '7D', value: '7days' },
  { label: '2W', value: '2weeks' },
  { label: '4W', value: '4weeks' },
  { label: '3M', value: '3months' },
  { label: '1Y', value: '1year' },
];

export const TimeSeriesControls: React.FC<TimeSeriesControlsProps> = ({
  metrics,
  selectedMetric,
  dateRange,
  graphType,
  onMetricChange,
  onDateRangeChange,
  onGraphTypeChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <select
          value={selectedMetric || ''}
          onChange={(e) => onMetricChange(e.target.value || null)}
          className="pl-3 pr-8 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="">All Metrics</option>
          {metrics.map((metric) => (
            <option key={metric} value={metric}>
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onGraphTypeChange('line')}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 ${
              graphType === 'line'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Line</span>
          </button>
          <button
            onClick={() => onGraphTypeChange('bar')}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 ${
              graphType === 'bar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <CalendarDays className="w-4 h-4 text-gray-500" />
        <div className="flex bg-gray-100 rounded-lg p-1">
          {DATE_RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onDateRangeChange(value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateRange === value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};