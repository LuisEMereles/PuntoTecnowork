import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, description }) => {
  return (
    <div className="glass-card p-6 rounded-2xl flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        {description && (
          <p className="text-xs text-gray-400 mt-2">{description}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );
};