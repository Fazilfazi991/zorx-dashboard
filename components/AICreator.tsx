import React, { useState } from 'react';
import { Sparkles, X, Loader2, Bot } from 'lucide-react';
import { generateClientStrategy } from '../services/geminiService';
import { Client, Priority, Status, Task } from '../types';

interface AICreatorProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onAddTasks: (tasks: Task[]) => void;
}

const AICreator: React.FC<AICreatorProps> = ({ isOpen, onClose, clients, onAddTasks }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!selectedClientId) return;
    
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    setLoading(true);
    setError('');

    try {
      const response = await generateClientStrategy(client.name, client.industry);
      
      if (response && response.tasks) {
        // Convert to Task objects
        const newTasks: Task[] = response.tasks.map((t, idx) => ({
          id: `gen-${Date.now()}-${idx}`,
          clientId: client.id,
          title: t.title,
          description: t.description,
          status: Status.PENDING,
          priority: t.priority,
          team: t.team,
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // +7 days
          assignedTo: 'AI Agent'
        }));
        
        onAddTasks(newTasks);
        onClose();
      } else {
        setError('Failed to generate strategy. Please check API Key.');
      }
    } catch (e) {
      setError('An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-nexus-blue/30 bg-nexus-card shadow-2xl ring-1 ring-white/10">
        <div className="relative bg-gradient-to-r from-nexus-dark to-nexus-blue/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-nexus-blue/20 rounded-lg">
                 <Bot className="h-6 w-6 text-nexus-blueGlow" />
               </div>
               <h2 className="text-xl font-bold text-white">AI Strategist</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-400">
            Select a client to auto-generate high-impact marketing tasks based on their industry niche.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-gray-500">Target Client</label>
            <select 
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-nexus-blue focus:outline-none focus:ring-1 focus:ring-nexus-blue transition-all"
            >
              <option value="">Select a client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedClientId}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-white p-3 font-semibold text-black transition-all hover:bg-nexus-blueGlow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Market Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-purple-600 group-hover:text-black transition-colors" />
                <span>Generate Strategy</span>
              </>
            )}
            {!loading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICreator;
