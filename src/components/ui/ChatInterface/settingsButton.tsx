// File: SettingsButton.tsx
import React from 'react';
import { Settings } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const SettingsButton: React.FC = () => {
  return (
    <div className="ml-auto p-2 hover:bg-gray-100 rounded-full cursor-pointer mb-10">
      <Settings 
        className="text-gray-500" 
        size={24} 
        data-tooltip-id="tooltip"
        data-tooltip-content="Configuración"
      />
      <Tooltip id="tooltip" place="top"/>
    </div>
  );
};

export default SettingsButton;