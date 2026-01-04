
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUserId) {
      setError('Please select a team member.');
      return;
    }

    const user = users.find(u => u.id === selectedUserId);
    
    if (!user) {
      setError('User not found.');
      return;
    }

    if (password !== user.password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    onLogin(user);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-nexus-black relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-nexus-blue/10 rounded-full blur-[150px]" />
       <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-nexus-green/10 rounded-full blur-[150px]" />
       
       <div className="w-full max-w-md bg-nexus-card border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden backdrop-blur-md p-8 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
             <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                <img 
                    src="https://zorxmedia.com/wp-content/uploads/2025/12/logo-1-scaled-e1766209436341.png"
                    alt="Zorx Logo"
                    className="h-10 w-auto object-contain"
                />
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
             <p className="text-sm text-gray-400 mt-2">Sign in to Zorx Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500 ml-1">Team Member</label>
                <div className="relative">
                   <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                   <select 
                     value={selectedUserId}
                     onChange={(e) => setSelectedUserId(e.target.value)}
                     className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue/50 transition-all appearance-none cursor-pointer hover:bg-black/70"
                   >
                     <option value="">Select your name...</option>
                     {users.map(user => (
                       <option key={user.id} value={user.id}>
                         {user.name}
                       </option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-3.5 pointer-events-none">
                     <ArrowRight className="h-4 w-4 text-gray-600 rotate-90" />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500 ml-1">Password</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                   <input 
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Enter password..."
                     className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-nexus-blue focus:ring-1 focus:ring-nexus-blue/50 transition-all placeholder:text-gray-600"
                   />
                </div>
             </div>

             {error && (
               <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
                 {error}
               </div>
             )}

             <button 
               type="submit"
               className="w-full bg-nexus-blue text-black font-bold py-3.5 rounded-xl hover:bg-nexus-blueGlow transition-all transform hover:scale-[1.02] shadow-lg shadow-nexus-blue/20 flex items-center justify-center gap-2"
             >
               Access Dashboard
               <ArrowRight className="h-5 w-5" />
             </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-xs text-gray-500">Authorized Personnel Only • Zorx Agency</p>
          </div>
       </div>
    </div>
  );
};

export default Login;
