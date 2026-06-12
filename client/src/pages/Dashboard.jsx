import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Sparkles, Users, Calendar, Award, Star, Compass, Clock, Plus, ChevronRight, TrendingUp, DollarSign, RefreshCw, AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError('');
      const [statsRes, analyticsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/analytics')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to align cosmic data. Please try again.');
      showToast('Could not fetch latest metrics from server.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    showToast('Dashboard metrics synchronized.', 'info');
  };

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-glow border-cosmic-500/30 rounded-xl p-3 text-xs bg-cosmic-950/90 text-slate-100 font-sans">
          <p className="font-semibold uppercase tracking-wider text-gold-300 mb-1">{label}</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cosmic-400"></span>
            {payload[0].name}: <span className="font-bold text-slate-100">{unit === '$' ? formatCurrency(payload[0].value) : payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-950 flex flex-col items-center justify-center relative overflow-hidden cosmic-bg">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-cosmic-500/10 blur-[80px] top-1/4 left-1/4 animate-pulse-slow"></div>
        <div className="absolute w-[250px] h-[250px] rounded-full bg-gold-500/10 blur-[80px] bottom-1/4 right-1/4 animate-pulse-slow"></div>
        
        <div className="flex flex-col items-center z-10">
          <Spinner size="lg" />
          <p className="mt-4 text-cosmic-300/80 font-medium tracking-widest text-xs uppercase animate-pulse">
            Consulting the Stars...
          </p>
        </div>
      </div>
    );
  }

  // Pre-configured static details for the dashboard
  const statCards = [
    { 
      name: 'Total Clients', 
      value: stats?.totalClients || 0, 
      icon: Users, 
      desc: 'Registered in your chart registry',
      color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/15' 
    },
    { 
      name: 'Total Consultations', 
      value: stats?.totalConsultations || 0, 
      icon: Calendar, 
      desc: 'All scheduled sessions',
      color: 'from-purple-500/20 to-cosmic-500/20 text-cosmic-400 border-cosmic-500/15' 
    },
    { 
      name: 'Revenue', 
      value: formatCurrency(stats?.revenue || 0), 
      icon: DollarSign, 
      desc: 'Total completed session earnings',
      color: 'from-amber-500/20 to-gold-500/20 text-gold-400 border-gold-500/15' 
    },
    { 
      name: "Today's Appointments", 
      value: stats?.todayAppointments || 0, 
      icon: Clock, 
      desc: 'Pending consultations scheduled today',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/15' 
    },
  ];

  const upcomingConsultations = [
    { id: 1, client: 'Priya Patel', type: 'Kundali Matching', time: 'Today, 2:30 PM', sign: 'Leo' },
    { id: 2, client: 'Ethan Vance', type: 'Tarot Alignment', time: 'Today, 5:00 PM', sign: 'Scorpio' },
    { id: 3, client: 'Nisha Sen', type: 'Numerology Reading', time: 'Tomorrow, 10:00 AM', sign: 'Gemini' },
  ];

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Background glowing effects */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-500/5 blur-[120px] top-0 right-0 animate-pulse-slow"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] bottom-0 left-0 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in font-sans">
        {/* Welcome Section */}
        <div className="md:flex md:items-center md:justify-between border-b border-cosmic-900/50 pb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-slate-100 sm:text-4xl tracking-wide flex items-center gap-2">
              Cosmic Sanctuary <Sparkles className="h-6 w-6 text-gold-400 animate-float" />
            </h1>
            <p className="mt-2 text-sm text-cosmic-300/60">
              Welcome back, <span className="font-semibold text-gold-300">{user?.name}</span>. The stars are aligned.
            </p>
          </div>
          
          <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-cosmic-800/40 text-sm font-semibold text-slate-200 bg-cosmic-950/40 hover:bg-cosmic-900/40 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="inline-flex items-center px-4.5 py-2.5 rounded-xl border border-transparent text-sm font-semibold text-cosmic-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 transition-all duration-200 shadow-lg shadow-gold-500/15">
              <Plus className="h-4 w-4 mr-2" />
              New Consultation
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-xl flex items-start space-x-3 text-rose-200 animate-fade-in text-sm">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.name} 
                className={`glass-panel rounded-2xl p-6 border ${card.color} transition-all duration-300 hover:-translate-y-0.5 shadow-xl group`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-cosmic-300/50 uppercase tracking-wider">{card.name}</p>
                    <h4 className="text-3xl font-bold text-slate-100 mt-2 group-hover:text-gold-200 transition-colors">
                      {card.value}
                    </h4>
                  </div>
                  <div className="p-3 rounded-xl bg-cosmic-950/50 border border-cosmic-800/30 text-gold-400 shadow-inner group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-cosmic-300/40 mt-4 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts & Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Monthly Consultations */}
          <div className="glass-panel rounded-2xl p-6 border border-cosmic-800/40 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">Monthly Consultations</h3>
                <p className="text-xs text-cosmic-300/40 mt-0.5">Sessions logged over past 6 months</p>
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Session Trend
              </span>
            </div>

            <div className="h-[280px] w-full">
              {analytics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.15} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139, 92, 246, 0.08)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#8b5cf6" 
                      fontSize={11}
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#8b5cf6" 
                      fontSize={11}
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
                    <Bar 
                      dataKey="consultations" 
                      name="Consultations" 
                      fill="url(#barGradient)" 
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Revenue Trend */}
          <div className="glass-panel rounded-2xl p-6 border border-cosmic-800/40 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">Revenue Trend</h3>
                <p className="text-xs text-cosmic-300/40 mt-0.5">Earnings progression in USD</p>
              </div>
              <span className="text-xs font-semibold text-gold-400 bg-gold-950/20 border border-gold-900/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Completed Earnings
              </span>
            </div>

            <div className="h-[280px] w-full">
              {analytics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2be2b" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#e2be2b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(244, 235, 147, 0.08)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#e2be2b" 
                      fontSize={11}
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#e2be2b" 
                      fontSize={11}
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip content={<CustomTooltip unit="$" />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#e2be2b" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#areaGradient)"
                      dot={{ r: 4, stroke: '#e2be2b', strokeWidth: 1.5, fill: '#0b0813' }}
                      activeDot={{ r: 6, stroke: '#e2be2b', strokeWidth: 2, fill: '#e2be2b' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Grid (Profile Summary + Consultations list) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <h3 className="text-base font-bold text-slate-100 mb-4 tracking-wide">Cosmic Profile</h3>
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-cosmic-600 to-gold-500 flex items-center justify-center text-xl font-bold border border-cosmic-400/20 shadow-lg">
                {user?.name ? user.name.charAt(0) : '✨'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">{user?.name}</h4>
                <p className="text-xs text-gold-400 font-medium tracking-wide flex items-center gap-1 mt-0.5">
                  <Compass className="h-3.5 w-3.5" /> {user?.specialization}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-cosmic-800/30 pt-4 space-y-4">
              <div>
                <span className="block text-[10px] font-semibold text-cosmic-300/40 uppercase tracking-wider">Lineage Bio</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
                  "{user?.bio || 'No bio provided yet. Complete your onboarding description.'}"
                </p>
              </div>
              
              <div className="flex justify-between items-center bg-cosmic-950/40 rounded-xl p-3 border border-cosmic-900/50 text-xs">
                <span className="text-cosmic-300/50 font-medium">Practice Experience</span>
                <span className="font-semibold text-gold-300">{user?.experience} Years</span>
              </div>
            </div>
          </Card>

          {/* Today's appointments details list */}
          <Card className="lg:col-span-2">
            <h3 className="text-base font-bold text-slate-100 mb-6 flex items-center justify-between">
              <span>Today's Consultations Schedule</span>
              <span className="text-[10px] font-bold text-gold-400 bg-gold-950/20 border border-gold-900/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Appointments
              </span>
            </h3>

            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <div 
                  key={consultation.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-cosmic-950/30 hover:bg-cosmic-900/20 border border-cosmic-900/40 hover:border-cosmic-800/30 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-lg bg-cosmic-900/50 border border-cosmic-800/40 flex items-center justify-center font-bold text-[10px] text-gold-300 uppercase shadow-inner">
                      {consultation.sign}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-gold-200 transition-colors">
                        {consultation.client}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-cosmic-300/50 mt-0.5">
                        <span>{consultation.type}</span>
                        <span>•</span>
                        <span className="flex items-center text-cosmic-300/70">
                          <Clock className="h-3 w-3 mr-1 text-cosmic-400" /> {consultation.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-1.5 rounded-lg text-cosmic-400 hover:text-gold-300 hover:bg-cosmic-900/40 transition-colors">
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
