import React from 'react';
import { Campaign, Client } from '../types';
import { Calendar, BarChart2, MoreHorizontal, Play, Pause, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignsViewProps {
  campaigns: Campaign[];
  clients: Client[];
}

const CampaignsView: React.FC<CampaignsViewProps> = ({ campaigns, clients }) => {
  const navigate = useNavigate();
  const getClient = (id: string) => clients.find(c => c.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-nexus-greenGlow bg-nexus-green/10 border-nexus-green/20';
      case 'Planning': return 'text-nexus-blueGlow bg-nexus-blue/10 border-nexus-blue/20';
      case 'Paused': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Completed': return 'text-gray-400 bg-white/5 border-white/10';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <Play className="h-3 w-3 fill-current" />;
      case 'Paused': return <Pause className="h-3 w-3 fill-current" />;
      case 'Completed': return <CheckCircle className="h-3 w-3" />;
      default: return <div className="h-2 w-2 rounded-full bg-current" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Active Campaigns</h2>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-sm font-medium text-white rounded-lg border border-white/10 transition-all">Filter</button>
           <button className="px-4 py-2 bg-nexus-blue text-black text-sm font-bold rounded-lg hover:bg-nexus-blueGlow transition-all">New Campaign</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          const client = getClient(campaign.clientId);
          const percentSpent = Math.min(100, Math.round((campaign.spent / campaign.budget) * 100));

          return (
            <div key={campaign.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-nexus-card p-6 transition-all hover:border-nexus-blue/30 hover:shadow-lg hover:shadow-nexus-blue/5">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                    onClick={() => navigate(`/tasks?campaign=${campaign.id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-nexus-black/80 hover:bg-nexus-blue/20 text-xs text-gray-400 hover:text-white border border-white/10 transition-colors"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Tasks
                </button>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-white/5 p-0.5 ring-1 ring-white/10">
                  <img src={client?.avatarUrl} alt={client?.name} className="h-full w-full rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-white leading-tight">{campaign.name}</h3>
                  <p className="text-xs text-gray-500">{client?.name}</p>
                </div>
              </div>

              {/* Status & KPI */}
              <div className="flex items-center justify-between mb-6">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                  {campaign.status}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                  <BarChart2 className="h-3 w-3" />
                  {campaign.kpi}
                </span>
              </div>

              {/* Budget Progress */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Budget Spent</span>
                  <span className="text-white font-mono">${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-nexus-blue to-nexus-greenGlow transition-all duration-500" 
                    style={{ width: `${percentSpent}%` }}
                  />
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                   <Calendar className="h-3 w-3" />
                   {new Date(campaign.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                </div>
                <div className="flex items-center gap-1">
                   <span className="px-2 py-0.5 rounded bg-white/5 uppercase tracking-wider text-[10px]">{campaign.platform}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignsView;