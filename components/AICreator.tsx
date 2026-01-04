import React, { useState } from 'react';
import { Sparkles, X, Loader2, Bot, PenTool, Layers, Copy, Check, ArrowRight, ThumbsUp } from 'lucide-react';
import { generateClientStrategy, generateMarketingContent } from '../services/geminiService';
import { Client, Priority, Status, Task, AIContentResponse } from '../types';

interface AICreatorProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onAddTasks: (tasks: Task[]) => void;
}

type Tab = 'strategy' | 'content';

const AICreator: React.FC<AICreatorProps> = ({ isOpen, onClose, clients, onAddTasks }) => {
  const [activeTab, setActiveTab] = useState<Tab>('strategy');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Strategy Generation State
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  // Content Generation State
  const [platform, setPlatform] = useState('LinkedIn');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [generatedContent, setGeneratedContent] = useState<AIContentResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setGeneratedTasks([]);
    setSelectedTaskIds(new Set());
    setGeneratedContent(null);
    setError('');
    setSuccessMsg('');
    // Keep client/inputs if possible for better UX, or clear them. 
    // Clearing inputs for clean state:
    // setSelectedClientId(''); 
  };

  const handleClose = () => {
    resetState();
    onClose();
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateStrategy = async () => {
    if (!selectedClientId) return;
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');
    setGeneratedTasks([]);

    try {
      const response = await generateClientStrategy(client.name, client.industry);
      
      if (response && response.tasks) {
        const newTasks: Task[] = response.tasks.map((t, idx) => ({
          id: `gen-${Date.now()}-${idx}`,
          clientId: client.id,
          title: t.title,
          description: t.description,
          status: Status.PENDING,
          priority: t.priority,
          team: t.team,
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
          assignedTo: ['AI Agent'],
          assignedBy: 'AI Agent' // Set AI as the creator
        }));
        
        setGeneratedTasks(newTasks);
        // Default select all
        setSelectedTaskIds(new Set(newTasks.map(t => t.id)));
      } else {
        setError('Failed to generate strategy. Please try again.');
      }
    } catch (e) {
      setError('An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const handleApproveTasks = () => {
    const tasksToAdd = generatedTasks.filter(t => selectedTaskIds.has(t.id));
    if (tasksToAdd.length === 0) return;

    onAddTasks(tasksToAdd);
    setSuccessMsg(`Successfully added ${tasksToAdd.length} tasks to the board!`);
    
    setTimeout(() => {
        handleClose();
    }, 1500);
  };

  const handleGenerateContent = async () => {
    if (!selectedClientId || !topic) return;
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    setLoading(true);
    setError('');
    setGeneratedContent(null);

    try {
      const response = await generateMarketingContent(
        client.name, 
        client.industry, 
        platform, 
        topic, 
        tone
      );
      
      if (response && response.variations) {
        setGeneratedContent(response);
      } else {
        setError('Failed to generate content.');
      }
    } catch (e) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-nexus-blue/30 bg-nexus-card shadow-2xl ring-1 ring-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-nexus-dark to-nexus-blue/10 p-6 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-nexus-blue/20 rounded-lg">
                 <Bot className="h-6 w-6 text-nexus-blueGlow" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-white">Zorx AI Studio</h2>
                 <p className="text-xs text-nexus-blueGlow">Powered by Gemini 3.0 Pro</p>
               </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-4 border-b border-white/10">
            <button 
              onClick={() => { setActiveTab('strategy'); resetState(); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${activeTab === 'strategy' ? 'border-nexus-blue text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <Layers className="h-4 w-4" /> Strategy
            </button>
            <button 
              onClick={() => { setActiveTab('content'); resetState(); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${activeTab === 'content' ? 'border-nexus-green text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              <PenTool className="h-4 w-4" /> Copywriter
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* --- STRATEGY TAB --- */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              
              {generatedTasks.length === 0 ? (
                /* INPUT STATE */
                <div className="space-y-6 animate-fade-in">
                  <p className="text-sm text-gray-400">
                    Analyze a client's industry niche and auto-generate high-impact marketing tasks.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Target Client</label>
                    <select 
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-nexus-blue focus:outline-none transition-all"
                    >
                      <option value="">Select a client...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateStrategy}
                    disabled={loading || !selectedClientId}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-nexus-blue p-3 font-semibold text-black transition-all hover:bg-nexus-blueGlow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    <span>Generate Strategy Tasks</span>
                  </button>
                </div>
              ) : (
                /* REVIEW STATE */
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Review Suggested Tasks</h3>
                        <span className="text-xs text-gray-400">{selectedTaskIds.size} selected</span>
                    </div>
                    
                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                        {generatedTasks.map((task) => (
                            <div 
                                key={task.id}
                                onClick={() => toggleTaskSelection(task.id)}
                                className={`
                                    p-4 rounded-lg border cursor-pointer transition-all relative
                                    ${selectedTaskIds.has(task.id) 
                                        ? 'bg-nexus-blue/10 border-nexus-blue/50' 
                                        : 'bg-white/5 border-white/10 hover:border-white/20 opacity-70'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-semibold text-sm ${selectedTaskIds.has(task.id) ? 'text-white' : 'text-gray-400'}`}>{task.title}</h4>
                                    <div className={`
                                        h-5 w-5 rounded-full border flex items-center justify-center transition-colors
                                        ${selectedTaskIds.has(task.id) 
                                            ? 'bg-nexus-blue border-nexus-blue' 
                                            : 'border-gray-500'}
                                    `}>
                                        {selectedTaskIds.has(task.id) && <Check className="h-3 w-3 text-black" />}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                                <div className="flex gap-2">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 uppercase">{task.priority}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 uppercase">{task.team}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={() => setGeneratedTasks([])} // Go back
                            className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleApproveTasks}
                            disabled={selectedTaskIds.size === 0}
                            className="flex-[2] py-3 rounded-lg bg-nexus-blue text-black font-bold hover:bg-nexus-blueGlow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ThumbsUp className="h-4 w-4" />
                            Approve & Add ({selectedTaskIds.size})
                        </button>
                    </div>
                </div>
              )}
            </div>
          )}

          {/* --- CONTENT TAB --- */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Client</label>
                    <select 
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-nexus-green focus:outline-none transition-all"
                    >
                      <option value="">Select client...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Platform</label>
                    <select 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-nexus-green focus:outline-none transition-all"
                    >
                      <option value="LinkedIn">LinkedIn Post</option>
                      <option value="Instagram">Instagram Caption</option>
                      <option value="Facebook">Facebook Ad</option>
                      <option value="Twitter/X">Twitter Thread</option>
                      <option value="Email">Email Newsletter</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Topic / Campaign</label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Summer Sale, New Product Launch..."
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-nexus-green focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Tone</label>
                    <select 
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white focus:border-nexus-green focus:outline-none transition-all"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Witty">Witty</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
              </div>

              <button
                onClick={handleGenerateContent}
                disabled={loading || !selectedClientId || !topic}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-nexus-green p-3 font-semibold text-black transition-all hover:bg-nexus-greenGlow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenTool className="h-4 w-4" />}
                 <span>Generate Copy Variations</span>
              </button>

              {/* Generated Results */}
              {generatedContent && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-semibold text-white">Generated Variations</h3>
                  <div className="grid gap-4">
                    {generatedContent.variations.map((variant, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-nexus-green/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-nexus-greenGlow text-sm">{variant.headline}</h4>
                           <button 
                             onClick={() => handleCopy(`${variant.headline}\n\n${variant.body}\n\n${variant.hashtags.join(' ')}`, idx)}
                             className="text-gray-500 hover:text-white transition-colors"
                             title="Copy to clipboard"
                           >
                             {copiedIndex === idx ? <Check className="h-4 w-4 text-nexus-green" /> : <Copy className="h-4 w-4" />}
                           </button>
                        </div>
                        <p className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">{variant.body}</p>
                        <div className="flex flex-wrap gap-2">
                           {variant.hashtags.map((tag, i) => (
                             <span key={i} className="text-xs text-nexus-blue/80">#{tag}</span>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}
          
          {successMsg && (
             <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-fade-in flex items-center gap-2">
                <Check className="h-4 w-4" /> {successMsg}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AICreator;