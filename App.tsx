
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CheckSquare, Settings, Bell, Search, Command, Plus,
  BarChart3, TrendingUp, Megaphone, PenTool, Palette, Code2, X, Filter, Menu,
  Lightbulb, LogOut, Sparkles, Quote, Briefcase, CheckCircle2, ListTodo, CalendarDays,
  Target, Trophy, Lock, ShieldAlert, LogOut as LogOutIcon, Loader2, Database, Clock, ArrowRight
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_TASKS, MOCK_CAMPAIGNS, MOCK_IDEAS, MOTIVATIONAL_QUOTES, MOCK_LEAVES, MOCK_ATTENDANCE, MOCK_HOLIDAYS, MOCK_TARGETS, MOCK_USERS, MOCK_OVERTIME } from './constants';
import { KEYS } from './services/storage';
import { fetchCollection, persistCollection, persistItem, removeItem } from './services/db';
import { isSupabaseConfigured } from './services/supabase';
import { Client, Task, Status, Team, Campaign, Idea, User, Priority, LeaveRequest, AttendanceRecord, Holiday, QuarterlyTarget, OvertimeRecord } from './types';
import StatsCard from './components/StatsCard';
import ClientList from './components/ClientList';
import TaskBoard from './components/TaskBoard';
import AICreator from './components/AICreator';
import IdeaLab from './components/IdeaLab';
import Login from './components/Login';
import NewTaskModal from './components/NewTaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import HRManagement from './components/HRManagement';
import StaffRanking from './components/StaffRanking';
import CompanyTargets from './components/CompanyTargets';
import SettingsView from './components/SettingsView';
import ClientDetails from './components/ClientDetails';

const ADMINS = ['Thameem', 'Fazil', 'Ajzal', 'Salman', 'Ayisha'];
const HR_STAFF = ['Jefla'];

// --- Typewriter Component ---
const Typewriter = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); 
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="inline-block">
      {displayedText}
      <span className="animate-pulse border-r-2 border-nexus-blueGlow ml-1 h-4 inline-block align-middle">&nbsp;</span>
    </span>
  );
};

// --- Access Restricted Component ---
const AccessRestricted = ({ title, message }: { title?: string, message?: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in p-8">
    <div className="relative mb-6 group">
       <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all"></div>
       <div className="relative bg-nexus-card border border-red-500/30 p-8 rounded-full shadow-2xl">
          <Lock className="h-12 w-12 text-red-500" />
       </div>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title || "Access Restricted"}</h2>
    <p className="text-gray-400 max-w-md mb-8">{message || "This section is restricted to authorized administrators only. Please contact management for access."}</p>
    
    <div className="flex items-center gap-2 text-xs font-mono bg-red-500/5 text-red-400 px-4 py-2 rounded-lg border border-red-500/10">
       <ShieldAlert className="h-4 w-4" />
       <span>AUTHORIZATION_LEVEL: ADMIN</span>
    </div>
  </div>
);

