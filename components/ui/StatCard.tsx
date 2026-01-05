import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'accent' | 'electric' | 'purple' | 'success';
  description?: string;
}

const colorConfig = {
  accent: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    glow: 'shadow-glow-accent',
    border: 'border-accent/20',
  },
  electric: {
    bg: 'bg-electric/10',
    text: 'text-electric',
    glow: 'shadow-glow-electric',
    border: 'border-electric/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: '',
    border: 'border-purple-500/20',
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    glow: '',
    border: 'border-success/20',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, description }) => {
  const colors = colorConfig[color];

  return (
    <div className="stat-card group hover:border-white/10" style={{ '--accent-color': color === 'accent' ? '#ff6b35' : color === 'electric' ? '#00d4ff' : '#a855f7' } as React.CSSProperties}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-text-muted"></span>
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border transition-all duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};
