
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Calendar, Clock, Paperclip, Send, User, 
  MessageSquare, History, FileText, Image as ImageIcon, 
  Trash2, Bell, CheckCircle2, Star, Trophy, Pencil
} from 'lucide-react';
import { Task, Status, Priority, Client, Comment, Attachment, ActivityLog, User as UserType, TaskPerformance } from '../types';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  clients: Client[];
  currentUser: UserType;
  onUpdateTask: (updatedTask: Task) => void;
}

type Tab = 'comments' | 'files' | 'history' | 'score';

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, isOpen, onClose, onEdit, clients, currentUser, onUpdateTask 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('comments');
  const [newComment, setNewComment] = useState('');
  const [reminderHours, setReminderHours] = useState<number>(task.reminderHoursBefore || 0);
  
  // Scoring State
  const [completion, setCompletion] = useState(task.performance?.completion || 0);
  const [onTime, setOnTime] = useState(task.performance?.onTime || 100);
  const [quality, setQuality] = useState(task.performance?.quality || 100);
  const [teamwork, setTeamwork] = useState(task.performance?.teamwork || 50);

  const client = clients.find(c => c.id === task.clientId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-calculate logic for Completion and On-Time
  useEffect(() => {
    // If completed, set completion to 100 automatically if not already set by performance review
    if (task.status === Status.COMPLETED) {
        setCompletion(100);
        
        // Calculate On-Time
        const now = new Date();
        const due = new Date(task.dueDate);
        // Set due date to end of day for fair comparison
        due.setHours(23, 59, 59, 999);
        
        if (now <= due) {
            setOnTime(100);
        } else {
            setOnTime(50); // Late penalty
        }
    } else {
        setCompletion(0); // Reset if moved back
    }
  }, [task.status, task.dueDate]);

  useEffect(() => {
    if (activeTab === 'comments' && isOpen) {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [task.comments, activeTab, isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = (newStatus: Status) => {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      action: `changed status from ${task.status} to ${newStatus}`,
      author: currentUser.name,
      timestamp: new Date().toISOString()
    };

    onUpdateTask({
      ...task,
      status: newStatus,
      history: [...(task.history || []), log]
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c-${Date.now()}`,
      text: newComment,
      author: currentUser.name,
      createdAt: new Date().toISOString()
    };

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      action: 'posted a comment',
      author: currentUser.name,
      timestamp: new Date().toISOString()
    };

    onUpdateTask({
      ...task,
      comments: [...(task.comments || []), comment],
      history: [...(task.history || []), log]
    });
    setNewComment('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file upload
    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file), // Local preview URL
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    const log: ActivityLog = {
        id: `log-${Date.now()}`,
        action: `uploaded file: ${file.name}`,
        author: currentUser.name,
        timestamp: new Date().toISOString()
    };

    onUpdateTask({
      ...task,
      attachments: [...(task.attachments || []), attachment],
      history: [...(task.history || []), log]
    });
  };

  // Scoring Logic
  const calculateTaskScore = () => {
    // Weights: Completion 40%, On-Time 25%, Quality 20%, Teamwork 5%
    // Ideas (10%) is removed from here. Max score here is 90.
    return Math.round(
      (completion * 0.40) +
      (onTime * 0.25) +
      (quality * 0.20) +
      (teamwork * 0.05)
    );
  };

  const handleSaveScore = () => {
     const taskScore = calculateTaskScore();
     const performance: TaskPerformance = {
        completion,
        onTime,
        quality,
        teamwork,
        taskScore,
        ratedBy: currentUser.name,
        ratedAt: new Date().toISOString()
     };

     const log: ActivityLog = {
        id: `log-${Date.now()}`,
        action: `rated performance: ${taskScore}/90`,
        author: currentUser.name,
        timestamp: new Date().toISOString()
     };

     onUpdateTask({
         ...task,
         performance,
         history: [...(task.history || []), log]
     });
     alert(`Task Score Saved: ${taskScore}/90`);
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'bg-red-500/20 text-red-400 border-red-500/30';
      case Priority.HIGH: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case Priority.MEDIUM: return 'bg-nexus-blue/20 text-nexus-blueGlow border-nexus-blue/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-nexus-card border border-white/10 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden h-[85vh] flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: Details */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-white/5">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5">
                            {task.id}
                        </span>
                        {client && <p className="text-xs text-nexus-blueGlow font-bold uppercase mt-1">{client.name}</p>}
                    </div>
                    <div className="flex gap-2">
                         <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                         </span>
                         {onEdit && (
                             <button onClick={onEdit} className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10" title="Edit Details">
                                <Pencil className="h-4 w-4" />
                             </button>
                         )}
                         <button onClick={onClose} className="md:hidden text-gray-400"><X className="h-5 w-5"/></button>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                     <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value as Status)}
                        className="bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-xs focus:border-nexus-blue focus:outline-none cursor-pointer"
                     >
                        <option value={Status.PENDING}>To Do</option>
                        <option value={Status.IN_PROGRESS}>In Progress</option>
                        <option value={Status.REVIEW}>Review</option>
                        <option value={Status.COMPLETED}>Done</option>
                     </select>
                     <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.dueDate).toLocaleDateString()}
                     </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="flex gap-8">
                    <div>
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Assigned To</h3>
                        <div className="flex gap-2">
                            {task.assignedTo?.map(name => (
                                <div key={name} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1 pr-3 py-1">
                                    <div className="h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center text-xs text-nexus-blueGlow font-bold">
                                        {name.charAt(0)}
                                    </div>
                                    <span className="text-xs text-gray-300">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {task.assignedBy && (
                        <div>
                            <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Assigned By</h3>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-300">{task.assignedBy}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Score Summary if exists */}
                {task.performance && (
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                           <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                              <Trophy className="h-4 w-4" /> Task Execution Score
                           </h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{task.performance.taskScore}</span>
                            <span className="text-sm text-gray-500">/ 90</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">Rated by {task.performance.ratedBy} on {new Date(task.performance.ratedAt).toLocaleDateString()}</p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Activity/Tabs */}
        <div className="flex-1 flex flex-col bg-nexus-black/50 w-full md:max-w-md">
            {/* Tabs Header */}
            <div className="flex border-b border-white/10">
                <button 
                   onClick={() => setActiveTab('comments')}
                   className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'comments' ? 'border-nexus-blue text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    <MessageSquare className="h-4 w-4" /> Comments
                </button>
                <button 
                   onClick={() => setActiveTab('files')}
                   className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'files' ? 'border-nexus-green text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    <Paperclip className="h-4 w-4" /> Files
                </button>
                <button 
                   onClick={() => setActiveTab('score')}
                   className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors border-b-2 ${activeTab === 'score' ? 'border-yellow-400 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    <Star className="h-4 w-4" /> Score
                </button>
                <button onClick={onClose} className="hidden md:block p-4 text-gray-400 hover:text-white border-l border-white/10"><X className="h-5 w-5"/></button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative">
                
                {/* COMMENTS TAB */}
                {activeTab === 'comments' && (
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {(!task.comments || task.comments.length === 0) && (
                                <div className="text-center text-gray-500 mt-10 text-sm">No comments yet. Start the conversation!</div>
                            )}
                            {task.comments?.map(comment => (
                                <div key={comment.id} className={`flex gap-3 ${comment.author === currentUser.name ? 'flex-row-reverse' : ''}`}>
                                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {comment.author.charAt(0)}
                                    </div>
                                    <div className={`p-3 rounded-xl max-w-[80%] text-sm ${comment.author === currentUser.name ? 'bg-nexus-blue/20 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                                        <div className="flex justify-between items-baseline gap-4 mb-1">
                                            <span className={`font-bold text-xs ${comment.author === currentUser.name ? 'text-nexus-blueGlow' : 'text-gray-400'}`}>{comment.author}</span>
                                            <span className="text-[10px] opacity-50">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        {comment.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={commentsEndRef} />
                        </div>
                        <form onSubmit={handleAddComment} className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input 
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Type a comment..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-sm text-white focus:border-nexus-blue focus:outline-none"
                                />
                                <button type="submit" disabled={!newComment.trim()} className="absolute right-2 top-2 p-1.5 bg-nexus-blue rounded text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nexus-blueGlow transition-colors">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* FILES TAB */}
                {activeTab === 'files' && (
                    <div className="h-full flex flex-col p-4">
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                             {(!task.attachments || task.attachments.length === 0) && (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500 border-2 border-dashed border-white/10 rounded-lg">
                                    <Paperclip className="h-8 w-8 mb-2 opacity-50" />
                                    <span className="text-sm">No files attached</span>
                                </div>
                            )}
                            {task.attachments?.map(file => (
                                <div key={file.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/30 transition-colors group">
                                    <div className="p-2 bg-nexus-black rounded-lg">
                                        {file.type.includes('image') ? <ImageIcon className="h-5 w-5 text-purple-400" /> : <FileText className="h-5 w-5 text-nexus-blue" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size} • {new Date(file.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <a href={file.url} download className="p-2 text-gray-400 hover:text-white transition-colors" title="Download">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </a>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileUpload}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-3 rounded-lg border border-dashed border-nexus-green/30 text-nexus-green hover:bg-nexus-green/5 hover:border-nexus-green transition-all text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Paperclip className="h-4 w-4" /> Upload File
                            </button>
                        </div>
                    </div>
                )}

                {/* SCORE TAB */}
                {activeTab === 'score' && (
                    <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                        {task.status !== Status.COMPLETED && (
                             <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-lg mb-4 text-xs">
                                 Note: Tasks are usually scored after completion.
                             </div>
                        )}
                        
                        <div className="space-y-4">
                            {/* 1. Completion - AUTO */}
                            <div className="bg-white/5 p-3 rounded-lg">
                                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-1">
                                    <span>Completion (40%)</span>
                                    <span className="text-nexus-blueGlow font-mono">Auto</span>
                                </label>
                                <div className="text-white text-sm font-medium flex justify-between items-center">
                                    <span>{task.status === Status.COMPLETED ? 'Done (100 pts)' : 'Not Done (0 pts)'}</span>
                                    {task.status === Status.COMPLETED ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Calculated automatically based on task status.</p>
                            </div>

                            {/* 2. On-Time - AUTO */}
                            <div className="bg-white/5 p-3 rounded-lg">
                                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-1">
                                    <span>On-Time (25%)</span>
                                    <span className="text-nexus-blueGlow font-mono">Auto</span>
                                </label>
                                <div className="text-white text-sm font-medium flex justify-between items-center">
                                    <span>{onTime === 100 ? 'On Time (100 pts)' : onTime === 50 ? 'Slightly Late (50 pts)' : 'Very Late (0 pts)'}</span>
                                    <span className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Calculated based on due date vs completion date.</p>
                            </div>

                            {/* 3. Quality - MANUAL */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-1">
                                    <span>Quality (20%)</span>
                                    <span className="text-white">{quality} pts</span>
                                </label>
                                <select 
                                    value={quality} 
                                    onChange={e => setQuality(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-nexus-blue outline-none"
                                >
                                    <option value={100}>Excellent (100)</option>
                                    <option value={70}>Some issues (70)</option>
                                    <option value={40}>Poor (40)</option>
                                </select>
                            </div>

                            {/* 4. Teamwork - MANUAL */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-gray-400 uppercase mb-1">
                                    <span>Teamwork (5%)</span>
                                    <span className="text-white">{teamwork} pts</span>
                                </label>
                                <select 
                                    value={teamwork} 
                                    onChange={e => setTeamwork(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-nexus-blue outline-none"
                                >
                                    <option value={100}>Helped team (100)</option>
                                    <option value={50}>Some help (50)</option>
                                    <option value={0}>None (0)</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-white">Task Execution Score:</span>
                                    <span className="text-2xl font-bold text-yellow-400">{calculateTaskScore()}<span className="text-sm text-gray-500">/90</span></span>
                                </div>
                                <button 
                                    onClick={handleSaveScore}
                                    className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Star className="h-4 w-4 fill-current" /> Save Performance Review
                                </button>
                                <p className="text-[10px] text-center text-gray-500 mt-2">
                                    * Total Score (100%) = Task Score (90%) + Idea Lab Ranking (10%)
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default TaskDetailModal;
