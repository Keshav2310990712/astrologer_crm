import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Sparkles, TrendingUp, DollarSign, Calendar, Users, PieChart as PieIcon, RefreshCw, AlertCircle 
} from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setError('');
      const response = await api.get('/analytics');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
      setError('Failed to align analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  // Formatting helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Pie chart colors mapping
  const PIE_COLORS = {
    'Scheduled': '#e2be2b', // Gold
    'Completed': '#10b981', // Emerald
    'Cancelled': '#f43f5e'  // Rose
  };

  const PIE_COLORS_ARRAY = ['#e2be2b', '#10b981', '#f43f5e']; // Scheduled, Completed, Cancelled order

  // Custom tooltips
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-glow border-cosmic-500/30 rounded-xl p-3 text-xs bg-cosmic-950/90 text-slate-100">
          <p className="font-semibold uppercase tracking-wider text-gold-300 mb-1">{label}</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
            Earnings: <span className="font-bold text-slate-100">{formatCurrency(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CountTooltip = ({ active, payload, label, nameLabel = 'Count' }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-glow border-cosmic-500/30 rounded-xl p-3 text-xs bg-cosmic-950/90 text-slate-100">
          <p className="font-semibold uppercase tracking-wider text-cosmic-300 mb-1">{label || payload[0].name}</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cosmic-400"></span>
            {nameLabel}: <span className="font-bold text-slate-100">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const TopClientTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="glass-panel-glow border-cosmic-500/30 rounded-xl p-3 text-xs bg-cosmic-950/90 text-slate-100">
          <p className="font-semibold uppercase tracking-wider text-gold-300 mb-1">{dataItem.name}</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-300">
            Sessions: <span className="font-bold text-slate-100">{dataItem.sessions}</span>
          </p>
          <p className="flex items-center gap-1.5 font-medium text-slate-300">
            Total Paid: <span className="font-bold text-slate-100">{formatCurrency(dataItem.revenue)}</span>
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
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-t-cosmic-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border border-t-transparent border-r-gold-300 border-b-transparent border-l-transparent animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
          </div>
          <p className="mt-4 text-cosmic-300/80 font-medium tracking-widest text-xs uppercase animate-pulse">
            Analyzing alignments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden cosmic-bg">
      {/* Glow layers */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-500/5 blur-[120px] top-0 right-0 animate-pulse-slow"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[100px] bottom-0 left-0 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10 animate-fade-in">
        {/* Header Title */}
        <div className="sm:flex sm:items-center sm:justify-between border-b border-cosmic-900/50 pb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-slate-100 sm:text-4xl tracking-wide flex items-center gap-2">
              Performance Insights <Sparkles className="h-6 w-6 text-gold-400 animate-float" />
            </h1>
            <p className="mt-2 text-sm text-cosmic-300/60">
              In-depth aggregates on consultation volume, client retention, and revenue development.
            </p>
          </div>
          
          <div className="mt-4 flex sm:mt-0 sm:ml-4 gap-2">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4.5 py-2.5 rounded-xl border border-cosmic-800/40 text-sm font-semibold text-slate-200 bg-cosmic-950/40 hover:bg-cosmic-900/40 transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Sync Charts
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

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Revenue Trend Area */}
          <div className="glass-panel rounded-2xl p-6 border border-cosmic-800/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">Revenue Progression</h3>
                <p className="text-xs text-cosmic-300/40 mt-0.5">Historical earnings over past 6 months</p>
              </div>
              <span className="text-xs font-semibold text-gold-400 bg-gold-950/20 border border-gold-900/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Financial Trend
              </span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e2be2b" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#e2be2b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(244, 235, 147, 0.05)" />
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
                  <Tooltip content={<CurrencyTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="#e2be2b" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#analyticsAreaGrad)"
                    dot={{ r: 4, stroke: '#e2be2b', strokeWidth: 1.5, fill: '#0b0813' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Consultation Status Pie Chart */}
          <div className="glass-panel rounded-2xl p-6 border border-cosmic-800/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">Consultation Ratios</h3>
                <p className="text-xs text-cosmic-300/40 mt-0.5">Distribution of session statuses</p>
              </div>
              <span className="text-xs font-semibold text-cosmic-400 bg-cosmic-950/20 border border-cosmic-900/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <PieIcon className="w-3.5 h-3.5" /> Proportions
              </span>
            </div>

            <div className="h-[280px] w-full flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(data?.statusDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#8b5cf6'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CountTooltip nameLabel="Sessions" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="flex flex-col gap-3.5 text-xs text-slate-300">
                {(data?.statusDistribution || []).map((entry) => (
                  <div key={entry.name} className="flex items-center gap-3">
                    <span 
                      className="w-3.5 h-3.5 rounded-md" 
                      style={{ backgroundColor: PIE_COLORS[entry.name] }}
                    ></span>
                    <span className="font-semibold text-slate-200">{entry.name}:</span>
                    <span className="text-cosmic-300/60 font-bold">{entry.value} sessions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 3: Top Spending Clients */}
          <div className="glass-panel rounded-2xl p-6 border border-cosmic-800/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">Top Contributing Clients</h3>
                <p className="text-xs text-cosmic-300/40 mt-0.5">Top 5 clients by consultation payments</p>
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/20 border border-indigo-900/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> High Contributors
              </span>
            </div>

            <div className="h-[280px] w-full">
              {data?.topClients && data.topClients.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={data.topClients} 
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="analyticsBarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4c1d95" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(139, 92, 246, 0.05)" />
                    <XAxis 
                      type="number"
                      stroke="#8b5cf6" 
                      fontSize={11}
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      stroke="#8b5cf6" 
                      fontSize={11}
                      tickLine={false} 
                      axisLine={false} 
                      width={90}
                    />
                    <Tooltip content={<TopClientTooltip />} />
                    <Bar 
                      dataKey="revenue" 
                      name="Revenue Contribution" 
                      fill="url(#analyticsBarGrad)" 
                      radius={[0, 6, 6, 0]}
                      barSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-cosmic-300/35 italic">
                  No completed consultations found to calculate client revenue.
                </div>
              )}
            </div>
          </div>

          {/* Chart 4: Monthly Client Onboarding Growth */}
          <div className="glass-panel rounded-2xl p-6 border border-cosmic-800/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide">Client Base Growth</h3>
                <p className="text-xs text-cosmic-300/40 mt-0.5">Newly onboarded clients over past 6 months</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Onboarding Rate
              </span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.monthlyGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16, 185, 129, 0.05)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#10b981" 
                    fontSize={11}
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#10b981" 
                    fontSize={11}
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip content={<CountTooltip nameLabel="New Clients" />} />
                  <Line 
                    type="monotone" 
                    dataKey="newClients" 
                    name="New Clients" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#10b981', strokeWidth: 1.5, fill: '#0b0813' }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
