import React from 'react';
import { Client } from '../types';
import { ExternalLink, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientListProps {
  clients: Client[];
}

const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const navigate = useNavigate();

  const handleViewTasks = (clientId: string) => {
    navigate(`/tasks?client=${clientId}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-nexus-card shadow-xl h-full">
      <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Active Clients</h3>
        <button className="text-sm text-nexus-blueGlow hover:text-white transition-colors">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-xs uppercase text-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Client Name</th>
              <th className="px-6 py-3 font-medium">Industry</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={client.avatarUrl} 
                      alt={client.name} 
                      className="h-9 w-9 rounded-full bg-gray-800 object-cover ring-2 ring-white/10" 
                    />
                    <div>
                      <div className="font-medium text-white">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-nexus-blue/10 px-2 py-1 text-xs font-medium text-nexus-blueGlow ring-1 ring-inset ring-nexus-blue/20">
                    {client.industry}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${client.status === 'Active' ? 'bg-nexus-greenGlow animate-pulse' : 'bg-yellow-500'}`} />
                    <span className={client.status === 'Active' ? 'text-nexus-greenGlow' : 'text-yellow-500'}>
                      {client.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="rounded p-1 hover:bg-white/10 text-gray-400 hover:text-white" title="View Analytics">
                      <Activity className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleViewTasks(client.id)}
                      className="rounded p-1 hover:bg-white/10 text-gray-400 hover:text-white"
                      title="View Tasks"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;