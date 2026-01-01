import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  Bell, 
  Search, 
  Command, 
  Plus,
  BarChart3,
  TrendingUp,
  Megaphone,
  PenTool,
  Palette,
  Code2,
  X
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_TASKS } from './constants';
import { Client, Task, Status, Team } from './types';
import StatsCard from './components/StatsCard';
import ClientList from './components/ClientList';
import TaskBoard from './components/TaskBoard';
import AICreator from './components/AICreator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Dashboard Home View ---
const DashboardHome = ({ clients, tasks }: { clients: Client[], tasks: Task[] }) => {
  const navigate = useNavigate();
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const totalPending = tasks.filter(t => t.status !== Status.COMPLETED).length;

  // Calculate pending tasks per team
  const marketingPending = tasks.filter(t => t.team === Team.MARKETING && t.status !== Status.COMPLETED).length;
  const contentPending = tasks.filter(t => t.team === Team.CONTENT && t.status !== Status.COMPLETED).length;
  const creativePending = tasks.filter(t => t.team === Team.CREATIVE && t.status !== Status.COMPLETED).length;
  const devPending = tasks.filter(t => t.team === Team.DEV && t.status !== Status.COMPLETED).length;

  const chartData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 7 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 9 },
    { name: 'Fri', tasks: 6 },
    { name: 'Sat', tasks: 2 },
    { name: 'Sun', tasks: 1 },
  ];

  const handleTeamClick = (team: Team) => {
    navigate(`/tasks?team=${encodeURIComponent(team)}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title="Active Clients"
          value={activeClients}
          trend="2"
          isPositive={true}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatsCard 
          title="Total Pending Tasks"
          value={totalPending}
          trend="5%"
          isPositive={false}
          icon={<CheckSquare className="h-6 w-6" />}
          color="blue"
        />
      </div>

      {/* Team Workload Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
           <BarChart3 className="h-5 w-5 text-nexus-blueGlow" />
           Team Workload (Pending)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TeamCard 
            label="Marketing" 
            count={marketingPending} 
            icon={Megaphone} 
            color="text-blue-400" 
            onClick={() => handleTeamClick(Team.MARKETING)}
          />
          <TeamCard 
            label="Content" 
            count={contentPending} 
            icon={PenTool} 
            color="text-green-400" 
            onClick={() => handleTeamClick(Team.CONTENT)}
          />
          <TeamCard 
            label="Creative" 
            count={creativePending} 
            icon={Palette} 
            color="text-purple-400" 
            onClick={() => handleTeamClick(Team.CREATIVE)}
          />
          <TeamCard 
            label="Development" 
            count={devPending} 
            icon={Code2} 
            color="text-orange-400" 
            onClick={() => handleTeamClick(Team.DEV)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-white/10 bg-nexus-card p-6 shadow-xl">
           <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
             <TrendingUp className="h-5 w-5 text-nexus-blueGlow" /> 
             Task Velocity
           </h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#22d3ee' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                 />
                 <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#10b981'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        
        <ClientList clients={clients} />
      </div>
    </div>
  );
};

// --- Tasks Page Component ---
const TasksPage = ({ tasks, clients, onStatusChange }: { tasks: Task[], clients: Client[], onStatusChange: (id: string, status: Status) => void }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter = searchParams.get('team');

  const filteredTasks = teamFilter 
    ? tasks.filter(t => t.team === teamFilter)
    : tasks;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-4">
           <h2 className="text-2xl font-bold text-white">Task Board</h2>
           {teamFilter && (
             <button 
               onClick={() => setSearchParams({})}
               className="group flex items-center gap-2 bg-nexus-blue/10 hover:bg-nexus-blue/20 text-nexus-blueGlow px-3 py-1 rounded-full text-sm border border-nexus-blue/20 transition-all"
             >
               <span>{teamFilter}</span>
               <X className="h-3 w-3 group-hover:text-white" />
             </button>
           )}
         </div>
         <button className="flex items-center gap-2 bg-nexus-blue text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-nexus-blueGlow transition-colors">
           <Plus className="h-4 w-4" /> New Task
         </button>
      </div>
      <TaskBoard tasks={filteredTasks} clients={clients} onStatusChange={onStatusChange} />
    </div>
  );
};

// Simple Component for Team Cards
const TeamCard = ({ label, count, icon: Icon, color, onClick }: { label: string, count: number, icon: any, color: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-nexus-card border border-white/10 p-5 rounded-xl flex items-center justify-between transition-all ${onClick ? 'cursor-pointer hover:border-nexus-blue/50 hover:bg-white/5 hover:shadow-lg hover:shadow-nexus-blue/5' : ''}`}
  >
    <div>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{count}</p>
    </div>
    <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

// --- Sidebar Component ---
const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
        ${isActive 
          ? 'bg-nexus-blue/10 text-nexus-blueGlow' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-nexus-blueGlow' : 'text-gray-500 group-hover:text-white'}`} />
      {label}
    </Link>
  );
};

// --- Main App Component ---
function App() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleTaskStatusChange = (taskId: string, newStatus: Status) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAddAITasks = (newTasks: Task[]) => {
    setTasks(prev => [...prev, ...newTasks]);
  };

  return (
    <Router>
      <div className="flex h-screen w-full bg-nexus-black text-gray-100 font-sans selection:bg-nexus-green selection:text-black">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-nexus-dark md:flex">
          <div className="flex h-16 items-center border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://zorxmedia.com/wp-content/uploads/2025/12/logo-1-scaled-e1766209436341.png"
                alt="Zorx Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-white">ZORX</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-1 px-3 py-6">
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLink to="/tasks" icon={CheckSquare} label="Task Board" />
            <SidebarLink to="/clients" icon={Users} label="Clients" />
            <SidebarLink to="/campaigns" icon={TrendingUp} label="Campaigns" />
          </div>

          <div className="border-t border-white/10 p-4">
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-nexus-blue/20 to-nexus-green/20 border border-white/5 p-3 text-sm font-medium text-white transition-all hover:from-nexus-blue/30 hover:to-nexus-green/30 hover:shadow-lg hover:shadow-nexus-blue/10"
            >
              <Command className="h-4 w-4" />
              <span>AI Command</span>
            </button>
          </div>

          <div className="border-t border-white/10 p-4">
            <SidebarLink to="/settings" icon={Settings} label="Settings" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-white/10 bg-nexus-black/50 px-8 backdrop-blur-md">
            <div className="flex items-center gap-4 w-96">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search clients, tasks..." 
                  className="h-9 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-gray-200 focus:border-nexus-blue/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-nexus-blue/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-full p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-nexus-greenGlow ring-2 ring-black"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-nexus-blue ring-2 ring-white/10 cursor-pointer"></div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 relative">
             {/* Background Glow FX */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
               <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-nexus-blue/5 rounded-full blur-[128px]" />
               <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-nexus-green/5 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<DashboardHome clients={clients} tasks={tasks} />} />
                <Route path="/tasks" element={
                  <TasksPage 
                    tasks={tasks} 
                    clients={clients} 
                    onStatusChange={handleTaskStatusChange} 
                  />
                } />
                <Route path="/clients" element={
                   <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-white">Client Management</h2>
                      <ClientList clients={clients} />
                   </div>
                } />
                <Route path="*" element={<DashboardHome clients={clients} tasks={tasks} />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>

      <AICreator 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        clients={clients}
        onAddTasks={handleAddAITasks}
      />
    </Router>
  );
}

export default App;
