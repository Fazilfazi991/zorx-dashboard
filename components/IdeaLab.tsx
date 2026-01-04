import React, { useState, useEffect } from 'react';
import { Idea, IdeaCategory, Client, User } from '../types';
import { 
  Lightbulb, 
  ThumbsUp, 
  Trophy, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar,
  User as UserIcon,
  X,
  Sparkles,
  Rocket,
  Briefcase
} from 'lucide-react';

interface IdeaLabProps {
  ideas: Idea[];
  clients: Client[];
  currentUser: User | null;
  onVote: (id: string) => void;
  onAddIdea: (idea: Omit<Idea, 'id' | 'votes' | 'hasVoted' | 'createdAt' | 'status'>) => void;
}

interface LeaderboardEntry {
  name: string;
  totalVotes: number;
  ideasCount: number;
}

const IdeaLab: React.FC<IdeaLabProps> = ({ ideas, clients, currentUser, onVote, onAddIdea }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'ideas' | 'rankings'>('ideas');

  // Leaderboard Calculation
  const authorStats = ideas.reduce((acc, idea) => {
    if (!acc[idea.author]) {
      acc[idea.author] = { name: idea.author, totalVotes: 0, ideasCount: 0 };
    }
    acc[idea.author].totalVotes += idea.votes;
    acc[idea.author].ideasCount += 1;
    return acc;
  }, {} as Record<string, LeaderboardEntry>);

  const leaderboard = (Object.values(authorStats) as LeaderboardEntry[]).sort((a, b) => b.totalVotes - a.totalVotes);

  const filteredIdeas = ideas.filter(idea => 
    filterCategory === 'All' ? true : idea.category === filterCategory
  ).sort((a, b) => b.votes - a.votes); // Default sort by votes

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-4 md:space-y-6 w-full max-w-full overflow-hidden">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Lightbulb className="h-6 w-6 text-yellow-400" />
             Idea Lab
           </h2>
           <p className="text-gray-400 text-sm mt-1">Share creative concepts, vote on the best strategies, and win monthly rankings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-nexus-blue text-black px-4 py-2 rounded-lg font-bold hover:bg-nexus-blueGlow transition-all shadow-lg shadow-nexus-blue/20"
        >
          <Plus className="h-5 w-5" />
          Submit Idea
        </button>
      </div>

      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
        <button 
          onClick={() => setMobileTab('ideas')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${
            mobileTab === 'ideas' ? 'bg-nexus-blue text-black shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Lightbulb className="h-4 w-4" /> Ideas
        </button>
        <button 
          onClick={() => setMobileTab('rankings')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${
            mobileTab === 'rankings' ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="h-4 w-4" /> Rankings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
        
        {/* Main Feed */}
        <div className={`${mobileTab === 'ideas' ? 'flex' : 'hidden'} lg:flex lg:col-span-2 flex-col h-full min-h-0`}>
          
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide shrink-0">
            {['All', 'Marketing', 'Creative', 'Content', 'Strategy', 'Tools'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap
                  ${filterCategory === cat 
                    ? 'bg-white/10 text-white border-white/20' 
                    : 'bg-transparent text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {filteredIdeas.map((idea) => {
              const linkedClient = clients.find(c => c.id === idea.clientId);
              return (
                <div key={idea.id} className="bg-nexus-card border border-white/10 rounded-xl p-5 flex gap-4 transition-all hover:border-nexus-blue/30 group">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                     <button 
                       onClick={() => onVote(idea.id)}
                       className={`p-2 rounded-lg transition-all ${idea.hasVoted 
                         ? 'bg-nexus-blue/20 text-nexus-blueGlow' 
                         : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                     >
                       <ThumbsUp className={`h-5 w-5 ${idea.hasVoted ? 'fill-current' : ''}`} />
                     </button>
                     <span className={`font-bold text-lg ${idea.hasVoted ? 'text-nexus-blueGlow' : 'text-white'}`}>
                       {idea.votes}
                     </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap justify-between items-start mb-1 gap-2">
                       <div className="flex items-center gap-2 max-w-full overflow-hidden">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-2 py-0.5 rounded shrink-0">
                           {idea.category}
                         </span>
                         {linkedClient && (
                           <span className="text-[10px] flex items-center gap-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded truncate max-w-[120px] sm:max-w-none">
                             <Briefcase className="h-3 w-3 shrink-0" /> <span className="truncate">{linkedClient.name}</span>
                           </span>
                         )}
                       </div>
                       <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                         <Calendar className="h-3 w-3" />
                         {new Date(idea.createdAt).toLocaleDateString(undefined, {month:'short', day: 'numeric'})}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-nexus-blueGlow transition-colors break-words line-clamp-2">
                      {idea.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                      {idea.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-2">
                      <div className="flex items-center gap-3 max-w-full overflow-hidden">
                         <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[8px] text-white font-bold">
                               {idea.author.charAt(0)}
                            </div>
                            {idea.author}
                         </div>
                         <div className="flex gap-2 overflow-hidden flex-nowrap mask-linear-fade">
                           {idea.tags.map(tag => (
                             <span key={tag} className="text-xs text-nexus-blue/60 truncate">#{tag}</span>
                           ))}
                         </div>
                      </div>
                      {idea.status === 'Implemented' && (
                         <span className="flex items-center gap-1 text-xs text-nexus-greenGlow bg-nexus-green/10 px-2 py-1 rounded border border-nexus-green/20 shrink-0">
                            <Rocket className="h-3 w-3" /> <span className="hidden sm:inline">Implemented</span>
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar / Leaderboard */}
        <div className={`${mobileTab === 'rankings' ? 'flex' : 'hidden'} lg:flex flex-col space-y-6 h-full overflow-y-auto custom-scrollbar`}>
           <div className="bg-nexus-card border border-white/10 rounded-xl p-6 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Trophy className="h-32 w-32 text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Monthly Rankings
              </h3>
              
              <div className="space-y-4 relative z-10">
                {leaderboard.slice(0, 5).map((user, idx) => (
                  <div key={user.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                     <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-black text-sm shrink-0
                          ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : idx === 2 ? 'bg-orange-400' : 'bg-gray-700 text-white'}
                        `}>
                           {idx + 1}
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                           <p className="text-xs text-gray-500">{user.ideasCount} ideas</p>
                        </div>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-nexus-blueGlow">{user.totalVotes}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Votes</p>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-nexus-blue/10 to-purple-500/10 border border-nexus-blue/20 rounded-xl p-6 shrink-0">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-nexus-blueGlow" />
                 Engagement Tip
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                 Marketing ideas that include a clear "Call to Action" receive 40% more votes on average. Keep your descriptions actionable!
              </p>
           </div>
        </div>
      </div>

      {/* New Idea Modal */}
      <NewIdeaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={onAddIdea}
        clients={clients}
        currentUser={currentUser}
      />
    </div>
  );
};

interface NewIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
  clients: Client[];
  currentUser: User | null;
}

const NewIdeaModal = ({ isOpen, onClose, onSubmit, clients, currentUser }: NewIdeaModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('Marketing');
  const [author, setAuthor] = useState('');
  const [clientId, setClientId] = useState('');

  // Auto-fill author name when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setAuthor(currentUser.name);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!title || !description || !author) return;
    
    onSubmit({
       title,
       description,
       category,
       author,
       clientId: clientId || undefined,
       tags: [] // Simplified for demo
    });
    // Reset
    setTitle('');
    setDescription('');
    setAuthor('');
    setClientId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-nexus-card border border-white/10 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
             <h3 className="text-xl font-bold text-white">Share Your Spark</h3>
             <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5"/></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Title</label>
                <input 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Viral TikTok Challenge for Zappo"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
                  required
                />
             </div>
             
             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Target Client (Optional)</label>
                <select 
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
                >
                    <option value="">General Idea / Internal</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Category</label>
                   <select 
                     value={category}
                     onChange={e => setCategory(e.target.value as IdeaCategory)}
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
                   >
                     <option>Marketing</option>
                     <option>Creative</option>
                     <option>Content</option>
                     <option>Strategy</option>
                     <option>Tools</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Your Name</label>
                   <input 
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none cursor-not-allowed opacity-70"
                      readOnly // Lock this field since we have auth
                      required
                   />
                </div>
             </div>

             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your idea, required budget, and expected impact..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-32 focus:border-nexus-blue focus:outline-none resize-none"
                  required
                />
             </div>

             <div className="pt-2 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-nexus-blue text-black font-bold rounded-lg hover:bg-nexus-blueGlow transition-all">Publish Idea</button>
             </div>
          </form>
       </div>
    </div>
  );
}

export default IdeaLab;