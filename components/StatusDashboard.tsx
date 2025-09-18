'use client';

import { useEffect, useState } from 'react';
import { Train, Clock, AlertTriangle, Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTrainStore } from '@/store/useTrainStore';
import { formatNumber, formatPercentage } from '@/lib/utils';

export function StatusDashboard() {
  const { networkStats, trains, agents, alerts } = useTrainStore();
  const [delayTrendData, setDelayTrendData] = useState<any[]>([]);
  const [congestionData, setCongestionData] = useState<any[]>([]);
  const [throughputData, setThroughputData] = useState<any[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    totalTrains: 0,
    onTimeTrains: 0,
    delayedTrains: 0,
    emergencyTrains: 0,
    averageDelay: 0,
    activeAlerts: 0
  });

  useEffect(() => {
    // Generate demo chart data
    const now = new Date();
    const delayTrend = Array.from({ length: 12 }, (_, i) => ({
      time: new Date(now.getTime() - (11 - i) * 5 * 60 * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      avgDelay: Math.max(0, networkStats.averageDelay + (Math.random() - 0.5) * 10),
      onTime: 85 + (Math.random() - 0.5) * 20
    }));

    const congestion = [
      { zone: 'Delhi Hub', level: 85, trains: 45 },
      { zone: 'Mumbai Zone', level: 72, trains: 38 },
      { zone: 'Chennai Zone', level: 45, trains: 28 },
      { zone: 'Kolkata Zone', level: 58, trains: 32 },
      { zone: 'Bangalore Zone', level: 35, trains: 22 }
    ];

    const throughput = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      trains: Math.floor(Math.random() * 50 + 20),
      capacity: 80
    }));

    setDelayTrendData(delayTrend);
    setCongestionData(congestion);
    setThroughputData(throughput);
  }, [networkStats.averageDelay]);

  // Calculate real-time stats from trains data
  useEffect(() => {
    const updateStats = () => {
      if (trains.length > 0) {
        const totalTrains = trains.length;
        const onTimeTrains = trains.filter(t => t.status === 'on-time').length;
        const delayedTrains = trains.filter(t => t.status === 'delayed').length;
        const emergencyTrains = trains.filter(t => t.status === 'emergency' || t.status === 'maintenance').length;
        const totalDelay = trains.reduce((sum, train) => sum + train.delay, 0);
        const averageDelay = totalTrains > 0 ? totalDelay / totalTrains : 0;
        const activeAlerts = alerts.filter(a => !a.acknowledged).length;

        setRealTimeStats({
          totalTrains,
          onTimeTrains,
          delayedTrains,
          emergencyTrains,
          averageDelay,
          activeAlerts
        });
      }
    };

    updateStats();
    
    // Update stats every 2 seconds
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [trains, alerts]);

  const kpiCards = [
    {
      title: 'Trains Running',
      value: realTimeStats.totalTrains,
      icon: Train,
      color: 'text-status-blue',
      bgColor: 'bg-status-blue/10',
      trend: '+2.3%',
      trendUp: true
    },
    {
      title: 'On Time Performance',
      value: `${realTimeStats.totalTrains > 0 ? Math.round((realTimeStats.onTimeTrains / realTimeStats.totalTrains) * 100) : 0}%`,
      icon: Clock,
      color: 'text-status-green',
      bgColor: 'bg-status-green/10',
      trend: '+1.2%',
      trendUp: true
    },
    {
      title: 'Active Alerts',
      value: realTimeStats.activeAlerts,
      icon: AlertTriangle,
      color: 'text-status-orange',
      bgColor: 'bg-status-orange/10',
      trend: '-0.8%',
      trendUp: false
    },
    {
      title: 'Average Delay',
      value: `${realTimeStats.averageDelay.toFixed(1)}m`,
      icon: Activity,
      color: 'text-status-red',
      bgColor: 'bg-status-red/10',
      trend: '-2.1%',
      trendUp: false
    }
  ];

  const statusDistribution = [
    { name: 'On Time', value: realTimeStats.onTimeTrains, color: '#00ff88' },
    { name: 'Delayed', value: realTimeStats.delayedTrains, color: '#ff8800' },
    { name: 'Emergency', value: realTimeStats.emergencyTrains, color: '#ff3333' },
    { name: 'Maintenance', value: Math.max(0, realTimeStats.totalTrains - realTimeStats.onTimeTrains - realTimeStats.delayedTrains - realTimeStats.emergencyTrains), color: '#ffff00' }
  ];

  return (
    <div className="h-full flex flex-col bg-control-panel overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-control-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Network Status</h2>
            <p className="text-xs text-gray-400">Real-time performance metrics</p>
          </div>
          <div className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {kpiCards.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  {kpi.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-status-green" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-status-red" />
                  )}
                  <span className={kpi.trendUp ? 'text-status-green' : 'text-status-red'}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value}
              </div>
              <div className="text-xs text-gray-400">{kpi.title}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Delay Trend Chart */}
          <div className="mission-control-panel">
            <h3 className="text-xs font-semibold text-white mb-1">Delay Trends</h3>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={delayTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a1b',
                    border: '1px solid #2a2a2b',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgDelay" 
                  stroke="#ff8800" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Train Status Distribution */}
          <div className="mission-control-panel">
            <h3 className="text-xs font-semibold text-white mb-1">Train Status Distribution</h3>
            <ResponsiveContainer width="100%" height={60}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={25}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a1b',
                    border: '1px solid #2a2a2b',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-2">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Congestion Hotspots */}
          <div className="mission-control-panel">
            <h3 className="text-sm font-semibold text-white mb-3">Congestion Hotspots</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={congestionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" />
                <XAxis 
                  type="number"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="category"
                  dataKey="zone"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a1b',
                    border: '1px solid #2a2a2b',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="level" 
                  fill="#ff8800"
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Network Throughput */}
          <div className="mission-control-panel">
            <h3 className="text-sm font-semibold text-white mb-3">24h Network Throughput</h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={throughputData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" />
                <XAxis 
                  dataKey="hour"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a1b',
                    border: '1px solid #2a2a2b',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="trains" 
                  stroke="#00d4ff" 
                  fill="#00d4ff"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Agents Status */}
        <div className="mt-4 mission-control-panel">
          <h3 className="text-sm font-semibold text-white mb-3">AI Agents Performance</h3>
          <div className="grid grid-cols-5 gap-3">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-control-bg rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className={`status-indicator ${
                    agent.status === 'active' ? 'status-green' : 
                    agent.status === 'processing' ? 'status-orange' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-xs text-ai-glow">{agent.accuracy}%</span>
                </div>
                <div className="text-xs text-white font-medium truncate">
                  {agent.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatNumber(agent.processedEvents)} events
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
