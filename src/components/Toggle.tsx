import React from 'react';

interface ToggleProps {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ isActive, onChange }) => {
  return (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        isActive ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!isActive);
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          isActive ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};