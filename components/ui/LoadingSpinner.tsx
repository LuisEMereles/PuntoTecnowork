import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <Loader2 className="h-10 w-10 animate-spin text-white" />
    </div>
  );
};