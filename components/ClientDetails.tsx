import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client, Task, Campaign, Status, Priority } from '../types';
import { ArrowLeft, Mail, Briefcase, TrendingUp, CheckCircle2, Clock, Calendar, ExternalLink, AlertCircle, Phone, Globe } from 'lucide-react';

interface ClientDetailsProps {
  clients: Client[];
  tasks: Task[];
  campaigns: Campaign[];
  onTaskClick: (task: Task) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ clients, tasks, campaigns, onTaskClick }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold">Client Not Found</h2>
        <button onClick={() => navigate('/clients')} className="mt-4 text-nexus-blue hover:text-white">Back to List</button>
      </div>
    );
  }

  // Derived Data
  const clientTasks = tasks.filter(t => t.clientId === client.id);
  const clientCampaigns = campaigns.filter(c => c.clientId === client.id);
  
  const completedTasks = clientTasks.filter(t => t.status === Status.COMPLETED).length;
  const pendingTasks = clientTasks.filter(t => t.status !== Status.COMPLETED).length;
  
  const totalBudget = clientCampaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalSpent = clientCampaigns.reduce((acc, c) => acc + c.spent, 0);

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'text-red-400 bg-red-500/10 border-red-500/20';
      case Priority.HIGH: return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case Priority.MEDIUM: return 'text-nexus-blueGlow bg-nexus-blue/10 border-nexus-blue/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  const getStatusColor = (s: Status) => {
      switch(s) {
          case Status.COMPLETED: return 'text-nexus-greenGlow';
          case Status.IN_PROGRESS: return 'text-nexus-blueGlow';
          case Status.REVIEW: return 'text-yellow-400';
          default: return 'text-gray-400';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Navigation Header */}
      <button 
        onClick={() => navigate('/clients')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </button>

      {/* Main Header Card */}
      <div className="bg-nexus-card border border-white/10 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-nexus-blue/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
           <img 
             src={client.avatarUrl} 
             alt={client.name} 
             className="h-20 w-20 rounded-full border-2 border-white/10 shadow-xl bg-gray-800"
           />
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                 <span className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase ${client.status === 'Active' ? 'bg-nexus-green/10 text-nexus-greenGlow border-nexus-green/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                    {client.status}
                 </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                 <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-nexus-blue" /> {client.industry}
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-nexus-blue" /> {client.email}
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-nexus-blue" /> {client.contactPerson}
                 </div>
              </div>
           </div>
           <div className="flex gap-3">
              <button onClick={() => navigate(`/tasks?client=${client.id}`)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-white hover:bg-white/10 transition-colors">
                 Task Board
              </button>
              <button className="px-4 py-2 bg-nexus-blue text-black rounded-lg text-sm font-bold hover:bg-nexus-blueGlow transition-colors">
                 Edit Profile
              </button>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-nexus-card border border-white/10 rounded-xl p-4">
             <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Active Budget</p>
             <p className="text-2xl font-bold text-white">${totalBudget.toLocaleString()}</p>
             <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                <div className="bg-nexus-greenGlow h-full" style={{ width: `${Math.min((totalSpent/totalBudget)*100, 100)}%` }}></div>
             </div>
             <p className="text-[10px] text-gray-400 mt-1">${totalSpent.toLocaleString()} spent</p>
         </div>
         <div className="bg-nexus-card border border-white/10 rounded-xl p-4">
             <p className="text-xs font-bold text-gray-500 uppercase mb-1">Active Campaigns</p>
             <p className="text-2xl font-bold text-white">{clientCampaigns.filter(c => c.status === 'Active').length}</p>
             <p className="text-[10px] text-gray-400 mt-1">across {new Set(clientCampaigns.map(c => c.platform)).size} platforms</p>
         </div>
         <div className="bg-nexus-card border border-white/10 rounded-xl p-4">
             <p className="text-xs font-bold text-gray-500 uppercase mb-1">Pending Tasks</p>
             <p className="text-2xl font-bold text-nexus-blueGlow">{pendingTasks}</p>
             <p className="text-[10px] text-gray-400 mt-1">{completedTasks} completed to date</p>
         </div>
         <div className="bg-nexus-card border border-white/10 rounded-xl p-4">
             <p className="text-xs font-bold text-gray-500 uppercase mb-1">Health Score</p>
             <p className="text-2xl font-bold text-nexus-greenGlow">98%</p>
             <p className="text-[10px] text-gray-400 mt-1">Based on task completion</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Campaigns List */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Active Campaigns</h3>
                <ExternalLink className="h-4 w-4 text-gray-500" />
             </div>
             <div className="space-y-3">
                 {clientCampaigns.length === 0 && (
                     <div className="p-4 border border-dashed border-white/10 rounded-lg text-center text-sm text-gray-500">
                         No campaigns found.
                     </div>
                 )}
                 {clientCampaigns.map(campaign => (
                     <div key={campaign.id} className="bg-nexus-card border border-white/10 rounded-lg p-4 hover:border-nexus-blue/30 transition-all">
                         <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-white text-sm">{campaign.name}</h4>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${campaign.status === 'Active' ? 'bg-nexus-green/10 text-nexus-greenGlow' : 'bg-gray-800 text-gray-400'}`}>
                                 {campaign.status}
                             </span>
                         </div>
                         <div className="flex justify-between text-xs text-gray-400 mb-2">
                             <span>{campaign.platform}</span>
                             <span>{campaign.kpi}</span>
                         </div>
                         <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                             <div 
                                className="bg-gradient-to-r from-nexus-blue to-nexus-greenGlow h-full"
                                style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                             />
                         </div>
                     </div>
                 ))}
             </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Tasks & Deliverables</h3>
                <button onClick={() => navigate('/tasks')} className="text-xs text-nexus-blue hover:text-white">View All Tasks</button>
             </div>
             
             <div className="bg-nexus-card border border-white/10 rounded-xl overflow-hidden">
                 <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm text-gray-400">
                         <thead className="bg-white/5 text-xs uppercase text-gray-200">
                             <tr>
                                 <th className="px-6 py-3">Task</th>
                                 <th className="px-6 py-3">Team</th>
                                 <th className="px-6 py-3">Due Date</th>
                                 <th className="px-6 py-3">Priority</th>
                                 <th className="px-6 py-3 text-right">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                             {clientTasks.length === 0 && (
                                 <tr><td colSpan={5} className="px-6 py-8 text-center italic text-gray-500">No tasks assigned to this client.</td></tr>
                             )}
                             {clientTasks.map(task => (
                                 <tr 
                                    key={task.id} 
                                    onClick={() => onTaskClick(task)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                 >
                                     <td className="px-6 py-4">
                                         <div className="font-medium text-white group-hover:text-nexus-blueGlow transition-colors">{task.title}</div>
                                         <div className="text-xs text-gray-500 truncate max-w-[200px]">{task.description}</div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className="text-xs bg-white/5 px-2 py-1 rounded">{task.team}</span>
                                     </td>
                                     <td className="px-6 py-4">
                                         <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                         </div>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className={`text-[10px] px-2 py-1 rounded border uppercase font-bold ${getPriorityColor(task.priority)}`}>
                                             {task.priority}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <span className={`text-xs font-bold ${getStatusColor(task.status)}`}>
                                             {task.status.replace('_', ' ')}
                                         </span>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default ClientDetails;