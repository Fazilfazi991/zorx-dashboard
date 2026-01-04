import React, { useState } from 'react';
import { QuarterlyTarget, User, QuarterlySalesData, MonthlyMetricDetail } from '../types';
import { MOCK_Q1_2026_SALES_DATA } from '../constants';
import { 
  Target, TrendingUp, Users, DollarSign, Pencil, X, Save, 
  BarChart3, PieChart, Phone, Mail, Globe, Search, Plus, 
  CheckCircle, Briefcase, Calculator, ArrowRight, Lock, Database, MessageSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Funnel, FunnelChart, LabelList } from 'recharts';

interface CompanyTargetsProps {
  targets?: QuarterlyTarget[]; // Kept for backwards compatibility if needed, but primarily using new data
  onUpdateTarget?: (target: QuarterlyTarget) => void;
  currentUser: User;
  isReadOnly?: boolean;
}

const CompanyTargets: React.FC<CompanyTargetsProps> = ({ currentUser, isReadOnly = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'daily'>('overview');
  const [salesData, setSalesData] = useState<QuarterlySalesData>(MOCK_Q1_2026_SALES_DATA);
  const [activeChannelId, setActiveChannelId] = useState(salesData.channels[0].id);

  // RBAC Logic - Updated Admin List
  const isAdmin = ['Thameem', 'Fazil', 'Ajzal', 'Salman', 'Ayisha'].includes(currentUser.name);
  
  // Permissions (Overridden by isReadOnly)
  // Admins can edit everything. Specific users can edit their channels if not read-only.
  const canUpdateCalls = !isReadOnly && (currentUser.name === 'Salman' || isAdmin);
  const canUpdateEmails = !isReadOnly && (currentUser.name === 'Saleema' || isAdmin);
  const canUpdateScraping = !isReadOnly && (currentUser.name === 'Ajzal' || isAdmin);

  // Daily Tracker State - Calls (Salman)
  const [callStats, setCallStats] = useState({
    made: 0,
    contacts: 0,
    qualified: 0,
    meetings: 0
  });

  // Daily Tracker State - Emails (Saleema)
  const [emailStats, setEmailStats] = useState({
    sent: 0,
    opened: 0,
    replies: 0,
    meetings: 0
  });

  // Daily Tracker State - Sourcing (Ajzal)
  const [sourcingStats, setSourcingStats] = useState({
    scraped: 0, // Email channel metric
    identified: 0 // Indeed channel metric
  });

  // Helper to get total actuals for top cards
  const totalClientsActual = salesData.channels.reduce((acc, ch) => {
    return acc + ch.monthlyData.reduce((mAcc, m) => mAcc + (m.metrics['Clients Closed']?.actual || 0), 0);
  }, 0);

  const currentMonth = 'Jan'; // Hardcoded for Q1 demo

  const handleLogCalls = () => {
    const newData = { ...salesData };
    const indeed = newData.channels.find(c => c.id === 'ch-indeed');
    if (indeed) {
        const jan = indeed.monthlyData.find(m => m.month === 'Jan');
        if (jan) {
            jan.metrics['Cold Calls Made'].actual += callStats.made;
            jan.metrics['Qualified Leads'].actual += callStats.qualified;
            jan.metrics['Meetings Booked'].actual += callStats.meetings;
            // Assuming we might track Contacts separately if data structure allows, 
            // otherwise just logging what we have matching the Mock Data keys
        }
    }
    setSalesData(newData);
    setCallStats({ made: 0, contacts: 0, qualified: 0, meetings: 0 });
    alert('Call stats updated successfully!');
  };

  const handleLogEmails = () => {
    const newData = { ...salesData };
    const email = newData.channels.find(c => c.id === 'ch-email');
    if (email) {
        const jan = email.monthlyData.find(m => m.month === 'Jan');
        if (jan) {
            jan.metrics['Emails Sent'].actual += emailStats.sent;
            jan.metrics['Opened'].actual += emailStats.opened;
            jan.metrics['Replies'].actual += emailStats.replies;
            jan.metrics['Meetings Booked'].actual += emailStats.meetings;
        }
    }
    setSalesData(newData);
    setEmailStats({ sent: 0, opened: 0, replies: 0, meetings: 0 });
    alert('Email stats updated successfully!');
  };

  const handleLogSourcing = () => {
    const newData = { ...salesData };
    
    // Update Email Channel (Scraped)
    const email = newData.channels.find(c => c.id === 'ch-email');
    if (email) {
        const jan = email.monthlyData.find(m => m.month === 'Jan');
        if (jan) {
            jan.metrics['Scraped'].actual += sourcingStats.scraped;
        }
    }

    // Update Indeed Channel (Identified)
    const indeed = newData.channels.find(c => c.id === 'ch-indeed');
    if (indeed) {
        const jan = indeed.monthlyData.find(m => m.month === 'Jan');
        if (jan) {
            jan.metrics['Companies Identified'].actual += sourcingStats.identified;
        }
    }

    setSalesData(newData);
    setSourcingStats({ scraped: 0, identified: 0 });
    alert('Sourcing stats updated successfully!');
  };

  const activeChannelData = salesData.channels.find(c => c.id === activeChannelId);

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="h-6 w-6 text-nexus-greenGlow" />
                Q1 2026 Sales Strategy
             </h2>
             <p className="text-gray-400 text-sm mt-1">Acquiring Recurring Clients • 40K AED MRR Target</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
             <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'overview' ? 'bg-nexus-blue text-black' : 'text-gray-400 hover:text-white'}`}
             >
                Overview
             </button>
             <button 
                onClick={() => setActiveTab('channels')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'channels' ? 'bg-nexus-blue text-black' : 'text-gray-400 hover:text-white'}`}
             >
                Channel Breakdown
             </button>
             <button 
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'daily' ? 'bg-nexus-green text-black' : 'text-gray-400 hover:text-white'}`}
             >
                Daily Tracker
             </button>
          </div>
       </div>

       {/* Top High Level Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <div className="bg-nexus-card border border-white/10 p-5 rounded-xl flex flex-col justify-between">
              <p className="text-gray-400 text-xs font-bold uppercase">Client Target</p>
              <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-bold text-white">{totalClientsActual} <span className="text-base text-gray-500">/ {salesData.overallTargetClients}</span></span>
                  <Users className="h-6 w-6 text-nexus-blueGlow" />
              </div>
              <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                 <div className="bg-nexus-blue h-full" style={{ width: `${(totalClientsActual/salesData.overallTargetClients)*100}%` }}></div>
              </div>
          </div>
          <div className="bg-nexus-card border border-white/10 p-5 rounded-xl flex flex-col justify-between">
              <p className="text-gray-400 text-xs font-bold uppercase">Revenue Target (MRR)</p>
              <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-bold text-white">12K <span className="text-base text-gray-500">AED</span></span>
                  <DollarSign className="h-6 w-6 text-nexus-greenGlow" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: 40K AED (Cumulative)</p>
          </div>
          <div className="bg-nexus-card border border-white/10 p-5 rounded-xl flex flex-col justify-between">
              <p className="text-gray-400 text-xs font-bold uppercase">Total Leads (Q1)</p>
              <div className="flex justify-between items-end mt-2">
                  <span className="text-3xl font-bold text-white">28 <span className="text-base text-gray-500">/ 131</span></span>
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                 <div className="bg-yellow-400 h-full" style={{ width: `${(28/131)*100}%` }}></div>
              </div>
          </div>
          <div className="bg-nexus-card border border-white/10 p-5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-nexus-green/50 transition-all" onClick={() => setActiveTab('daily')}>
               <div className="flex items-center gap-2 text-nexus-greenGlow mb-2">
                   <Plus className="h-4 w-4" />
                   <span className="font-bold text-sm">Quick Add</span>
               </div>
               <p className="text-xs text-gray-400">Log calls, emails, or leads for today.</p>
          </div>
       </div>

       {/* MAIN CONTENT AREA */}
       <div className="flex-1 min-h-0 bg-nexus-card border border-white/10 rounded-xl overflow-hidden flex flex-col">
           
           {/* OVERVIEW TAB */}
           {activeTab === 'overview' && (
               <div className="p-6 overflow-y-auto custom-scrollbar h-full">
                   <h3 className="text-lg font-bold text-white mb-6">Overall Sales Pipeline (Q1 Forecast)</h3>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="bg-white/5 rounded-xl p-6 border border-white/5 h-[400px]">
                           <ResponsiveContainer width="100%" height="100%">
                               <FunnelChart>
                                   <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                                   <Funnel
                                       dataKey="total"
                                       data={salesData.pipeline}
                                       isAnimationActive
                                   >
                                       <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                                       {salesData.pipeline.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#60a5fa', '#a78bfa', '#c084fc', '#f472b6', '#34d399'][index % 6]} />
                                       ))}
                                   </Funnel>
                               </FunnelChart>
                           </ResponsiveContainer>
                       </div>
                       
                       <div className="space-y-4">
                           <h4 className="font-bold text-gray-300 mb-2">Pipeline Metrics</h4>
                           {salesData.pipeline.map((stage, idx) => (
                               <div key={idx} className="flex items-center justify-between p-3 border-b border-white/5">
                                   <div>
                                       <p className="text-sm text-white font-medium">{stage.name}</p>
                                       <p className="text-xs text-gray-500">Conv. Rate: {stage.conversionRate}</p>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-lg font-bold text-nexus-blueGlow">{stage.total}</p>
                                       <div className="flex gap-2 text-[10px] text-gray-600">
                                           <span>J: {stage.jan}</span>
                                           <span>F: {stage.feb}</span>
                                           <span>M: {stage.mar}</span>
                                       </div>
                                   </div>
                               </div>
                           ))}
                           <div className="mt-6 p-4 bg-nexus-blue/5 border border-nexus-blue/20 rounded-lg">
                               <p className="text-sm text-nexus-blueGlow">
                                   <strong>Success Milestone (Jan):</strong> 3 Clients Closed = 12K AED MRR.
                                   <br />Current focus: Driving 28 total leads/contacts.
                               </p>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* CHANNELS TAB */}
           {activeTab === 'channels' && (
               <div className="flex flex-col h-full">
                   {/* Channel Selector */}
                   <div className="flex border-b border-white/10 shrink-0">
                       {salesData.channels.map(channel => (
                           <button
                              key={channel.id}
                              onClick={() => setActiveChannelId(channel.id)}
                              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 
                                ${activeChannelId === channel.id 
                                    ? 'border-nexus-blue text-white bg-white/5' 
                                    : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                           >
                               {channel.name.includes('Google') && <Globe className="h-4 w-4" />}
                               {channel.name.includes('Indeed') && <Search className="h-4 w-4" />}
                               {channel.name.includes('Referrals') && <Users className="h-4 w-4" />}
                               {channel.name.includes('Email') && <Mail className="h-4 w-4" />}
                               {channel.name}
                           </button>
                       ))}
                   </div>

                   {/* Channel Details */}
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                       <div className="flex justify-between items-center mb-6">
                           <div>
                               <h3 className="text-xl font-bold text-white">{activeChannelData?.name} Strategy</h3>
                               <p className="text-xs text-gray-400">Monthly breakdown of targets and actuals</p>
                           </div>
                           <div className="flex gap-2">
                               {activeChannelData?.kpis.map((kpi, i) => (
                                   <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300 uppercase font-bold">
                                       {kpi}
                                   </span>
                               ))}
                           </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {activeChannelData?.monthlyData.map((monthData) => (
                               <div key={monthData.month} className="bg-black/30 border border-white/5 rounded-xl p-4">
                                   <h4 className={`text-lg font-bold mb-4 flex justify-between ${monthData.month === currentMonth ? 'text-nexus-blueGlow' : 'text-gray-500'}`}>
                                       {monthData.month}
                                       {monthData.month === currentMonth && <span className="text-[10px] bg-nexus-blue/20 px-2 py-0.5 rounded border border-nexus-blue/30 uppercase tracking-wider">Current</span>}
                                   </h4>
                                   <div className="space-y-4">
                                       {Object.entries(monthData.metrics).map(([metricName, rawData]) => {
                                           const data = rawData as MonthlyMetricDetail;
                                           const progress = data.target > 0 ? Math.min(100, (data.actual / data.target) * 100) : 0;
                                           return (
                                               <div key={metricName}>
                                                   <div className="flex justify-between text-xs mb-1">
                                                       <span className="text-gray-400">{metricName}</span>
                                                       <span className="text-white font-mono">
                                                           {data.actual.toLocaleString()} / {data.target.toLocaleString()}
                                                           {data.unit === '%' ? '%' : ''}
                                                       </span>
                                                   </div>
                                                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                       <div 
                                                         className={`h-full ${progress >= 100 ? 'bg-nexus-greenGlow' : 'bg-nexus-blue'}`} 
                                                         style={{ width: `${progress}%` }}
                                                       />
                                                   </div>
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {/* DAILY TRACKER TAB */}
           {activeTab === 'daily' && (
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                   <div className="text-center mb-8">
                       <h3 className="text-2xl font-bold text-white">Daily Activity Tracker</h3>
                       <p className="text-gray-400">Log activity for your specific channel. Data syncs with Q1 Strategy.</p>
                       {isReadOnly && (
                           <div className="mt-2 text-xs text-red-400 border border-red-500/30 bg-red-500/10 inline-block px-3 py-1 rounded-full">
                               <Lock className="h-3 w-3 inline-block mr-1" />
                               Admin Only Mode
                           </div>
                       )}
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       
                       {/* 1. SOURCING TRACKER (AJZAL) */}
                       <div className={`rounded-xl border flex flex-col ${canUpdateScraping ? 'bg-nexus-card border-white/10' : 'bg-white/5 border-white/5 opacity-60'}`}>
                           <div className="p-4 border-b border-white/10 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                       <Database className="h-5 w-5" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-white text-sm">Data Sourcing</h4>
                                       <p className="text-[10px] text-gray-500">Ajzal</p>
                                   </div>
                               </div>
                               {!canUpdateScraping && <Lock className="h-4 w-4 text-gray-500" />}
                           </div>
                           <div className="p-4 space-y-4 flex-1">
                               <div className="space-y-1">
                                   <label className="text-xs text-gray-500 font-semibold uppercase">Job Posts Scraped</label>
                                   <input 
                                     type="number"
                                     value={sourcingStats.scraped}
                                     onChange={e => setSourcingStats({...sourcingStats, scraped: Number(e.target.value)})}
                                     disabled={!canUpdateScraping}
                                     className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                   />
                               </div>
                               <div className="space-y-1">
                                   <label className="text-xs text-gray-500 font-semibold uppercase">Companies Identified</label>
                                   <input 
                                     type="number"
                                     value={sourcingStats.identified}
                                     onChange={e => setSourcingStats({...sourcingStats, identified: Number(e.target.value)})}
                                     disabled={!canUpdateScraping}
                                     className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                   />
                               </div>
                           </div>
                           <div className="p-4 pt-0">
                               <button 
                                 onClick={handleLogSourcing}
                                 disabled={!canUpdateScraping}
                                 className="w-full py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-bold text-sm hover:bg-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                   Log Sourcing Data
                               </button>
                           </div>
                       </div>

                       {/* 2. COLD CALLING TRACKER (SALMAN) */}
                       <div className={`rounded-xl border flex flex-col ${canUpdateCalls ? 'bg-nexus-card border-white/10' : 'bg-white/5 border-white/5 opacity-60'}`}>
                           <div className="p-4 border-b border-white/10 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-nexus-blue/10 rounded-lg text-nexus-blueGlow">
                                       <Phone className="h-5 w-5" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-white text-sm">Cold Calling</h4>
                                       <p className="text-[10px] text-gray-500">Salman</p>
                                   </div>
                               </div>
                               {!canUpdateCalls && <Lock className="h-4 w-4 text-gray-500" />}
                           </div>
                           <div className="p-4 space-y-4 flex-1">
                               <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Calls Made</label>
                                       <input 
                                         type="number"
                                         value={callStats.made}
                                         onChange={e => setCallStats({...callStats, made: Number(e.target.value)})}
                                         disabled={!canUpdateCalls}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Contacts (DM)</label>
                                       <input 
                                         type="number"
                                         value={callStats.contacts}
                                         onChange={e => setCallStats({...callStats, contacts: Number(e.target.value)})}
                                         disabled={!canUpdateCalls}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Qualified</label>
                                       <input 
                                         type="number"
                                         value={callStats.qualified}
                                         onChange={e => setCallStats({...callStats, qualified: Number(e.target.value)})}
                                         disabled={!canUpdateCalls}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Meetings</label>
                                       <input 
                                         type="number"
                                         value={callStats.meetings}
                                         onChange={e => setCallStats({...callStats, meetings: Number(e.target.value)})}
                                         disabled={!canUpdateCalls}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                               </div>
                           </div>
                           <div className="p-4 pt-0">
                               <button 
                                 onClick={handleLogCalls}
                                 disabled={!canUpdateCalls}
                                 className="w-full py-2 bg-nexus-blue/10 text-nexus-blueGlow border border-nexus-blue/20 rounded font-bold text-sm hover:bg-nexus-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                   Log Call Stats
                               </button>
                           </div>
                       </div>

                       {/* 3. EMAIL MARKETING TRACKER (SALEEMA) */}
                       <div className={`rounded-xl border flex flex-col ${canUpdateEmails ? 'bg-nexus-card border-white/10' : 'bg-white/5 border-white/5 opacity-60'}`}>
                           <div className="p-4 border-b border-white/10 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                   <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                       <Mail className="h-5 w-5" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-white text-sm">Email Marketing</h4>
                                       <p className="text-[10px] text-gray-500">Saleema</p>
                                   </div>
                               </div>
                               {!canUpdateEmails && <Lock className="h-4 w-4 text-gray-500" />}
                           </div>
                           <div className="p-4 space-y-4 flex-1">
                               <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Emails Sent</label>
                                       <input 
                                         type="number"
                                         value={emailStats.sent}
                                         onChange={e => setEmailStats({...emailStats, sent: Number(e.target.value)})}
                                         disabled={!canUpdateEmails}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Opened</label>
                                       <input 
                                         type="number"
                                         value={emailStats.opened}
                                         onChange={e => setEmailStats({...emailStats, opened: Number(e.target.value)})}
                                         disabled={!canUpdateEmails}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Replies</label>
                                       <input 
                                         type="number"
                                         value={emailStats.replies}
                                         onChange={e => setEmailStats({...emailStats, replies: Number(e.target.value)})}
                                         disabled={!canUpdateEmails}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                                   <div className="space-y-1">
                                       <label className="text-[10px] text-gray-500 font-semibold uppercase">Meetings</label>
                                       <input 
                                         type="number"
                                         value={emailStats.meetings}
                                         onChange={e => setEmailStats({...emailStats, meetings: Number(e.target.value)})}
                                         disabled={!canUpdateEmails}
                                         className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-nexus-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                       />
                                   </div>
                               </div>
                           </div>
                           <div className="p-4 pt-0">
                               <button 
                                 onClick={handleLogEmails}
                                 disabled={!canUpdateEmails}
                                 className="w-full py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-bold text-sm hover:bg-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                   Log Email Stats
                               </button>
                           </div>
                       </div>

                   </div>
               </div>
           )}

       </div>
    </div>
  );
};

export default CompanyTargets;