
import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Save, AlertCircle, CheckCircle, Database, RefreshCcw, Cloud, CloudOff } from 'lucide-react';
import { resetDatabase } from '../services/storage';
import { isSupabaseConfigured } from '../services/supabase';

interface SettingsViewProps {
  currentUser: User;
  onUpdatePassword: (newPassword: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, onUpdatePassword }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check current password
    if (currentPassword !== currentUser.password) {
      setError('Incorrect current password.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    onUpdatePassword(newPassword);
    setSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleReset = () => {
    if (window.confirm('WARNING: This will permanently delete all your local data and restore the default Mock Data. This action cannot be undone. Are you sure?')) {
        resetDatabase();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto mt-10">
       <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-nexus-blue/10 text-nexus-blueGlow mb-4">
              <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Security & Data</h2>
          <p className="text-gray-400 text-sm mt-1">Manage account security and database connections.</p>
       </div>

       {/* Connection Status Card */}
       <div className={`border rounded-xl p-6 shadow-xl flex items-center justify-between ${isSupabaseConfigured ? 'bg-nexus-green/5 border-nexus-green/20' : 'bg-white/5 border-white/10'}`}>
           <div className="flex items-center gap-4">
               <div className={`p-3 rounded-full ${isSupabaseConfigured ? 'bg-nexus-green/10 text-nexus-greenGlow' : 'bg-gray-700 text-gray-400'}`}>
                   {isSupabaseConfigured ? <Cloud className="h-6 w-6" /> : <CloudOff className="h-6 w-6" />}
               </div>
               <div>
                   <h3 className="text-lg font-bold text-white">Cloud Sync Status</h3>
                   <p className="text-sm text-gray-400">
                       {isSupabaseConfigured 
                         ? 'Connected to Supabase. Your data is synced to the cloud.' 
                         : 'Using Local Storage. Data is only saved on this device.'}
                   </p>
               </div>
           </div>
           {isSupabaseConfigured ? (
               <div className="flex items-center gap-2 text-nexus-greenGlow text-sm font-bold bg-nexus-green/10 px-3 py-1.5 rounded-full border border-nexus-green/20">
                   <CheckCircle className="h-4 w-4" /> Online
               </div>
           ) : (
               <div className="flex items-center gap-2 text-gray-400 text-sm font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                   Offline
               </div>
           )}
       </div>

       <div className="bg-nexus-card border border-white/10 rounded-xl p-8 shadow-xl">
           <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-2">Change Password</h3>
           
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Current Password</label>
                  <input 
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none transition-all"
                    required
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">New Password</label>
                      <input 
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none transition-all"
                        required
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Confirm New Password</label>
                      <input 
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-nexus-blue focus:outline-none transition-all"
                        required
                      />
                  </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                   <AlertCircle className="h-4 w-4 shrink-0" />
                   {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                   <CheckCircle className="h-4 w-4 shrink-0" />
                   {success}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-6 py-2.5 bg-nexus-blue text-black font-bold rounded-lg hover:bg-nexus-blueGlow transition-all shadow-lg shadow-nexus-blue/10 flex items-center gap-2">
                     <Save className="h-4 w-4" /> Update Password
                  </button>
              </div>
           </form>
       </div>

       {/* Reset Database Zone - Only show if local or explicitly needed */}
       <div className="bg-nexus-card border border-red-500/20 rounded-xl p-8 shadow-xl mt-8">
           <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
               <Database className="h-5 w-5" /> Local Database Control
           </h3>
           <p className="text-sm text-gray-400 mb-6">
               This action clears the cache on this device. If you are connected to the cloud, data will be re-fetched on reload. If you are offline, all data will be reset to default.
           </p>
           <button 
             onClick={handleReset}
             className="px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
           >
               <RefreshCcw className="h-4 w-4" /> Reset Local Cache
           </button>
       </div>
    </div>
  );
};

export default SettingsView;
