
import React, { useState } from 'react';
import { Client } from '../types';
import { ExternalLink, Activity, ArrowRight, Plus, Pencil, Trash2, X, Save, Briefcase, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientListProps {
  clients: Client[];
  onAddClient?: (client: Client) => void;
  onUpdateClient?: (client: Client) => void;
  onDeleteClient?: (clientId: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'Onboarding' | 'Paused'>('Active');

  const handleViewTasks = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setIndustry('');
    setContactPerson('');
    setEmail('');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
    setName(client.name);
    setIndustry(client.industry);
    setContactPerson(client.contactPerson);
    setEmail(client.email);
    setStatus(client.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this client? Associated tasks will not be deleted but may lose their client reference.')) {
        onDeleteClient?.(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate Avatar if new or name changed
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    if (editingClient && onUpdateClient) {
        onUpdateClient({
            ...editingClient,
            name,
            industry,
            contactPerson,
            email,
            status,
            avatarUrl // Update avatar if name changes
        });
    } else if (onAddClient) {
        onAddClient({
            id: `c-${Date.now()}`,
            name,
            industry,
            contactPerson,
            email,
            status,
            avatarUrl
        });
    }
    setIsModalOpen(false);
  };

  const isEditable = !!onAddClient && !!onUpdateClient && !!onDeleteClient;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-nexus-card shadow-xl h-full flex flex-col animate-fade-in">
        <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-semibold text-white">Active Clients</h3>
          <div className="flex gap-2">
             {isEditable && (
                 <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-nexus-blue text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-nexus-blueGlow transition-colors"
                 >
                    <Plus className="h-4 w-4" /> Add Client
                 </button>
             )}
             {!isEditable && (
                <button className="text-sm text-nexus-blueGlow hover:text-white transition-colors">View All</button>
             )}
          </div>
        </div>
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase text-gray-200 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-3 font-medium">Client Name</th>
                <th className="px-6 py-3 font-medium">Industry</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => handleViewTasks(client.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={client.avatarUrl} 
                        alt={client.name} 
                        className="h-9 w-9 rounded-full bg-gray-800 object-cover ring-2 ring-white/10" 
                      />
                      <div>
                        <div className="font-medium text-white group-hover:text-nexus-blueGlow transition-colors">{client.name}</div>
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
                      <div className={`h-2 w-2 rounded-full ${client.status === 'Active' ? 'bg-nexus-greenGlow animate-pulse' : client.status === 'Paused' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                      <span className={client.status === 'Active' ? 'text-nexus-greenGlow' : client.status === 'Paused' ? 'text-yellow-500' : 'text-gray-400'}>
                        {client.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleViewTasks(client.id); }}
                        className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-nexus-blue/20 hover:text-nexus-blueGlow transition-all"
                      >
                        <span>Profile</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      
                      {isEditable && (
                        <>
                            <button 
                                onClick={(e) => openEditModal(client, e)}
                                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors" 
                                title="Edit"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={(e) => handleDelete(client.id, e)}
                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" 
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="bg-nexus-card border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
                 <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5"/></button>
                 </div>
                 <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                         <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Company Name</label>
                         <div className="relative">
                             <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                             <input 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 pl-9 text-white focus:border-nexus-blue focus:outline-none"
                                placeholder="e.g. Acme Corp"
                                required
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Industry</label>
                         <input 
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:border-nexus-blue focus:outline-none"
                            placeholder="e.g. Technology"
                            required
                         />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Contact Person</label>
                             <div className="relative">
                                 <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                 <input 
                                    value={contactPerson}
                                    onChange={e => setContactPerson(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 pl-9 text-white focus:border-nexus-blue focus:outline-none"
                                    placeholder="e.g. John Doe"
                                    required
                                 />
                             </div>
                         </div>
                         <div>
                             <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Status</label>
                             <select 
                                value={status}
                                onChange={e => setStatus(e.target.value as any)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:border-nexus-blue focus:outline-none"
                             >
                                 <option value="Active">Active</option>
                                 <option value="Onboarding">Onboarding</option>
                                 <option value="Paused">Paused</option>
                             </select>
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email</label>
                         <div className="relative">
                             <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                             <input 
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 pl-9 text-white focus:border-nexus-blue focus:outline-none"
                                placeholder="contact@company.com"
                                required
                             />
                         </div>
                     </div>

                     <div className="pt-4 flex justify-end gap-3">
                         <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                         <button type="submit" className="px-6 py-2 bg-nexus-blue text-black font-bold rounded-lg hover:bg-nexus-blueGlow transition-all flex items-center gap-2">
                             <Save className="h-4 w-4" /> Save Client
                         </button>
                     </div>
                 </form>
             </div>
          </div>
      )}
    </>
  );
};

export default ClientList;
