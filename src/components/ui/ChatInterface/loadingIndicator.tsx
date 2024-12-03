// File: LoadingIndicator.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center mt-4">
      <Loader2 className="animate-spin text-gray-500" size={24} />
      <span className="ml-2 text-gray-500">Cargando...</span>
    </div>
  );
};

export default LoadingIndicator;