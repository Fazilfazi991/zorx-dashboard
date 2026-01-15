
import React, { useState, useEffect } from 'react';
import { User, LeaveRequest, AttendanceRecord, Holiday, OvertimeRecord } from '../types';
import { 
  Users, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, 
  Plus, Search, Briefcase, Sun, CheckSquare, FileText, UserPlus, Mail, Lock, X, Timer, LogOut, Trash2, History, Filter
} from 'lucide-react';

interface HRManagementProps {
  currentUser: User;
  users: User[];
  leaves: LeaveRequest[];
  attendance: AttendanceRecord[];
  holidays: Holiday[];
  overtimeRecords?: OvertimeRecord[];
  onApplyLeave: (leave: LeaveRequest) => void;
  onUpdateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected') => void;
  onMarkAttendance: (record: AttendanceRecord) => void;
  onAddHoliday: (holiday: Holiday) => void;
  onAddUser: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onAddOvertime?: (record: OvertimeRecord) => void;
  isAdmin: boolean;
  isHR: boolean;
}

type HRTab = 'staff' | 'leave' | 'attendance' | 'calendar' | 'overtime';

const HRManagement: React.FC<HRManagementProps> = ({ 
  currentUser, users, leaves, attendance, holidays, overtimeRecords = [],
  onApplyLeave, onUpdateLeaveStatus, onMarkAttendance, onAddHoliday, onAddUser, onDeleteUser, onAddOvertime,
  isAdmin, isHR
}) => {
  const [activeTab, setActiveTab] = useState<HRTab>('staff');
  
  // --- Leave Form State ---
  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // --- Holiday Form State ---
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  // --- Add Staff State ---
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');

  // --- Overtime Form State ---
  const [otUser, setOtUser] = useState('');
  const [otDate, setOtDate] = useState('');
  const [otHours, setOtHours] = useState(0);
  const [otMins, setOtMins] = useState(0);
  const [otDesc, setOtDesc] = useState('');

  // --- Attendance Filter State ---
  const [attendanceFilter, setAttendanceFilter] = useState('All');

  // State to track "today" and auto-update at midnight
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Check every minute if the date has changed (Midnight Reset)
    const interval = setInterval(() => {
        const current = new Date().toISOString().split('T')[0];
        if (current !== today) {
            setToday(current);
        }
    }, 60000);
    return () => clearInterval(interval);
  }, [today]);

  const myRecord = attendance.find(r => r.userId === currentUser.id && r.date === today);
  const hasCheckedIn = !!myRecord;
  const hasCheckedOut = !!myRecord?.checkOutTime;

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) return;

    const newLeave: LeaveRequest = {
      id: `lr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      type: leaveType as any,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
      status: 'Pending'
    };

    onApplyLeave(newLeave);
    setLeaveStart('');
    setLeaveEnd('');
    setLeaveReason('');
  };

  const handleCheckInOut = () => {
    if (hasCheckedOut) return;

    // Get current time in India Standard Time
    const now = new Date();
    // Options for IST time string: "HH:MM:SS" (24-hour format)
    const istTime = now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: false, hour: '2-digit', minute: '2-digit' });
    const istHour = parseInt(istTime.split(':')[0], 10);
    const istMinute = parseInt(istTime.split(':')[1], 10);

    if (hasCheckedIn) {
        // --- CHECK OUT LOGIC ---
        if (!myRecord) return;
        
        onMarkAttendance({
            ...myRecord,
            checkOutTime: istTime,
            // Simple calculation for display (could be more robust with full Date objects)
            totalHours: "Calculated" 
        });

    } else {
        // --- CHECK IN LOGIC ---
        // Restriction: Cannot check in before 10 AM
        if (istHour < 10) {
            alert("Office hours start at 10:00 AM. You cannot check in yet.");
            return;
        }

        // Normal hours: 10am to 6pm IST.
        // Late if strictly after 10:00 AM.
        let status: 'Present' | 'Late' = 'Present';
        if (istHour > 10 || (istHour === 10 && istMinute > 0)) {
            status = 'Late';
        }

        const record: AttendanceRecord = {
            id: `att-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            date: today,
            checkInTime: istTime,
            status: status
        };
        onMarkAttendance(record);
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if(!isAdmin) return;
    const newHoliday: Holiday = {
        id: `h-${Date.now()}`,
        name: holidayName,
        date: holidayDate,
        type: 'Company'
    };
    onAddHoliday(newHoliday);
    setHolidayName('');
    setHolidayDate('');
  };

  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newUser: User = {
        id: `u-${Date.now()}`,
        name: newStaffName,
        email: newStaffEmail,
        password: '1234', // Default staff password
    };
    
    onAddUser(newUser);
    setIsAddStaffModalOpen(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  const handleAddOvertimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddOvertime || !otUser || !otDate || !otDesc) return;
    if (otHours === 0 && otMins === 0) return;

    const selectedUser = users.find(u => u.id === otUser);
    if (!selectedUser) return;

    const record: OvertimeRecord = {
        id: `ot-${Date.now()}`,
        userId: selectedUser.id,
        userName: selectedUser.name,
        date: otDate,
        durationMinutes: (otHours * 60) + otMins,
        workDescription: otDesc,
        loggedBy: currentUser.name
    };

    onAddOvertime(record);
    setOtUser('');
    setOtDate('');
    setOtHours(0);
    setOtMins(0);
    setOtDesc('');
  };

  // Filter logic
  const filteredUsers = attendanceFilter === 'All' 
    ? users 
    : users.filter(u => u.id === attendanceFilter);

  const filteredHistory = attendanceFilter === 'All' 
    ? attendance 
    : attendance.filter(a => a.userId === attendanceFilter);

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
         <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
               <Briefcase className="h-6 w-6 text-nexus-blueGlow" />
               HR & Staff Management
            </h2>
            <p className="text-gray-400 text-sm mt-1">Manage team, leaves, and daily operations.</p>
         </div>
         {isAdmin && (
             <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded border border-purple-500/30">
                 Admin Access ({currentUser.name})
             </span>
         )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 shrink-0 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('staff')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'staff' ? 'border-nexus-blue text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
           <Users className="h-4 w-4 inline-block mr-2" /> Staff List
        </button>
        <button 
          onClick={() => setActiveTab('leave')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'leave' ? 'border-nexus-blue text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
           <FileText className="h-4 w-4 inline-block mr-2" /> Leave Requests
           {isAdmin && leaves.filter(l => l.status === 'Pending').length > 0 && (
               <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                   {leaves.filter(l => l.status === 'Pending').length}
               </span>
           )}
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'attendance' ? 'border-nexus-blue text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
           <Clock className="h-4 w-4 inline-block mr-2" /> Attendance
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'calendar' ? 'border-nexus-blue text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
           <CalendarIcon className="h-4 w-4 inline-block mr-2" /> Calendar
        </button>
        <button 
          onClick={() => setActiveTab('overtime')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'overtime' ? 'border-orange-400 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
        >
           <Timer className="h-4 w-4 inline-block mr-2" /> Overtime
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          
          {/* STAFF TAB */}
          {activeTab === 'staff' && (
              <div className="space-y-4">
                  {(isAdmin || isHR) && (
                      <div className="flex justify-end">
                          <button 
                            onClick={() => setIsAddStaffModalOpen(true)}
                            className="flex items-center gap-2 bg-nexus-blue text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-nexus-blueGlow transition-colors"
                          >
                              <UserPlus className="h-4 w-4" /> Add Staff
                          </button>
                      </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users.map(user => {
                          const userStatus = attendance.find(a => a.userId === user.id && a.date === today);
                          const isOnLeave = leaves.some(l => l.userId === user.id && l.status === 'Approved' && today >= l.startDate && today <= l.endDate);

                          return (
                            <div key={user.id} className="bg-nexus-card border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-nexus-blue/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-white border border-white/5">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{user.name}</h3>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            {isOnLeave ? (
                                                <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">On Leave</span>
                                            ) : userStatus ? (
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${userStatus.status === 'Late' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                                    Checked In ({userStatus.checkInTime})
                                                </span>
                                            ) : (
                                                <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded">Not Checked In</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && onDeleteUser && (
                                    <button 
                                        onClick={() => onDeleteUser(user.id)}
                                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete Staff"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                          );
                      })}
                  </div>
              </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
              <div className="space-y-6">
                  {/* Filter and Status */}
                  <div className="flex flex-col md:flex-row gap-4">
                     {/* My Status */}
                     <div className="flex-1 bg-gradient-to-r from-nexus-blue/10 to-purple-500/10 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Today's Presence</h3>
                            <p className="text-gray-400 text-sm">{new Date().toDateString()}</p>
                            <p className="text-xs text-nexus-blueGlow mt-1">Standard Hours: 10:00 AM - 06:00 PM IST</p>
                        </div>
                        
                        {!hasCheckedOut && (
                            <button 
                                onClick={handleCheckInOut}
                                className={`px-6 py-3 rounded-lg font-bold text-lg flex items-center gap-2 transition-all shadow-lg ${
                                    hasCheckedIn 
                                    ? 'bg-nexus-card border border-red-500/30 text-red-400 hover:bg-red-500/10' 
                                    : 'bg-nexus-blue text-black hover:bg-nexus-blueGlow hover:scale-105'
                                }`}
                            >
                                {hasCheckedIn ? (
                                    <><LogOut className="h-6 w-6" /> Check Out</>
                                ) : (
                                    <><Clock className="h-6 w-6" /> Check In</>
                                )}
                            </button>
                        )}
                        {hasCheckedOut && (
                            <div className="px-6 py-3 rounded-lg font-bold text-lg flex items-center gap-2 bg-nexus-green/10 text-nexus-greenGlow border border-nexus-green/20">
                                <CheckCircle className="h-6 w-6" /> Day Completed
                            </div>
                        )}
                     </div>

                     {/* Staff Filter (Admin/HR/Viewer) */}
                     <div className="md:w-64 bg-nexus-card border border-white/10 rounded-xl p-6 flex flex-col justify-center">
                         <label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                             <Filter className="h-3 w-3" /> Filter Staff
                         </label>
                         <select 
                             value={attendanceFilter}
                             onChange={(e) => setAttendanceFilter(e.target.value)}
                             className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-nexus-blue focus:outline-none cursor-pointer"
                         >
                             <option value="All">All Staff</option>
                             {users.map(u => (
                                 <option key={u.id} value={u.id}>{u.name}</option>
                             ))}
                         </select>
                     </div>
                  </div>

                  {/* Daily Report */}
                  <div className="bg-nexus-card border border-white/10 rounded-xl overflow-hidden">
                      <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                          <h3 className="font-bold text-white">Daily Presence Report</h3>
                          <span className="text-xs text-gray-500">
                             {attendanceFilter === 'All' ? 'All Staff' : 'Filtered'} • {attendance.filter(a => a.date === today && (attendanceFilter === 'All' || a.userId === attendanceFilter)).length} Checked In
                          </span>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-gray-400">
                              <thead className="bg-white/5 text-xs uppercase text-gray-200">
                                  <tr>
                                      <th className="px-6 py-3">Staff</th>
                                      <th className="px-6 py-3">Status</th>
                                      <th className="px-6 py-3">Check In</th>
                                      <th className="px-6 py-3">Check Out</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                  {filteredUsers.map(user => {
                                      const record = attendance.find(a => a.userId === user.id && a.date === today);
                                      const isOnLeave = leaves.some(l => l.userId === user.id && l.status === 'Approved' && today >= l.startDate && today <= l.endDate);
                                      
                                      return (
                                          <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                              <td className="px-6 py-3 font-medium text-white flex items-center gap-3">
                                                  <div className={`h-2 w-2 rounded-full ${isOnLeave ? 'bg-yellow-400' : record ? (record.checkOutTime ? 'bg-gray-500' : 'bg-nexus-greenGlow') : 'bg-red-500'}`} />
                                                  {user.name}
                                              </td>
                                              <td className="px-6 py-3">
                                                  {isOnLeave ? (
                                                      <span className="text-yellow-400">On Leave</span>
                                                  ) : record ? (
                                                      <span className={`${record.status === 'Late' ? 'text-orange-400' : 'text-nexus-greenGlow'}`}>{record.status}</span>
                                                  ) : (
                                                      <span className="text-gray-600 italic">Absent</span>
                                                  )}
                                              </td>
                                              <td className="px-6 py-3 font-mono text-xs">{record?.checkInTime || '-'}</td>
                                              <td className="px-6 py-3 font-mono text-xs">{record?.checkOutTime || '-'}</td>
                                          </tr>
                                      );
                                  })}
                                  {filteredUsers.length === 0 && (
                                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No staff found matching filter.</td></tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* History View */}
                  {(isAdmin || isHR) && (
                      <div className="bg-nexus-card border border-white/10 rounded-xl overflow-hidden mt-8">
                          <div className="px-6 py-4 bg-white/5 border-b border-white/5">
                              <h3 className="font-bold text-white flex items-center gap-2">
                                  <History className="h-4 w-4" /> Full Attendance History
                              </h3>
                          </div>
                          <div className="max-h-60 overflow-y-auto custom-scrollbar">
                              <table className="w-full text-left text-sm text-gray-400">
                                  <thead className="bg-white/5 text-xs uppercase text-gray-200 sticky top-0">
                                      <tr>
                                          <th className="px-6 py-3">Date</th>
                                          <th className="px-6 py-3">Name</th>
                                          <th className="px-6 py-3">In</th>
                                          <th className="px-6 py-3">Out</th>
                                          <th className="px-6 py-3">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5">
                                      {[...filteredHistory].reverse().map(record => (
                                          <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                              <td className="px-6 py-2">{record.date}</td>
                                              <td className="px-6 py-2 text-white">{record.userName}</td>
                                              <td className="px-6 py-2 font-mono text-xs">{record.checkInTime}</td>
                                              <td className="px-6 py-2 font-mono text-xs">{record.checkOutTime || '-'}</td>
                                              <td className="px-6 py-2">
                                                  <span className={`text-xs px-2 py-0.5 rounded border ${record.status === 'Late' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'}`}>
                                                      {record.status}
                                                  </span>
                                              </td>
                                          </tr>
                                      ))}
                                      {filteredHistory.length === 0 && (
                                          <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No history records found.</td></tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* ... (Rest of tabs remain unchanged) ... */}
          {activeTab === 'leave' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Application Form */}
                  <div className="lg:col-span-1 space-y-6">
                      <div className="bg-nexus-card border border-white/10 rounded-xl p-6">
                          <h3 className="text-lg font-bold text-white mb-4">Apply for Leave</h3>
                          <form onSubmit={handleApplyLeave} className="space-y-4">
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold">Leave Type</label>
                                  <select 
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-nexus-blue focus:outline-none mt-1"
                                  >
                                      <option>Sick Leave</option>
                                      <option>Casual Leave</option>
                                      <option>Emergency</option>
                                      <option>Vacation</option>
                                  </select>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                  <div>
                                      <label className="text-xs text-gray-500 uppercase font-bold">From</label>
                                      <input 
                                        type="date" 
                                        value={leaveStart}
                                        onChange={(e) => setLeaveStart(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-nexus-blue focus:outline-none mt-1 [color-scheme:dark]"
                                        required
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-500 uppercase font-bold">To</label>
                                      <input 
                                        type="date" 
                                        value={leaveEnd}
                                        onChange={(e) => setLeaveEnd(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-nexus-blue focus:outline-none mt-1 [color-scheme:dark]"
                                        required
                                      />
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold">Reason</label>
                                  <textarea 
                                    value={leaveReason}
                                    onChange={(e) => setLeaveReason(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-nexus-blue focus:outline-none mt-1 h-20 resize-none"
                                    placeholder="Brief reason for leave..."
                                    required
                                  />
                              </div>
                              <button type="submit" className="w-full py-2 bg-nexus-blue text-black font-bold rounded-lg hover:bg-nexus-blueGlow transition-colors">
                                  Submit Request
                              </button>
                          </form>
                      </div>

                      {/* My Leave History */}
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                           <h4 className="text-sm font-bold text-gray-300 mb-3">My Leave History</h4>
                           <div className="space-y-3">
                               {leaves.filter(l => l.userId === currentUser.id).map(leave => (
                                   <div key={leave.id} className="p-3 bg-nexus-card border border-white/10 rounded-lg">
                                       <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-white">{leave.type}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                                                leave.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                leave.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                                {leave.status}
                                            </span>
                                       </div>
                                       <p className="text-xs text-gray-500 mt-1">{leave.startDate} to {leave.endDate}</p>
                                   </div>
                               ))}
                               {leaves.filter(l => l.userId === currentUser.id).length === 0 && (
                                   <p className="text-xs text-gray-500 italic">No records found.</p>
                               )}
                           </div>
                      </div>
                  </div>

                  {/* Right: Approvals (Admin Only) */}
                  <div className="lg:col-span-2">
                       <h3 className="text-lg font-bold text-white mb-4">Leave Requests Overview</h3>
                       {(isAdmin || isHR) ? (
                           <div className="space-y-4">
                               {leaves.slice().reverse().map(leave => (
                                   <div key={leave.id} className="bg-nexus-card border border-white/10 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start">
                                       <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-300">
                                                {leave.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    {leave.userName} 
                                                    <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded">{leave.type}</span>
                                                </h4>
                                                <p className="text-sm text-gray-300 mt-1">Reason: <span className="italic text-gray-400">{leave.reason}</span></p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {leave.startDate} — {leave.endDate}
                                                </div>
                                            </div>
                                       </div>
                                       
                                       {leave.status === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button 
                                                  onClick={() => onUpdateLeaveStatus(leave.id, 'Rejected')}
                                                  className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium flex items-center gap-1"
                                                >
                                                    <XCircle className="h-4 w-4" /> Reject
                                                </button>
                                                <button 
                                                  onClick={() => onUpdateLeaveStatus(leave.id, 'Approved')}
                                                  className="px-3 py-1.5 rounded-lg bg-nexus-green/20 border border-nexus-green/30 text-nexus-greenGlow hover:bg-nexus-green/30 transition-colors text-sm font-medium flex items-center gap-1"
                                                >
                                                    <CheckCircle className="h-4 w-4" /> Approve
                                                </button>
                                            </div>
                                       ) : (
                                           <div className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                                               leave.status === 'Approved' ? 'border-nexus-green/30 text-nexus-greenGlow bg-nexus-green/5' : 'border-red-500/30 text-red-400 bg-red-500/5'
                                           }`}>
                                               {leave.status} {leave.approvedBy ? `by ${leave.approvedBy}` : ''}
                                           </div>
                                       )}
                                   </div>
                               ))}
                           </div>
                       ) : (
                           <div className="p-10 border border-dashed border-white/10 rounded-xl text-center text-gray-500">
                               <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
                               <p>Only Admin or HR can view all requests.</p>
                           </div>
                       )}
                  </div>
              </div>
          )}

          {activeTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-white">Upcoming Events & Leaves</h3>
                          {(isAdmin || isHR) && (
                              <span className="text-xs text-nexus-blueGlow bg-nexus-blue/10 px-2 py-1 rounded">Admin Mode</span>
                          )}
                      </div>

                      <div className="bg-nexus-card border border-white/10 rounded-xl overflow-hidden">
                          {/* Holidays */}
                          <div className="px-4 py-2 bg-white/5 text-xs font-bold uppercase text-gray-500">Holidays</div>
                          {holidays.sort((a,b) => a.date.localeCompare(b.date)).map(h => (
                              <div key={h.id} className="p-4 border-b border-white/5 flex justify-between items-center group">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-yellow-500/10 rounded text-yellow-500">
                                          <Sun className="h-5 w-5" />
                                      </div>
                                      <div>
                                          <p className="font-bold text-white">{h.name}</p>
                                          <p className="text-xs text-gray-500">{h.type} Holiday</p>
                                      </div>
                                  </div>
                                  <div className="text-sm text-gray-400 font-mono">{h.date}</div>
                              </div>
                          ))}

                          {/* Leaves */}
                          <div className="px-4 py-2 bg-white/5 text-xs font-bold uppercase text-gray-500 border-t border-white/10">Approved Leaves</div>
                          {leaves.filter(l => l.status === 'Approved').map(l => (
                              <div key={l.id} className="p-4 border-b border-white/5 flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-purple-500/10 rounded text-purple-400">
                                          <Briefcase className="h-5 w-5" />
                                      </div>
                                      <div>
                                          <p className="font-bold text-white">{l.userName}</p>
                                          <p className="text-xs text-gray-500">{l.type}</p>
                                      </div>
                                  </div>
                                  <div className="text-sm text-gray-400 font-mono text-right">
                                      <div>{l.startDate}</div>
                                      <div className="text-[10px]">to {l.endDate}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Add Holiday (Admin) */}
                  <div className="space-y-6">
                      {(isAdmin || isHR) ? (
                        <div className="bg-nexus-card border border-white/10 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4">Add Holiday</h3>
                            <form onSubmit={handleAddHoliday} className="space-y-3">
                                <input 
                                  type="text" 
                                  placeholder="Holiday Name"
                                  value={holidayName}
                                  onChange={e => setHolidayName(e.target.value)}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-nexus-blue focus:outline-none"
                                  required
                                />
                                <input 
                                  type="date" 
                                  value={holidayDate}
                                  onChange={e => setHolidayDate(e.target.value)}
                                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-nexus-blue focus:outline-none [color-scheme:dark]"
                                  required
                                />
                                <button className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="h-4 w-4" /> Add to Calendar
                                </button>
                            </form>
                        </div>
                      ) : (
                          <div className="bg-white/5 rounded-xl p-6 text-center text-gray-500 text-sm">
                              You do not have permission to manage the holiday calendar.
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'overtime' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Application Form (Restricted to Jefla/Admins) */}
                  <div className="lg:col-span-1 space-y-6">
                      {(isAdmin || isHR) ? (
                          <div className="bg-nexus-card border border-white/10 rounded-xl p-6">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                  <Timer className="h-5 w-5 text-orange-400" />
                                  Log Overtime
                              </h3>
                              <form onSubmit={handleAddOvertimeSubmit} className="space-y-4">
                                  <div>
                                      <label className="text-xs text-gray-500 uppercase font-bold">Staff Member</label>
                                      <select 
                                        value={otUser}
                                        onChange={(e) => setOtUser(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-orange-400 focus:outline-none mt-1"
                                        required
                                      >
                                          <option value="">Select Staff...</option>
                                          {users.map(u => (
                                              <option key={u.id} value={u.id}>{u.name}</option>
                                          ))}
                                      </select>
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-500 uppercase font-bold">Date</label>
                                      <input 
                                        type="date" 
                                        value={otDate}
                                        onChange={(e) => setOtDate(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-orange-400 focus:outline-none mt-1 [color-scheme:dark]"
                                        required
                                      />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div>
                                          <label className="text-xs text-gray-500 uppercase font-bold">Hours</label>
                                          <input 
                                            type="number"
                                            min="0"
                                            value={otHours}
                                            onChange={(e) => setOtHours(Number(e.target.value))}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-orange-400 focus:outline-none mt-1"
                                          />
                                      </div>
                                      <div>
                                          <label className="text-xs text-gray-500 uppercase font-bold">Minutes</label>
                                          <input 
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={otMins}
                                            onChange={(e) => setOtMins(Number(e.target.value))}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-orange-400 focus:outline-none mt-1"
                                          />
                                      </div>
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-500 uppercase font-bold">Work Description</label>
                                      <textarea 
                                        value={otDesc}
                                        onChange={(e) => setOtDesc(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-orange-400 focus:outline-none mt-1 h-20 resize-none"
                                        placeholder="What work was done?"
                                        required
                                      />
                                  </div>
                                  <button type="submit" className="w-full py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors">
                                      Add Record
                                  </button>
                              </form>
                          </div>
                      ) : (
                          <div className="bg-white/5 rounded-xl p-6 text-center text-gray-500 text-sm border border-white/10">
                              <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>Only HR (Jefla) can add overtime records.</p>
                          </div>
                      )}
                  </div>

                  {/* Right: Overtime History List */}
                  <div className="lg:col-span-2">
                       <h3 className="text-lg font-bold text-white mb-4">Overtime History</h3>
                       <div className="bg-nexus-card border border-white/10 rounded-xl overflow-hidden">
                           <div className="overflow-x-auto">
                               <table className="w-full text-left text-sm text-gray-400">
                                   <thead className="bg-white/5 text-xs uppercase text-gray-200">
                                       <tr>
                                           <th className="px-4 py-3">Staff</th>
                                           <th className="px-4 py-3">Date</th>
                                           <th className="px-4 py-3">Duration</th>
                                           <th className="px-4 py-3">Work Done</th>
                                           <th className="px-4 py-3 text-right">Logged By</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-white/5">
                                       {overtimeRecords.slice().reverse().map(record => {
                                           const hrs = Math.floor(record.durationMinutes / 60);
                                           const mins = record.durationMinutes % 60;
                                           return (
                                               <tr key={record.id} className="hover:bg-white/5 transition-colors">
                                                   <td className="px-4 py-3 font-bold text-white">{record.userName}</td>
                                                   <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                                                   <td className="px-4 py-3">
                                                       <span className="bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 text-xs font-mono">
                                                           {hrs}h {mins}m
                                                       </span>
                                                   </td>
                                                   <td className="px-4 py-3 max-w-xs truncate" title={record.workDescription}>
                                                       {record.workDescription}
                                                   </td>
                                                   <td className="px-4 py-3 text-right text-xs opacity-70">
                                                       {record.loggedBy}
                                                   </td>
                                               </tr>
                                           );
                                       })}
                                       {overtimeRecords.length === 0 && (
                                           <tr>
                                               <td colSpan={5} className="px-4 py-8 text-center text-gray-500 italic">
                                                   No overtime records found.
                                               </td>
                                           </tr>
                                       )}
                                   </tbody>
                               </table>
                           </div>
                       </div>
                  </div>
              </div>
          )}

          {/* ADD STAFF MODAL */}
          {isAddStaffModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="bg-nexus-card border border-white/10 rounded-xl w-full max-w-md shadow-2xl">
                      <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                          <h3 className="text-xl font-bold text-white">Add New Staff Member</h3>
                          <button onClick={() => setIsAddStaffModalOpen(false)} className="text-gray-400 hover:text-white">
                              <X className="h-5 w-5"/>
                          </button>
                      </div>
                      <form onSubmit={handleAddStaffSubmit} className="p-6 space-y-4">
                          <div>
                              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Full Name</label>
                              <div className="relative">
                                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <input 
                                    value={newStaffName}
                                    onChange={e => setNewStaffName(e.target.value)}
                                    placeholder="e.g. Jane Doe"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 pl-9 text-white focus:border-nexus-blue focus:outline-none"
                                    required
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Email Address</label>
                              <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <input 
                                    type="email"
                                    value={newStaffEmail}
                                    onChange={e => setNewStaffEmail(e.target.value)}
                                    placeholder="jane@zorx.agency"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 pl-9 text-white focus:border-nexus-blue focus:outline-none"
                                    required
                                  />
                              </div>
                          </div>
                          <div className="p-3 bg-nexus-blue/10 border border-nexus-blue/20 rounded-lg flex items-start gap-2">
                              <Lock className="h-4 w-4 text-nexus-blueGlow mt-0.5" />
                              <div>
                                  <p className="text-xs text-nexus-blueGlow font-bold">Default Password</p>
                                  <p className="text-[10px] text-gray-400">New staff members will have their password set to <span className="text-white font-mono">1234</span> by default. They can change it in settings.</p>
                              </div>
                          </div>
                          <div className="pt-2 flex justify-end gap-3">
                              <button type="button" onClick={() => setIsAddStaffModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium">Cancel</button>
                              <button type="submit" className="px-6 py-2 bg-nexus-blue text-black font-bold rounded-lg hover:bg-nexus-blueGlow transition-all text-sm">Add Staff</button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default HRManagement;