// --- Reusable Components ---
const SidebarLink = ({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        isActive 
          ? 'bg-nexus-blue/10 text-nexus-blueGlow border border-nexus-blue/20 shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-nexus-blueGlow' : 'group-hover:text-white'}`} />
      {label}
    </Link>
  );
};

const TeamCard = ({ label, count, icon: Icon, color, onClick }: { label: string; count: number; icon: any; color: string; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-nexus-card border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-nexus-blue/30 hover:bg-white/5 transition-all group"
  >
    <div className="flex items-center gap-3">
       <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
       </div>
       <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </div>
    <span className="text-xl font-bold text-white">{count}</span>
  </div>
);

const TasksPage = ({ 
  tasks, 
  clients, 
  campaigns,
  onStatusChange, 
  onOpenNewTask, 
  onTaskClick, 
  onDeleteTask,
  onEditTask,
  canCreateTask,
  currentUser,
  isAdmin,
  isHR
}: { 
  tasks: Task[], 
  clients: Client[], 
  campaigns: Campaign[],
  onStatusChange: (id: string, status: Status) => void, 
  onOpenNewTask: () => void, 
  onTaskClick: (taskId: string) => void,
  onDeleteTask: (id: string) => void,
  onEditTask: (task: Task) => void,
  canCreateTask: boolean,
  currentUser: User,
  isAdmin: boolean,
  isHR: boolean
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTeam = searchParams.get('team');
  const filterClient = searchParams.get('client');
  const filterCampaign = searchParams.get('campaign');

  const filteredTasks = tasks.filter(t => {
    // Allow viewing all tasks if Admin OR HR. Otherwise, filter by assignment.
    if (!isAdmin && !isHR && !t.assignedTo?.includes(currentUser.name)) return false;
    
    if (filterTeam && t.team !== filterTeam) return false;
    if (filterClient && t.clientId !== filterClient) return false;
    if (filterCampaign && t.campaignId !== filterCampaign) return false;
    return true;
  });

  const clearFilters = () => setSearchParams({});

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-nexus-blueGlow" />
            Task Board
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage tasks, track progress, and collaborate.</p>
        </div>
        
        <div className="flex items-center gap-3">
           {(filterTeam || filterClient || filterCampaign) && (
              <button onClick={clearFilters} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs font-bold border border-white/10">
                <X className="h-3 w-3" /> Clear Filters
              </button>
           )}
           {canCreateTask && (
             <button onClick={onOpenNewTask} className="flex items-center gap-2 bg-nexus-blue text-black px-4 py-2 rounded-lg font-bold hover:bg-nexus-blueGlow transition-all shadow-lg shadow-nexus-blue/20">
               <Plus className="h-5 w-5" /> New Task
             </button>
           )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
         <TaskBoard 
            tasks={filteredTasks} 
            clients={clients} 
            campaigns={campaigns} 
            onStatusChange={onStatusChange} 
            onTaskClick={(t) => onTaskClick(t.id)} 
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            canDelete={canCreateTask}
         />
      </div>
    </div>
  );
};

// --- Dashboard Home View ---
const DashboardHome = ({ 
  clients, tasks, user, attendance, onMarkAttendance, isAdmin
}: { 
  clients: Client[], tasks: Task[], user: User, attendance: AttendanceRecord[], onMarkAttendance: (record: AttendanceRecord) => void, isAdmin: boolean
}) => {
  const navigate = useNavigate();
  // State to track "today" and auto-update at midnight
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Check every minute if the date has changed
    const interval = setInterval(() => {
        const current = new Date().toISOString().split('T')[0];
        if (current !== today) {
            setToday(current);
        }
    }, 60000);
    return () => clearInterval(interval);
  }, [today]);

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const totalPending = tasks.filter(t => t.status !== Status.COMPLETED).length;

  const myTasks = tasks.filter(t => t.assignedTo?.includes(user.name));
  const myPendingTasks = myTasks.filter(t => t.status !== Status.COMPLETED);
  const myCompletedTasks = myTasks.filter(t => t.status === Status.COMPLETED).length;

  const marketingPending = tasks.filter(t => t.team === Team.MARKETING && t.status !== Status.COMPLETED).length;
  const contentPending = tasks.filter(t => t.team === Team.CONTENT && t.status !== Status.COMPLETED).length;
  const creativePending = tasks.filter(t => t.team === Team.CREATIVE && t.status !== Status.COMPLETED).length;
  const devPending = tasks.filter(t => t.team === Team.DEV && t.status !== Status.COMPLETED).length;

  // Uses the reactive `today` state
  const myRecord = attendance.find(r => r.userId === user.id && r.date === today);
  const isCheckedIn = !!myRecord;
  const isCheckedOut = !!myRecord?.checkOutTime;

  const handleQuickAction = () => {
    if (isCheckedOut) return; 
    const now = new Date();
    const istTime = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: false, hour: '2-digit', minute: '2-digit' });
    const istHour = parseInt(istTime.split(':')[0], 10);
    const istMinute = parseInt(istTime.split(':')[1], 10);
    
    if (isCheckedIn) {
       onMarkAttendance({ ...myRecord, checkOutTime: istTime });
    } else {
        // Restriction: Cannot check in before 10 AM
        if (istHour < 10) {
            alert("Office hours start at 10:00 AM. You cannot check in yet.");
            return;
        }

        let status: 'Present' | 'Late' = 'Present';
        if (istHour > 10 || (istHour === 10 && istMinute > 0)) status = 'Late';
        const record: AttendanceRecord = {
            id: `att-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            date: today,
            checkInTime: istTime,
            status: status
        };
        onMarkAttendance(record);
    }
  };

  const handleTeamClick = (team: Team) => navigate(`/tasks?team=${encodeURIComponent(team)}`);

  const motivationalQuote = React.useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex].replace('{name}', user.name);
  }, [user.name]);

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'bg-red-500/20 text-red-400 border-red-500/30';
      case Priority.HIGH: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case Priority.MEDIUM: return 'bg-nexus-blue/20 text-nexus-blueGlow border-nexus-blue/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
            <div className="mt-4 relative overflow-hidden rounded-xl bg-gradient-to-r from-nexus-blue/10 via-purple-500/10 to-nexus-green/10 border border-white/10 p-4 max-w-3xl">
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-nexus-blue to-nexus-greenGlow"></div>
               <div className="flex gap-3 items-start">
                  <Quote className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                  <p className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-nexus-blueGlow via-white to-nexus-greenGlow drop-shadow-sm">
                    <Typewriter text={motivationalQuote} speed={40} />
                  </p>
               </div>
            </div>
          </div>
      </div>

      {isAdmin && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Active Clients" value={activeClients} trend="2" isPositive={true} icon={<Users className="h-6 w-6" />} color="green" />
          <StatsCard title="Pending Tasks" value={totalPending} trend="5%" isPositive={false} icon={<CheckSquare className="h-6 w-6" />} color="blue" />
        </div>

        {/* RECENT ACTIVE CLIENTS */}
        <div className="bg-nexus-card border border-white/10 rounded-xl overflow-hidden mt-6">
           <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
               <h3 className="font-bold text-white flex items-center gap-2">
                   <Users className="h-5 w-5 text-nexus-blueGlow" />
                   Recent Active Clients
               </h3>
               <button onClick={() => navigate('/clients')} className="text-xs text-nexus-blue hover:text-white flex items-center gap-1 transition-colors">
                   View All <ArrowRight className="h-3 w-3" />
               </button>
           </div>
           <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.filter(c => c.status === 'Active').slice(0, 6).map(client => (
                 <div key={client.id} onClick={() => navigate(`/clients/${client.id}`)} className="p-3 rounded-lg border border-white/5 bg-white/5 hover:border-nexus-blue/30 transition-all cursor-pointer group flex items-center gap-3">
                     <img src={client.avatarUrl} alt={client.name} className="h-10 w-10 rounded-full bg-gray-800" />
                     <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-white truncate group-hover:text-nexus-blueGlow transition-colors">{client.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{client.industry}</p>
                     </div>
                     <span className="h-2 w-2 rounded-full bg-nexus-greenGlow shrink-0"></span>
                 </div>
              ))}
           </div>
        </div>

        {/* TEAM WORKLOAD */}
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-nexus-blueGlow" />
               Team Workload (Pending)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TeamCard label="Marketing" count={marketingPending} icon={Megaphone} color="text-blue-400" onClick={() => handleTeamClick(Team.MARKETING)} />
              <TeamCard label="Content" count={contentPending} icon={PenTool} color="text-green-400" onClick={() => handleTeamClick(Team.CONTENT)} />
              <TeamCard label="Creative" count={creativePending} icon={Palette} color="text-purple-400" onClick={() => handleTeamClick(Team.CREATIVE)} />
              <TeamCard label="Development" count={devPending} icon={Code2} color="text-orange-400" onClick={() => handleTeamClick(Team.DEV)} />
            </div>
          </div>
        </>
      )}

      {/* MY WORKSPACE SECTION */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm mt-8">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
           <Briefcase className="h-5 w-5 text-nexus-blueGlow" />
           <h3 className="text-xl font-bold text-white">My Workspace</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="space-y-4">
              <div className={`bg-nexus-card border rounded-lg p-4 flex flex-col justify-between relative overflow-hidden transition-all group ${isCheckedIn ? (isCheckedOut ? 'border-gray-500/30 bg-white/5' : 'border-nexus-green/30 bg-nexus-green/5') : 'border-nexus-blue/30 bg-nexus-blue/5 hover:border-nexus-blue/50'}`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl -mr-8 -mt-8 ${isCheckedIn ? 'bg-nexus-green/20' : 'bg-nexus-blue/20'}`} />
                  <div className="flex justify-between items-start z-10">
                      <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Daily Attendance</p>
                          {isCheckedIn ? (
                              <div>
                                  <p className="text-2xl font-bold text-white">{myRecord?.checkInTime}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${myRecord?.status === 'Late' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' : 'text-nexus-greenGlow border-nexus-green/30 bg-nexus-green/10'}`}>
                                          {myRecord?.status}
                                      </span>
                                      {isCheckedOut && (
                                          <span className="text-[10px] text-gray-400">Out: {myRecord?.checkOutTime}</span>
                                      )}
                                  </div>
                              </div>
                          ) : (
                              <div>
                                  <p className="text-xl font-bold text-white">Not Checked In</p>
                                  <p className="text-xs text-gray-400 mt-1">Mark your presence now.</p>
                              </div>
                          )}
                      </div>
                      <div className={`p-2.5 rounded-lg ${isCheckedIn ? 'bg-nexus-green/20 text-nexus-greenGlow' : 'bg-nexus-blue/20 text-nexus-blueGlow'}`}>
                          <Clock className="h-5 w-5" />
                      </div>
                  </div>
                  {!isCheckedOut && (
                      <button onClick={handleQuickAction} className={`mt-3 w-full py-2 rounded-md text-sm font-bold transition-colors flex items-center justify-center gap-2 z-10 ${isCheckedIn ? 'bg-nexus-card border border-red-500/30 text-red-400 hover:bg-red-500/10' : 'bg-nexus-blue text-black hover:bg-nexus-blueGlow'}`}>
                         {isCheckedIn ? <><LogOutIcon className="h-4 w-4" /> Check Out</> : <><CheckCircle2 className="h-4 w-4" /> Check In</>}
                      </button>
                  )}
                  {isCheckedOut && (
                      <div className="mt-3 w-full py-2 rounded-md bg-white/5 border border-white/10 text-gray-400 text-sm font-bold text-center flex items-center justify-center gap-2 cursor-default">
                          <CheckCircle2 className="h-4 w-4" /> Shift Completed
                      </div>
                  )}
              </div>
              <div className="bg-nexus-card border border-white/10 p-4 rounded-lg flex items-center justify-between">
                 <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">My Pending</p>
                    <p className="text-2xl font-bold text-white">{myPendingTasks.length}</p>
                 </div>
                 <div className="p-3 bg-nexus-blue/10 rounded-lg">
                    <ListTodo className="h-5 w-5 text-nexus-blueGlow" />
                 </div>
              </div>
              <div className="bg-nexus-card border border-white/10 p-4 rounded-lg flex items-center justify-between">
                 <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold">Completed (Total)</p>
                    <p className="text-2xl font-bold text-nexus-greenGlow">{myCompletedTasks}</p>
                 </div>
                 <div className="p-3 bg-nexus-green/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-nexus-greenGlow" />
                 </div>
              </div>
           </div>
           <div className="lg:col-span-2 bg-nexus-card border border-white/10 rounded-lg overflow-hidden flex flex-col h-[280px]">
              <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
                 <h4 className="font-semibold text-gray-200 text-sm">Assigned to Me</h4>
                 <button onClick={() => navigate('/tasks')} className="text-xs text-nexus-blueGlow hover:text-white transition-colors">View Board</button>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                 {myPendingTasks.length > 0 ? (
                    myPendingTasks.map(task => {
                      const client = clients.find(c => c.id === task.clientId);
                      return (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-transparent hover:border-white/10 transition-all group">
                           <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`h-2 w-2 rounded-full shrink-0 ${task.priority === Priority.CRITICAL ? 'bg-red-500' : task.priority === Priority.HIGH ? 'bg-orange-500' : 'bg-nexus-blue'}`} />
                              <div className="min-w-0">
                                 <p className="text-sm font-medium text-white truncate">{task.title}</p>
                                 <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{client?.name}</span>
                                    <span>•</span>
                                    <span className="text-gray-400">{new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                 </div>
                              </div>
                           </div>
                           <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                             {task.priority}
                           </span>
                        </div>
                      )
                    })
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                       <CheckCircle2 className="h-8 w-8 mb-2 opacity-50" />
                       <p>All caught up! No pending tasks.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

// --- Main App Component ---
function App() {
  const [appLoading, setAppLoading] = useState(true);

  // State initialization
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [overtimeRecords, setOvertimeRecords] = useState<OvertimeRecord[]>([]);
  const [targets, setTargets] = useState<QuarterlyTarget[]>([]);

  // Async Load
  useEffect(() => {
    async function initData() {
      const [u, c, t, cmp, i, l, a, h, ot, tr] = await Promise.all([
        fetchCollection(KEYS.USERS, [...MOCK_USERS]),
        fetchCollection(KEYS.CLIENTS, MOCK_CLIENTS),
        fetchCollection(KEYS.TASKS, MOCK_TASKS),
        fetchCollection(KEYS.CAMPAIGNS, MOCK_CAMPAIGNS),
        fetchCollection(KEYS.IDEAS, MOCK_IDEAS),
        fetchCollection(KEYS.LEAVES, MOCK_LEAVES),
        fetchCollection(KEYS.ATTENDANCE, MOCK_ATTENDANCE),
        fetchCollection(KEYS.HOLIDAYS, MOCK_HOLIDAYS),
        fetchCollection(KEYS.OVERTIME, MOCK_OVERTIME),
        fetchCollection(KEYS.TARGETS, MOCK_TARGETS)
      ]);

      setUsers(u);
      setClients(c);
      setTasks(t);
      setCampaigns(cmp);
      setIdeas(i);
      setLeaves(l);
      setAttendance(a);
      setHolidays(h);
      setOvertimeRecords(ot);
      setTargets(tr);
      setAppLoading(false);
    }
    initData();
  }, []);

  // UI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Keep a ref to tasks for polling to avoid stale closures
  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  // Live Sync / Polling for Tasks
  useEffect(() => {
    if (!user) return;
    const pollInterval = setInterval(async () => {
      // Use ref to get current tasks for fallback
      const latestTasks = await fetchCollection(KEYS.TASKS, tasksRef.current);
      // Only update if there's a difference to prevent unnecessary renders/flickering,
      // though React handles identity checks.
      if (JSON.stringify(latestTasks) !== JSON.stringify(tasksRef.current)) {
          setTasks(latestTasks);
      }
    }, 3000); 

    return () => clearInterval(pollInterval);
  }, [user]);

  // Update wrappers that handle both State and DB persistence
  const updateUsers = (newData: User[]) => { setUsers(newData); persistCollection(KEYS.USERS, newData); };
  const updateClients = (newData: Client[]) => { setClients(newData); persistCollection(KEYS.CLIENTS, newData); };
  // NOTE: Task updates are handled granularly via persistItem now to prevent race conditions
  const updateCampaigns = (newData: Campaign[]) => { setCampaigns(newData); persistCollection(KEYS.CAMPAIGNS, newData); };
  const updateIdeas = (newData: Idea[]) => { setIdeas(newData); persistCollection(KEYS.IDEAS, newData); };
  const updateLeaves = (newData: LeaveRequest[]) => { setLeaves(newData); persistCollection(KEYS.LEAVES, newData); };
  const updateAttendance = (newData: AttendanceRecord[]) => { setAttendance(newData); persistCollection(KEYS.ATTENDANCE, newData); };
  const updateHolidays = (newData: Holiday[]) => { setHolidays(newData); persistCollection(KEYS.HOLIDAYS, newData); };
  const updateOvertime = (newData: OvertimeRecord[]) => { setOvertimeRecords(newData); persistCollection(KEYS.OVERTIME, newData); };
  const updateTargets = (newData: QuarterlyTarget[]) => { setTargets(newData); persistCollection(KEYS.TARGETS, newData); };

  // Derived Access
  const isAdmin = !!user && ADMINS.includes(user.name);
  const isHR = !!user && HR_STAFF.includes(user.name);
  const canCreateTask = isAdmin || isHR;
  
  // Derived Data for Modal
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) || null : null;

  // Handlers
  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  const handleUpdatePassword = (newPass: string) => {
    if (!user) return;
    const updated = users.map(u => u.id === user.id ? { ...u, password: newPass } : u);
    updateUsers(updated);
    setUser({ ...user, password: newPass });
  };

  const handleAddUser = (newUser: User) => updateUsers([...users, newUser]);
  
  const handleDeleteUser = (id: string) => {
    if(window.confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) {
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        removeItem(KEYS.USERS, id); // Specific delete for Supabase
        if (!isSupabaseConfigured) persistCollection(KEYS.USERS, updated); // Local fallback
    }
  };

  const handleAddOvertime = (rec: OvertimeRecord) => updateOvertime([rec, ...overtimeRecords]);
  
  const handleTaskStatusChange = (id: string, status: Status) => {
    // Determine the task and if recurrence is needed BEFORE state update to avoid side effects in setter
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const previousStatus = task.status;
    if (status === previousStatus) return;

    let nextTask: Task | null = null;

    // Check for Recurrence Logic (Only if moving TO Completed, and wasn't already Completed)
    if (task.frequency && task.frequency !== 'Once' && status === Status.COMPLETED && previousStatus !== Status.COMPLETED) {
        // Calculate next date
        const nextDate = new Date(task.dueDate);
        if (task.frequency === 'Daily') nextDate.setDate(nextDate.getDate() + 1);
        if (task.frequency === 'Weekly') nextDate.setDate(nextDate.getDate() + 7);
        const nextDateStr = nextDate.toISOString().split('T')[0];

        // DUPLICATION GUARD: Check if a task with same title and date already exists
        const exists = tasks.some(t => 
            t.title === task.title && 
            t.dueDate === nextDateStr && 
            t.id !== task.id // Don't check against self
        );

        if (!exists) {
            nextTask = {
                ...task,
                id: `task-${Date.now()}`, // New ID
                title: task.title, // Same title
                status: Status.PENDING, // Reset status
                dueDate: nextDateStr, // New Date
                history: [{ // Reset history
                    id: `h-${Date.now()}`,
                    action: `Recurring task created from previous instance`,
                    author: 'System',
                    timestamp: new Date().toISOString()
                }],
                comments: [], // Clear comments
                attachments: task.attachments, // Keep attachments as they might be templates
                performance: undefined // Clear performance score
            };
        }
    }

    const updatedTask = { ...task, status };

    // Update Local State
    setTasks(prev => {
        const newTasks = prev.map(t => t.id === id ? updatedTask : t);
        if (nextTask) {
            return [nextTask, ...newTasks];
        }
        return newTasks;
    });

    // Persist to DB (Side Effects)
    persistItem(KEYS.TASKS, updatedTask);
    if (nextTask) {
        persistItem(KEYS.TASKS, nextTask);
    }
  };

  const handleAddAITasks = (newT: Task[]) => {
      // Add multiple tasks
      setTasks([...tasks, ...newT]);
      // Persist each new task individually to ensure no overwrites of existing data
      newT.forEach(t => persistItem(KEYS.TASKS, t));
  };

  const handleAddTask = (t: Task) => {
      setTasks([t, ...tasks]);
      persistItem(KEYS.TASKS, t);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated); // Local state update
      removeItem(KEYS.TASKS, id); // Supabase delete
      if (!isSupabaseConfigured) persistCollection(KEYS.TASKS, updated); // Local storage sync
    }
  };
  
  // Update task logic refined to ensure selectedTask remains consistent with the main list
  const handleUpdateTask = (t: Task) => {
    // Use functional update to ensure we always have the latest state, preventing race conditions
    setTasks(currentTasks => {
        const newTasks = currentTasks.map(ot => ot.id === t.id ? t : ot);
        return newTasks;
    });
    
    // CRITICAL: Save only the SINGLE ITEM to avoid overwriting other tasks in the DB
    persistItem(KEYS.TASKS, t);
  };

  const handleEditTaskClick = (task: Task) => {
      setTaskToEdit(task);
      setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
  };

  const handleAddClient = (c: Client) => updateClients([...clients, c]);
  const handleUpdateClient = (c: Client) => updateClients(clients.map(oc => oc.id === c.id ? c : oc));
  const handleDeleteClient = (id: string) => {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      removeItem(KEYS.CLIENTS, id); // Specific delete for Supabase
      if (!isSupabaseConfigured) persistCollection(KEYS.CLIENTS, updated); // Local fallback
  };
  const handleUpdateTarget = (t: QuarterlyTarget) => updateTargets(targets.map(ot => ot.id === t.id ? t : ot));
  const handleMobileLinkClick = () => setIsMobileMenuOpen(false);
  const handleVoteIdea = (id: string) => {
    updateIdeas(ideas.map(i => i.id === id ? { ...i, votes: i.hasVoted ? i.votes - 1 : i.votes + 1, hasVoted: !i.hasVoted } : i));
  };
  const handleAddIdea = (data: Omit<Idea, 'id' | 'votes' | 'hasVoted' | 'createdAt' | 'status'>) => {
    updateIdeas([{ ...data, id: `idea-${Date.now()}`, votes: 0, hasVoted: false, createdAt: new Date().toISOString(), status: 'New' }, ...ideas]);
  };
  const handleApplyLeave = (l: LeaveRequest) => updateLeaves([l, ...leaves]);
  const handleUpdateLeaveStatus = (id: string, s: 'Approved' | 'Rejected') => {
    if(!user) return;
    updateLeaves(leaves.map(l => l.id === id ? { ...l, status: s, approvedBy: user.name } : l));
  };
  const handleMarkAttendance = (rec: AttendanceRecord) => {
    const idx = attendance.findIndex(r => r.id === rec.id);
    if(idx >= 0) {
      const cp = [...attendance]; cp[idx] = rec; updateAttendance(cp);
    } else {
      updateAttendance([...attendance, rec]);
    }
  };
  const handleAddHoliday = (h: Holiday) => updateHolidays([...holidays, h]);

  // Notifications
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
        const now = new Date();
        const upcoming = tasks.filter(t => {
            if (!t.dueDate || t.status === Status.COMPLETED || !t.assignedTo?.includes(user.name)) return false;
            const diff = (new Date(t.dueDate).getTime() - now.getTime()) / (36e5);
            return (t.reminderHoursBefore || 0) > 0 && diff > 0 && diff <= (t.reminderHoursBefore || 0);
        });
        setNotifications(upcoming.length > 0 ? upcoming.map(t => `Reminder: "${t.title}" is due soon!`) : []);
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks, user]);

  if (appLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-nexus-black text-white gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-blueGlow" />
        <span className="text-lg font-bold">Loading Zorx OS...</span>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} users={users} />;

  return (
    <Router>
      <div className="flex h-screen w-full bg-nexus-black text-gray-100 font-sans selection:bg-nexus-green selection:text-black">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
             {/* Backdrop */}
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
             
             {/* Sidebar Content */}
             <aside className="relative flex w-64 flex-col border-r border-white/10 bg-nexus-dark h-full shadow-2xl animate-in slide-in-from-left duration-300">
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                      <img src="https://zorxmedia.com/wp-content/uploads/2025/12/logo-1-scaled-e1766209436341.png" alt="Zorx Logo" className="h-8 w-auto object-contain" />
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                       <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                
                <div className="flex-1 space-y-1 px-3 py-6">
                   <div className="px-3 mb-6">
                       <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-nexus-blue flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                          </div>
                       </div>
                   </div>

                   <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" onClick={handleMobileLinkClick} />
                   <SidebarLink to="/tasks" icon={CheckSquare} label="Task Board" onClick={handleMobileLinkClick} />
                   <SidebarLink to="/clients" icon={Users} label="Clients" onClick={handleMobileLinkClick} />
                   <SidebarLink to="/ranking" icon={Trophy} label="Staff Ranking" onClick={handleMobileLinkClick} />
                   <SidebarLink to="/targets" icon={Target} label="Company Targets" onClick={handleMobileLinkClick} />
                   <SidebarLink to="/hr" icon={CalendarDays} label="HR & Staff" onClick={handleMobileLinkClick} />
                   <SidebarLink to="/ideas" icon={Lightbulb} label="Idea Lab" onClick={handleMobileLinkClick} />
                </div>
                
                <div className="border-t border-white/10 p-4 space-y-2">
                   <button onClick={() => { setIsAIModalOpen(true); setIsMobileMenuOpen(false); }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-nexus-blue/20 to-nexus-green/20 border border-white/5 p-3 text-sm font-medium text-white transition-all hover:from-nexus-blue/30 hover:to-nexus-green/30">
                     <Command className="h-4 w-4" /> <span>AI Command</span>
                   </button>
                   <Link to="/settings" onClick={handleMobileLinkClick} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                     <Settings className="h-4 w-4" /> Settings
                   </Link>
                   <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
                     <LogOut className="h-4 w-4" /> Logout
                   </button>
                </div>
             </aside>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-nexus-dark md:flex">
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <img src="https://zorxmedia.com/wp-content/uploads/2025/12/logo-1-scaled-e1766209436341.png" alt="Zorx Logo" className="h-8 w-auto object-contain" />
            </div>
          </div>
          <div className="flex-1 space-y-1 px-3 py-6">
            <div className="px-3 mb-6">
                 <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-nexus-blue flex items-center justify-center font-bold text-lg text-white shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                    </div>
                 </div>
            </div>
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLink to="/tasks" icon={CheckSquare} label="Task Board" />
            <SidebarLink to="/clients" icon={Users} label="Clients" />
            <SidebarLink to="/ranking" icon={Trophy} label="Staff Ranking" />
            <SidebarLink to="/targets" icon={Target} label="Company Targets" />
            <SidebarLink to="/hr" icon={CalendarDays} label="HR & Staff" />
            <SidebarLink to="/ideas" icon={Lightbulb} label="Idea Lab" />
          </div>
          <div className="border-t border-white/10 p-4 space-y-2">
            <button onClick={() => setIsAIModalOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-nexus-blue/20 to-nexus-green/20 border border-white/5 p-3 text-sm font-medium text-white transition-all hover:from-nexus-blue/30 hover:to-nexus-green/30">
              <Command className="h-4 w-4" /> <span>AI Command</span>
            </button>
             <Link to="/settings" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
               <Settings className="h-4 w-4" /> Settings
             </Link>
             <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
               <LogOut className="h-4 w-4" /> Logout
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-white/10 bg-nexus-black/50 px-4 md:px-8 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1 text-gray-400 hover:text-white">
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input type="text" placeholder="Search clients, tasks..." className="h-9 w-64 lg:w-96 rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-gray-200 focus:border-nexus-blue/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-nexus-blue/50 transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isSupabaseConfigured && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400">
                      <Database className="h-3 w-3" /> Cloud Sync Active
                  </div>
              )}
              <button className="relative rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Bell className={`h-5 w-5 ${notifications.length > 0 ? 'text-nexus-blueGlow' : ''}`} />
                {notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-nexus-blueGlow ring-2 ring-black animate-pulse"></span>}
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-nexus-blue ring-2 ring-white/10 cursor-pointer flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
             <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
               <div className="absolute top-[20%] left-[20%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-nexus-blue/5 rounded-full blur-[128px]" />
               <div className="absolute bottom-[20%] right-[20%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-nexus-green/5 rounded-full blur-[128px]" />
            </div>

            {notifications.length > 0 && (
                <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                    {notifications.map((note, i) => (
                        <div key={i} className="bg-nexus-card border border-nexus-blue/30 p-3 rounded-lg shadow-xl text-sm text-white flex items-center gap-2 animate-in slide-in-from-right">
                             <Bell className="h-4 w-4 text-nexus-blueGlow" /> {note}
                        </div>
                    ))}
                </div>
            )}

            <div className="relative z-10 h-full">
              <Routes>
                <Route path="/" element={<DashboardHome clients={clients} tasks={tasks} user={user} attendance={attendance} onMarkAttendance={handleMarkAttendance} isAdmin={isAdmin} />} />
                <Route path="/tasks" element={<TasksPage 
                    tasks={tasks} 
                    clients={clients} 
                    campaigns={campaigns} 
                    onStatusChange={handleTaskStatusChange} 
                    onOpenNewTask={() => setIsTaskModalOpen(true)} 
                    onTaskClick={(id) => setSelectedTaskId(id)} 
                    onDeleteTask={handleDeleteTask} 
                    onEditTask={handleEditTaskClick}
                    canCreateTask={canCreateTask} 
                    currentUser={user} 
                    isAdmin={isAdmin} 
                    isHR={isHR}
                />} />
                <Route path="/clients" element={isAdmin ? <div className="space-y-6"><h2 className="text-2xl font-bold text-white">Client Management</h2><ClientList clients={clients} onAddClient={handleAddClient} onUpdateClient={handleUpdateClient} onDeleteClient={handleDeleteClient} /></div> : <AccessRestricted title="Client Database Locked" />} />
                <Route path="/clients/:clientId" element={<ClientDetails clients={clients} tasks={tasks} campaigns={campaigns} onTaskClick={(t) => setSelectedTaskId(t.id)} />} />
                <Route path="/ranking" element={<StaffRanking users={users} tasks={tasks} ideas={ideas} />} />
                <Route path="/targets" element={isAdmin ? <CompanyTargets targets={targets} onUpdateTarget={handleUpdateTarget} currentUser={user} isReadOnly={false} /> : <AccessRestricted title="Strategy & Targets Locked" />} />
                <Route path="/hr" element={<HRManagement currentUser={user} users={users} leaves={leaves} attendance={attendance} holidays={holidays} onApplyLeave={handleApplyLeave} onUpdateLeaveStatus={handleUpdateLeaveStatus} onMarkAttendance={handleMarkAttendance} onAddHoliday={handleAddHoliday} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} overtimeRecords={overtimeRecords} onAddOvertime={handleAddOvertime} isAdmin={isAdmin} isHR={isHR} />} />
                <Route path="/ideas" element={<IdeaLab ideas={ideas} clients={clients} currentUser={user} onVote={handleVoteIdea} onAddIdea={handleAddIdea} />} />
                <Route path="/settings" element={<SettingsView currentUser={user} onUpdatePassword={handleUpdatePassword} />} />
                <Route path="*" element={<DashboardHome clients={clients} tasks={tasks} user={user} attendance={attendance} onMarkAttendance={handleMarkAttendance} isAdmin={isAdmin} />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>

      <AICreator isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} clients={clients} onAddTasks={handleAddAITasks} />
      <NewTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={handleTaskModalClose} 
        onAddTask={handleAddTask} 
        onEditTask={handleUpdateTask}
        taskToEdit={taskToEdit}
        clients={clients} 
        currentUser={user} 
        users={users} 
      />
      {selectedTask && <TaskDetailModal 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTaskId(null)} 
        onEdit={() => { setSelectedTaskId(null); handleEditTaskClick(selectedTask); }}
        clients={clients} 
        currentUser={user} 
        onUpdateTask={handleUpdateTask} 
      />}
    </Router>
  );
}

export default App;
