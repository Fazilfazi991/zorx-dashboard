import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, isPositive, icon, color }) => {
  const colorStyles = {
    blue: 'text-nexus-blueGlow border-nexus-blue/30 bg-nexus-blue/5',
    green: 'text-nexus-greenGlow border-nexus-green/30 bg-nexus-green/5',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
  };

  const selectedColor = colorStyles[color];

  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 backdrop-blur-md transition-all hover:border-opacity-50 ${selectedColor.split(' ')[1]} border-white/10 bg-nexus-card`}>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`rounded-lg p-2 ${selectedColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-nexus-greenGlow' : 'text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowDownRight className="mr-1 h-4 w-4" />}
          {trend}
        </span>
        <span className="ml-2 text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
