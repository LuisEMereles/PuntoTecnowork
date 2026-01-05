import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto mb-3" />
        <p className="text-text-muted text-sm">Cargando...</p>
      </div>
    </div>
  );
};