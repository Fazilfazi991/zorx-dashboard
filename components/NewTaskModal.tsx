
import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Check, User, Paperclip, Trash2, FileText, Image as ImageIcon, Repeat, Save } from 'lucide-react';
import { Client, Priority, Status, Task, Team, Attachment, User as UserType } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  taskToEdit?: Task | null;
  clients: Client[];
  currentUser: UserType | null;
  users: UserType[];
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onAddTask, onEditTask, taskToEdit, clients, currentUser, users }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [team, setTeam] = useState<Team>(Team.MARKETING);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'Once' | 'Daily' | 'Weekly'>('Once');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
            setClientId(taskToEdit.clientId);
            setPriority(taskToEdit.priority);
            setTeam(taskToEdit.team);
            setDueDate(taskToEdit.dueDate);
            setAssignedTo(taskToEdit.assignedTo || []);
            setFrequency(taskToEdit.frequency || 'Once');
            setAttachments(taskToEdit.attachments || []);
        } else {
            resetForm();
        }
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientId || !dueDate) return;

    if (taskToEdit && onEditTask) {
        // Update Logic
        const updatedTask: Task = {
            ...taskToEdit, // Spread existing fields first
            title,
            description,
            clientId,
            priority,
            team,
            dueDate,
            frequency,
            assignedTo,
            attachments,
            // CRITICAL: Explicitly preserve data that isn't editable in this modal but might exist
            comments: taskToEdit.comments, 
            performance: taskToEdit.performance,
            history: [
                ...(taskToEdit.history || []),
                {
                    id: `h-${Date.now()}`,
                    action: 'updated task details',
                    author: currentUser?.name || 'System',
                    timestamp: new Date().toISOString()
                }
            ]
        };
        onEditTask(updatedTask);
    } else {
        // Create Logic
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title,
            description,
            clientId,
            status: Status.PENDING,
            priority,
            team,
            dueDate,
            frequency,
            assignedTo,
            assignedBy: currentUser?.name || 'System',
            attachments,
            comments: [],
            history: [{
                id: `h-${Date.now()}`,
                action: 'created task',
                author: currentUser?.name || 'System',
                timestamp: new Date().toISOString()
            }]
        };
        onAddTask(newTask);
    }
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setClientId('');
    setPriority(Priority.MEDIUM);
    setTeam(Team.MARKETING);
    setDueDate('');
    setAssignedTo([]);
    setFrequency('Once');
    setAttachments([]);
  };

  const toggleUser = (userName: string) => {
    setAssignedTo(prev => 
      prev.includes(userName) 
        ? prev.filter(u => u !== userName)
        : [...prev, userName]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file), // Local preview URL
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy: currentUser?.name || 'System',
      createdAt: new Date().toISOString()
    };

    setAttachments(prev => [...prev, attachment]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-nexus-card border border-white/10 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 shrink-0">
          <h3 className="text-xl font-bold text-white">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5"/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Title</label>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
              required
            />
          </div>

          <div>
             <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
             <textarea 
               value={description}
               onChange={e => setDescription(e.target.value)}
               placeholder="Details..."
               className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 focus:border-nexus-blue focus:outline-none resize-none"
             />
          </div>

           {/* Attachments Section */}
           <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Attachments / References</label>
            <div className="space-y-3">
                {/* List */}
                {attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-lg group">
                        <div className="flex items-center gap-2 overflow-hidden">
                             <div className="p-1.5 bg-nexus-black rounded">
                                {att.type.includes('image') ? <ImageIcon className="h-4 w-4 text-purple-400" /> : <FileText className="h-4 w-4 text-nexus-blue" />}
                             </div>
                             <span className="text-sm text-gray-300 truncate max-w-[250px]">{att.name}</span>
                        </div>
                        <button type="button" onClick={() => removeAttachment(att.id)} className="text-gray-500 hover:text-red-400 p-1">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                
                {/* Upload Button */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload}
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:text-white hover:border-nexus-blue/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                    <Paperclip className="h-4 w-4" /> Add Reference File
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Client</label>
                <select 
                   value={clientId}
                   onChange={e => setClientId(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
                   required
                >
                   <option value="">Select Client</option>
                   {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Due Date</label>
                <div className="relative">
                   <input 
                     type="date"
                     value={dueDate}
                     onChange={e => setDueDate(e.target.value)}
                     className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none [color-scheme:dark]"
                     required
                   />
                   <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Priority</label>
                <select 
                   value={priority}
                   onChange={e => setPriority(e.target.value as Priority)}
                   className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
                >
                   {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Frequency</label>
                <div className="relative">
                    <select 
                       value={frequency}
                       onChange={e => setFrequency(e.target.value as any)}
                       className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none appearance-none"
                    >
                       <option value="Once">One-time Task</option>
                       <option value="Daily">Daily Recurring</option>
                       <option value="Weekly">Weekly Recurring</option>
                    </select>
                    <Repeat className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
             </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Team</label>
            <select 
                value={team}
                onChange={e => setTeam(e.target.value as Team)}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none"
            >
                {Object.values(Team).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase text-gray-500">Assign Team Members</label>
                <span className="text-xs text-nexus-blueGlow">Assigned By: {taskToEdit ? taskToEdit.assignedBy : currentUser?.name || 'System'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-black/30 rounded-lg border border-white/5">
              {users.map(user => (
                <div 
                  key={user.id}
                  onClick={() => toggleUser(user.name)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${assignedTo.includes(user.name) ? 'bg-nexus-blue/20 border border-nexus-blue/30' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${assignedTo.includes(user.name) ? 'bg-nexus-blue text-black' : 'bg-white/10 text-gray-400'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <span className={`text-sm ${assignedTo.includes(user.name) ? 'text-nexus-blueGlow' : 'text-gray-300'}`}>{user.name}</span>
                  {assignedTo.includes(user.name) && <Check className="ml-auto h-3 w-3 text-nexus-blueGlow" />}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 shrink-0">
             <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
             <button type="submit" className="px-6 py-2 bg-nexus-blue text-black font-bold rounded-lg hover:bg-nexus-blueGlow transition-all flex items-center gap-2">
                 {taskToEdit ? (
                     <><Save className="h-4 w-4" /> Update Task</>
                 ) : (
                     "Create Task"
                 )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
