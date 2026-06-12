import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Users, Calendar, Award, Star, Compass, Clock, MapPin, Plus, CheckCircle2, ChevronRight 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for Phase 1 visual wow factor
  const stats = [
    { name: 'Active Clients', value: '28', icon: Users, change: '+12% this month', color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400' },
    { name: 'Consultations', value: '142', icon: Calendar, change: '18 pending charts', color: 'from-purple-500/20 to-cosmic-500/20 text-cosmic-400' },
    { name: 'Cosmic Rating', value: '4.95', icon: Star, change: '48 verified reviews', color: 'from-amber-500/20 to-gold-500/20 text-gold-400' },
    { name: 'Experience', value: `${user?.experience || 0} Yrs`, icon: Award, change: 'Professional license active', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
  ];

  const upcomingConsultations = [
    { id: 1, client: 'Priya Patel', type: 'Kundali Matching', time: 'Today, 2:30 PM', status: 'Chart Ready', sign: 'Leo' },
    { id: 2, client: 'Ethan Vance', type: 'Tarot Alignment', time: 'Today, 5:00 PM', status: 'Pending Bio', sign: 'Scorpio' },
    { id: 3, client: 'Nisha Sen', type: 'Numerology Reading', time: 'Tomorrow, 10:00 AM', status: 'Completed Audit', sign: 'Gemini' },
    { id: 4, client: 'David Miller', type: 'Vastu Consultation', time: 'June 14, 4:15 PM', status: 'Map Uploaded', sign: 'Taurus' },
  ];

  const recentActivities = [
    { id: 1, action: 'Chart generated for Priya Patel', time: '20 mins ago' },
    { id: 2, action: 'Payment verified from Ethan Vance', time: '2 hours ago' },
    { id: 3, action: 'Notes updated for Nisha Sen', time: 'Yesterday' },
  ];

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Background glowing effects */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-500/5 blur-[120px] top-0 right-0 animate-pulse-slow"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] bottom-0 left-0 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in">
        {/* Welcome Section */}
        <div className="md:flex md:items-center md:justify-between border-b border-cosmic-900/50 pb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-slate-100 sm:text-4xl tracking-wide flex items-center gap-2">
              Cosmic Sanctuary <Sparkles className="h-6 w-6 text-gold-400 animate-float" />
            </h1>
            <p className="mt-2 text-sm text-cosmic-300/60">
              Welcome back to your workspace. The planets are aligned in your favor today.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button className="inline-flex items-center px-4.5 py-2.5 rounded-xl border border-transparent text-sm font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/15">
              <Plus className="h-4 w-4 mr-2" />
              New Consultation
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Astrologer Profile Summary Card */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden shadow-xl lg:col-span-1 border border-cosmic-800/40">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400/10 to-transparent rounded-bl-full"></div>
            
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cosmic-600 to-gold-500 flex items-center justify-center text-2xl font-bold border border-cosmic-400/20 shadow-lg">
                {user?.name ? user.name.charAt(0) : '✨'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{user?.name}</h3>
                <p className="text-xs text-gold-400 font-medium tracking-wide flex items-center gap-1">
                  <Compass className="h-3 w-3" /> {user?.specialization}
                </p>
                <p className="text-xs text-cosmic-400 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-cosmic-800/30 pt-4 space-y-3">
              <div>
                <span className="block text-xs font-semibold text-cosmic-300/50 uppercase tracking-wider">Lineage & Bio</span>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed italic">
                  "{user?.bio || 'No bio provided yet. Update your cosmic profile to help clients understand your practices.'}"
                </p>
              </div>
              
              <div className="flex justify-between items-center bg-cosmic-950/40 rounded-xl p-3 border border-cosmic-900/50">
                <span className="text-xs text-cosmic-300/60 font-medium">Practice Experience</span>
                <span className="text-sm font-semibold text-gold-300">{user?.experience} Years Practice</span>
              </div>
            </div>
          </div>

          {/* Stats Widget */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-cosmic-800/20 transition-all duration-300 hover:border-cosmic-700/40 hover:-translate-y-0.5 group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-cosmic-300/50 uppercase tracking-wider">{stat.name}</p>
                      <h4 className="text-3xl font-bold text-slate-100 mt-1 group-hover:text-gold-200 transition-colors">{stat.value}</h4>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-cosmic-400 mt-4 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    {stat.change}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details Section (Upcoming Consultations + Recent Activity) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline / Upcoming */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 border border-cosmic-800/40">
            <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center justify-between">
              <span>Aligned Consultations</span>
              <span className="text-xs font-medium text-gold-400 bg-gold-950/20 border border-gold-900/30 px-2.5 py-0.5 rounded-full">
                Today
              </span>
            </h3>

            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <div 
                  key={consultation.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-cosmic-950/30 hover:bg-cosmic-900/20 border border-cosmic-900/40 hover:border-cosmic-800/30 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-xl bg-cosmic-900/50 border border-cosmic-800/40 flex items-center justify-center font-bold text-xs text-gold-300 uppercase shadow-inner">
                      {consultation.sign}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-gold-200 transition-colors">
                        {consultation.client}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-cosmic-300/50 mt-1">
                        <span>{consultation.type}</span>
                        <span>•</span>
                        <span className="flex items-center text-cosmic-300/70">
                          <Clock className="h-3 w-3 mr-1 text-cosmic-400" /> {consultation.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-cosmic-900/60 border border-cosmic-800/30 text-cosmic-300">
                      {consultation.status}
                    </span>
                    <button className="p-1.5 rounded-lg text-cosmic-400 hover:text-gold-300 hover:bg-cosmic-900/40 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity / Actions */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-1 border border-cosmic-800/40 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-6">Recent Events</h3>
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex space-x-3">
                    <div className="mt-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-200">{act.action}</p>
                      <span className="text-[10px] text-cosmic-300/40 block mt-0.5">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-cosmic-800/20 pt-4">
              <span className="block text-xs font-semibold text-cosmic-300/50 uppercase tracking-wider mb-3">Quick Navigation</span>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 px-3 text-center rounded-xl bg-cosmic-900/40 hover:bg-cosmic-900/60 border border-cosmic-800/30 text-xs font-semibold text-slate-300 hover:text-white transition-all">
                  Client Directory
                </button>
                <button className="py-2.5 px-3 text-center rounded-xl bg-cosmic-900/40 hover:bg-cosmic-900/60 border border-cosmic-800/30 text-xs font-semibold text-slate-300 hover:text-white transition-all">
                  Kundali Engine
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
