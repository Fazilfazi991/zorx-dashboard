import React from 'react';
import { User, Task, Status } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, CheckCircle2, Clock, ListTodo } from 'lucide-react';

interface PerformanceReportsProps {
  users: User[];
  tasks: Task[];
}

const PerformanceReports: React.FC<PerformanceReportsProps> = ({ users, tasks }) => {
  // Calculate stats per user
  const staffStats = users.map(user => {
    const userTasks = tasks.filter(t => t.assignedTo?.includes(user.name));
    const completed = userTasks.filter(t => t.status === Status.COMPLETED).length;
    const pending = userTasks.filter(t => t.status !== Status.COMPLETED).length;
    const total = userTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      name: user.name,
      completed,
      pending,
      total,
      rate
    };
  }).filter(stat => stat.total > 0).sort((a, b) => b.completed - a.completed);

  return (
    <div className="space-y-8 animate-fade-in">
       {/* Header */}
       <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <TrendingUp className="h-6 w-6 text-nexus-blueGlow" />
             Performance & Reports
          </h2>
          <p className="text-gray-400 text-sm mt-1">Staff productivity analytics and task completion ratios.</p>
       </div>

       {/* Global Chart Section */}
       <div className="bg-nexus-card border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Team Comparison</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                />
                <Legend />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
       </div>

       {/* Detailed Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {staffStats.map((stat) => (
             <div key={stat.name} className="bg-nexus-card border border-white/10 rounded-xl p-5 hover:border-nexus-blue/30 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                   <div className="h-12 w-12 rounded-full bg-gradient-to-br from-nexus-blue/10 to-purple-500/10 flex items-center justify-center font-bold text-white text-lg border border-white/5">
                      {stat.name.charAt(0)}
                   </div>
                   <div>
                      <h4 className="text-lg font-bold text-white">{stat.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                         <ListTodo className="h-3 w-3" />
                         <span>{stat.total} Total Assigned</span>
                      </div>
                   </div>
                   <div className="ml-auto text-right">
                      <span className="text-2xl font-bold text-nexus-blueGlow">{stat.rate}%</span>
                      <p className="text-[10px] text-gray-500 uppercase">Completion</p>
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4 flex">
                   <div className="bg-nexus-greenGlow h-full" style={{ width: `${stat.rate}%` }} />
                   <div className="bg-nexus-blue h-full" style={{ width: `${100 - stat.rate}%` }} />
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                   <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5 group-hover:border-nexus-green/20 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-nexus-green mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">{stat.completed}</p>
                      <p className="text-xs text-gray-500 uppercase">Completed</p>
                   </div>
                   <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5 group-hover:border-nexus-blue/20 transition-colors">
                      <Clock className="h-5 w-5 text-nexus-blue mx-auto mb-1" />
                      <p className="text-xl font-bold text-white">{stat.pending}</p>
                      <p className="text-xs text-gray-500 uppercase">Pending</p>
                   </div>
                </div>
             </div>
          ))}
          
          {staffStats.length === 0 && (
             <div className="col-span-full p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                No task data available to generate reports. Assign tasks to staff members to see analytics here.
             </div>
          )}
       </div>
    </div>
  );
};

export default PerformanceReports;