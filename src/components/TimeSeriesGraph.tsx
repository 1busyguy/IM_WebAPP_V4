import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { TimeSeriesControls } from './TimeSeriesControls';

interface TimeSeriesData {
  timestamp: string;
  [key: string]: number | string;
}

interface TimeSeriesGraphProps {
  data: TimeSeriesData[];
  metrics: string[];
  colors: { [key: string]: string };
}

type GraphType = 'line' | 'bar';

export const TimeSeriesGraph: React.FC<TimeSeriesGraphProps> = ({
  data,
  metrics,
  colors,
}) => {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState('4weeks');
  const [graphType, setGraphType] = React.useState<GraphType>('line');

  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '2weeks':
        startDate.setDate(now.getDate() - 14);
        break;
      case '4weeks':
        startDate.setDate(now.getDate() - 28);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 28);
    }

    return data.filter(item => new Date(item.timestamp) >= startDate);
  };

  const filteredData = getFilteredData();
  const displayMetrics = selectedMetric ? [selectedMetric] : metrics;

  const commonProps = {
    data: filteredData,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  const renderChart = () => {
    if (graphType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => format(new Date(value), 'MMM d')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
          />
          <Legend />
          {displayMetrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={colors[metric]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => format(new Date(value), 'MMM d')}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
        />
        <Legend />
        {displayMetrics.map((metric) => (
          <Bar
            key={metric}
            dataKey={metric}
            fill={colors[metric]}
          />
        ))}
      </BarChart>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <TimeSeriesControls
        metrics={metrics}
        selectedMetric={selectedMetric}
        dateRange={dateRange}
        graphType={graphType}
        onMetricChange={setSelectedMetric}
        onDateRangeChange={setDateRange}
        onGraphTypeChange={setGraphType}
      />
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};