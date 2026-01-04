import React from 'react';
import { Task, Status, Priority, Client, Campaign } from '../types';
import { Clock, AlertCircle, CheckCircle2, Circle, ChevronDown, Rocket, MessageSquare, Paperclip, User } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  clients: Client[];
  campaigns: Campaign[];
  onStatusChange: (taskId: string, newStatus: Status) => void;
  onTaskClick?: (task: Task) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, clients, campaigns, onStatusChange, onTaskClick }) => {
  const columns = [
    { id: Status.PENDING, label: 'To Do', icon: Circle, color: 'text-gray-400' },
    { id: Status.IN_PROGRESS, label: 'In Progress', icon: Clock, color: 'text-nexus-blueGlow' },
    { id: Status.REVIEW, label: 'Review', icon: AlertCircle, color: 'text-yellow-400' },
    { id: Status.COMPLETED, label: 'Done', icon: CheckCircle2, color: 'text-nexus-greenGlow' },
  ];

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'bg-red-500/20 text-red-400 border-red-500/30';
      case Priority.HIGH: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case Priority.MEDIUM: return 'bg-nexus-blue/20 text-nexus-blueGlow border-nexus-blue/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full min-h-[500px]">
      {columns.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id);
        const Icon = col.icon;
        
        return (
          <div key={col.id} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${col.color}`} />
                <h3 className="font-semibold text-gray-200">{col.label}</h3>
                <span className="bg-white/10 text-gray-400 text-xs py-0.5 px-2 rounded-full">
                  {colTasks.length}
                </span>
              </div>
            </div>
            
            <div className="flex-1 bg-white/5 rounded-xl p-4 space-y-3 border border-white/5 overflow-y-auto max-h-[600px]">
              {colTasks.map((task) => {
                const client = clients.find(c => c.id === task.clientId);
                const campaign = campaigns.find(c => c.id === task.campaignId);
                const commentsCount = task.comments?.length || 0;
                const attachCount = task.attachments?.length || 0;
                
                return (
                  <div 
                    key={task.id} 
                    onClick={() => onTaskClick && onTaskClick(task)}
                    className="group bg-nexus-card hover:bg-white/10 border border-white/10 hover:border-nexus-blue/50 p-4 rounded-lg transition-all shadow-sm hover:shadow-lg hover:shadow-nexus-blue/5 relative cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1.5 flex-1 mr-2">
                         {client && (
                           <span className="text-[11px] font-bold text-nexus-blueGlow tracking-wide uppercase truncate max-w-[150px]">
                             {client.name}
                           </span>
                         )}
                         <div className="flex flex-wrap gap-1">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border w-fit ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            {campaign && (
                               <span className="flex items-center gap-1 text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                 <Rocket className="h-3 w-3" />
                                 <span className="truncate">{campaign.name}</span>
                               </span>
                            )}
                         </div>
                      </div>

                      {/* Status Edit Dropdown - Stop propagation to prevent opening modal */}
                      <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <select
                            value={task.status}
                            onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
                            className="appearance-none bg-nexus-black border border-white/20 hover:border-nexus-blue/50 text-[10px] text-gray-300 py-1 pl-2 pr-6 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-nexus-blue/50 w-24 transition-colors"
                        >
                            <option value={Status.PENDING}>To Do</option>
                            <option value={Status.IN_PROGRESS}>In Progress</option>
                            <option value={Status.REVIEW}>Review</option>
                            <option value={Status.COMPLETED}>Done</option>
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1.5 h-3 w-3 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-200 mb-1 leading-snug">{task.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500 font-mono">
                              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                            {(commentsCount > 0 || attachCount > 0) && (
                              <div className="flex gap-2 text-gray-500">
                                  {commentsCount > 0 && (
                                    <span className="flex items-center gap-1 text-[10px]"><MessageSquare className="h-3 w-3" /> {commentsCount}</span>
                                  )}
                                  {attachCount > 0 && (
                                    <span className="flex items-center gap-1 text-[10px]"><Paperclip className="h-3 w-3" /> {attachCount}</span>
                                  )}
                              </div>
                            )}
                         </div>
                         {task.assignedBy && (
                            <div className="text-[9px] text-gray-600">
                               By: <span className="text-gray-500">{task.assignedBy}</span>
                            </div>
                         )}
                      </div>

                      <div className="flex items-center gap-2">
                        {task.team && (
                          <span className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                            {task.team}
                          </span>
                        )}
                        <div className="flex -space-x-1">
                          {task.assignedTo?.map((assignee, index) => (
                             <div 
                              key={index}
                              className="h-5 w-5 rounded-full bg-nexus-blue/20 flex items-center justify-center text-[9px] text-nexus-blueGlow border border-nexus-blue/30 ring-1 ring-black" 
                              title={`Assigned to ${assignee}`}
                             >
                               {assignee.charAt(0)}
                             </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {colTasks.length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/5 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;