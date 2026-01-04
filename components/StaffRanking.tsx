import React from 'react';
import { User, Task, Idea } from '../types';
import { TrendingUp, Trophy, Star, Medal, Award, Info, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface StaffRankingProps {
  users: User[];
  tasks: Task[];
  ideas: Idea[];
}

const StaffRanking: React.FC<StaffRankingProps> = ({ users, tasks, ideas }) => {
  
  // Calculate Idea Ranking (Global for 10% weight)
  // Step 1: Count votes per author
  const ideaStats = ideas.reduce((acc, idea) => {
      if (!acc[idea.author]) acc[idea.author] = 0;
      acc[idea.author] += idea.votes;
      return acc;
  }, {} as Record<string, number>);

  // Step 2: Sort authors to determine rank
  const sortedIdeaAuthors = Object.entries(ideaStats).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  
  const getIdeaScore = (userName: string): number => {
      const rankIndex = sortedIdeaAuthors.findIndex(([name]) => name === userName);
      if (rankIndex === -1) return 0; // No ideas
      
      // Top 1 gets 10 points. 
      // Rank 2 gets 8.
      // Rank 3 gets 6.
      // Rank 4 gets 4.
      // Rank 5 gets 2.
      // Others get 1.
      const scoreMap = [10, 8, 6, 4, 2];
      return scoreMap[rankIndex] || 1;
  };

  // Calculate Ranking Stats
  const rankings = users.map(user => {
      // Find all completed tasks assigned to this user that have performance data
      const userTasks = tasks.filter(t => 
          t.assignedTo?.includes(user.name) && 
          t.status === 'COMPLETED' && 
          t.performance
      );

      const totalTasks = userTasks.length;
      
      // Default task score to 0 if no tasks
      let avgTaskScore = 0; // Max 90
      
      if (totalTasks > 0) {
          const totalScoreSum = userTasks.reduce((acc, t) => acc + (t.performance?.taskScore || 0), 0);
          avgTaskScore = Math.round(totalScoreSum / totalTasks);
      }

      // Add Idea Lab Score (Max 10)
      const ideaScore = getIdeaScore(user.name);

      const finalScore = avgTaskScore + ideaScore;

      // Breakdown averages for radar chart
      const completionAvg = totalTasks > 0 ? Math.round(userTasks.reduce((acc, t) => acc + (t.performance?.completion || 0), 0) / totalTasks) : 0;
      const onTimeAvg = totalTasks > 0 ? Math.round(userTasks.reduce((acc, t) => acc + (t.performance?.onTime || 0), 0) / totalTasks) : 0;
      const qualityAvg = totalTasks > 0 ? Math.round(userTasks.reduce((acc, t) => acc + (t.performance?.quality || 0), 0) / totalTasks) : 0;
      const teamworkAvg = totalTasks > 0 ? Math.round(userTasks.reduce((acc, t) => acc + (t.performance?.teamwork || 0), 0) / totalTasks) : 0;

      let stars = 1;
      if (finalScore >= 90) stars = 5;
      else if (finalScore >= 75) stars = 4;
      else if (finalScore >= 50) stars = 3;
      else if (finalScore >= 30) stars = 2;

      return {
          id: user.id,
          name: user.name,
          tasksCount: totalTasks,
          avgTaskScore,
          ideaScore,
          finalScore,
          stars,
          metrics: {
              Completion: completionAvg,
              OnTime: onTimeAvg,
              Quality: qualityAvg,
              Teamwork: teamworkAvg,
              Innovation: ideaScore * 10 // Scale 10 to 100 for radar visual consistency
          }
      };
  }).filter(u => u.tasksCount > 0 || u.ideaScore > 0).sort((a, b) => b.finalScore - a.finalScore);

  const topPerformer = rankings[0];

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       {/* Header */}
       <div className="shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Trophy className="h-6 w-6 text-yellow-400" />
             Staff Ranking & Rewards
          </h2>
          <p className="text-gray-400 text-sm mt-1">Monthly performance evaluation based on weighted task metrics + Idea Lab innovation.</p>
       </div>

       {/* Top Performer Spotlight */}
       {topPerformer && (
           <div className="shrink-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/30 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Trophy className="h-48 w-48 text-yellow-400" />
               </div>
               <div className="relative z-10 flex items-center gap-6">
                   <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 shadow-xl shadow-yellow-500/20">
                       <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-2xl font-bold text-white">
                           {topPerformer.name.charAt(0)}
                       </div>
                   </div>
                   <div>
                       <div className="flex items-center gap-2 mb-1">
                           <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs border border-yellow-400/30 px-2 py-0.5 rounded bg-yellow-400/10">Top Performer</span>
                           <div className="flex gap-0.5">
                               {[...Array(5)].map((_, i) => (
                                   <Star key={i} className={`h-3 w-3 ${i < topPerformer.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                               ))}
                           </div>
                       </div>
                       <h3 className="text-3xl font-bold text-white">{topPerformer.name}</h3>
                       <p className="text-gray-300">Total Score: <span className="text-white font-bold text-xl">{topPerformer.finalScore}</span> / 100</p>
                   </div>
                   <div className="ml-auto text-right hidden md:block">
                        <p className="text-sm text-gray-400">Reward Status</p>
                        <p className="text-xl font-bold text-green-400 flex items-center gap-2 justify-end">
                            <Award className="h-5 w-5" /> Eligible for Bonus
                        </p>
                   </div>
               </div>
           </div>
       )}

       {/* Main Content Area */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
           
           {/* Leaderboard List */}
           <div className="lg:col-span-2 bg-nexus-card border border-white/10 rounded-xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                   <h3 className="font-bold text-white">Leaderboard</h3>
                   <span className="text-xs text-gray-500">Execution (90%) + Innovation (10%)</span>
               </div>
               <div className="overflow-y-auto custom-scrollbar flex-1 p-4 space-y-3">
                   {rankings.map((user, idx) => (user && (
                       <div key={user.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-nexus-blue/30 transition-all group">
                           <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                               ${idx === 0 ? 'bg-yellow-400 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-orange-400 text-black' : 'bg-gray-700 text-white'}
                           `}>
                               {idx + 1}
                           </div>
                           <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
                               {user.name.charAt(0)}
                           </div>
                           <div className="flex-1">
                               <h4 className="font-bold text-white text-lg">{user.name}</h4>
                               <div className="flex items-center gap-4 text-xs text-gray-400">
                                   <span title="From Task Performance">{user.avgTaskScore} Task Pts</span>
                                   <span className="text-gray-600">•</span>
                                   <span title="From Idea Lab Ranking" className="flex items-center gap-1 text-nexus-blueGlow">
                                      <Lightbulb className="h-3 w-3" /> {user.ideaScore} Idea Pts
                                   </span>
                               </div>
                           </div>
                           <div className="flex flex-col items-end gap-1">
                               <div className="flex gap-0.5">
                                   {[...Array(5)].map((_, i) => (
                                       <Star key={i} className={`h-4 w-4 ${i < user.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                                   ))}
                               </div>
                               <span className="text-2xl font-bold text-white">{user.finalScore}</span>
                           </div>
                       </div>
                   )))}
                   {rankings.length === 0 && (
                       <div className="text-center py-10 text-gray-500">
                           No performance data available yet.
                       </div>
                   )}
               </div>
           </div>

           {/* Metrics Breakdown / Info */}
           <div className="space-y-6 flex flex-col">
               {/* Radar Chart for Top User (or selected in future) */}
               {topPerformer && (
                   <div className="bg-nexus-card border border-white/10 rounded-xl p-4 flex-1 flex flex-col">
                       <h3 className="text-sm font-bold text-white mb-2 text-center">{topPerformer.name}'s Performance Profile</h3>
                       <div className="flex-1 min-h-[200px]">
                           <ResponsiveContainer width="100%" height="100%">
                               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                   { subject: 'Completion', A: topPerformer.metrics.Completion, fullMark: 100 },
                                   { subject: 'On-Time', A: topPerformer.metrics.OnTime, fullMark: 100 },
                                   { subject: 'Quality', A: topPerformer.metrics.Quality, fullMark: 100 },
                                   { subject: 'Innovation', A: topPerformer.metrics.Innovation, fullMark: 100 },
                                   { subject: 'Teamwork', A: topPerformer.metrics.Teamwork, fullMark: 100 },
                               ]}>
                                   <PolarGrid stroke="#333" />
                                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                   <Radar name="Score" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                                   <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }} />
                               </RadarChart>
                           </ResponsiveContainer>
                       </div>
                   </div>
               )}

               {/* Legend / Info */}
               <div className="bg-nexus-card border border-white/10 rounded-xl p-4 overflow-y-auto">
                   <div className="flex items-center gap-2 mb-3 text-nexus-blueGlow">
                       <Info className="h-4 w-4" />
                       <h3 className="font-bold text-sm">Scoring Logic</h3>
                   </div>
                   <div className="space-y-2 text-xs text-gray-400">
                       <div className="flex justify-between">
                           <span>Completion (40%)</span>
                           <span className="text-nexus-blueGlow font-mono">AUTO</span>
                       </div>
                       <div className="flex justify-between">
                           <span>On-Time (25%)</span>
                           <span className="text-nexus-blueGlow font-mono">AUTO</span>
                       </div>
                       <div className="flex justify-between">
                           <span>Quality (20%)</span>
                           <span className="text-white">Manual</span>
                       </div>
                       <div className="flex justify-between">
                           <span>Teamwork (5%)</span>
                           <span className="text-white">Manual</span>
                       </div>
                       <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
                           <span>Idea Lab (10%)</span>
                           <span className="text-yellow-400">Ranking</span>
                       </div>
                       <div className="pt-2 border-t border-white/10 mt-2">
                           <p className="mb-1"><span className="text-yellow-400 font-bold">5 Stars:</span> 90-100 Score</p>
                           <p className="mb-1"><span className="text-gray-300 font-bold">4 Stars:</span> 75-89 Score</p>
                           <p><span className="text-gray-500 font-bold">3 Stars:</span> 50-74 Score</p>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default StaffRanking;