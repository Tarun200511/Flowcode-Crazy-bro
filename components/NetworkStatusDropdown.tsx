'use client';

import { useEffect, useState } from 'react';
import { Train, Clock, AlertTriangle, CheckCircle, Activity, Radio } from 'lucide-react';
import { useTrainStore } from '@/store/useTrainStore';
import { getHowrahKgpLineData } from '@/lib/demoData';

interface NetworkStats {
  totalTrains: number;
  onTimeTrains: number;
  delayedTrains: number;
  maintenanceTrains: number;
  averageDelay: number;
  occupiedSections: number;
  totalSections: number;
  activeSignals: number;
  totalSignals: number;
}

export function NetworkStatusDropdown() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const { trains, agents } = useTrainStore();

  useEffect(() => {
    const updateStats = () => {
      const data = getHowrahKgpLineData();
      
      // Calculate real-time statistics from Howrah-KGP data
      const totalTrains = data.trains.length;
      const onTimeTrains = data.trains.filter(t => t.status === 'on-time').length;
      const delayedTrains = data.trains.filter(t => t.status === 'delayed').length;
      const maintenanceTrains = data.trains.filter(t => t.status === 'maintenance').length;
      
      // Calculate average delay from delayed trains
      const delayedTrainsList = data.trains.filter(t => t.delay && t.delay > 0);
      const averageDelay = delayedTrainsList.length > 0 
        ? Math.round(delayedTrainsList.reduce((sum, t) => sum + (t.delay || 0), 0) / delayedTrainsList.length)
        : 0;
      
      // Track section statistics
      const occupiedSections = data.trackSections.filter(s => s.status === 'occupied').length;
      const totalSections = data.trackSections.length;
      
      // Signal statistics (estimated based on stations and sections)
      const activeSignals = data.stations.length * 2 + data.trackSections.length;
      const totalSignals = activeSignals;
      
      setStats({
        totalTrains,
        onTimeTrains,
        delayedTrains,
        maintenanceTrains,
        averageDelay,
        occupiedSections,
        totalSections,
        activeSignals,
        totalSignals
      });
    };

    updateStats();
    
    // Update stats every 5 seconds to reflect real-time changes
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, [trains]);

  if (!stats) {
    return (
      <div className="absolute top-full right-0 mt-2 w-96 bg-control-panel border border-control-border rounded-lg shadow-lg z-50">
        <div className="p-4 text-center text-gray-400 text-sm">Loading network status...</div>
      </div>
    );
  }

  const onTimePercentage = Math.round((stats.onTimeTrains / stats.totalTrains) * 100);
  const sectionUtilization = Math.round((stats.occupiedSections / stats.totalSections) * 100);
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalAgents = agents.length;

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-control-panel border border-control-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="h-4 w-4 text-ai-glow" />
          <h3 className="text-sm font-semibold text-white">Network Status Overview</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">Howrah-Kharagpur Line (100km) • Live Status</p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Total Trains */}
          <div className="bg-control-bg rounded p-2">
            <div className="flex items-center space-x-1 mb-1">
              <Train className="h-3 w-3 text-status-blue" />
              <span className="text-xs text-gray-400">Total Trains</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.totalTrains}</div>
          </div>

          {/* On Time Performance */}
          <div className="bg-control-bg rounded p-2">
            <div className="flex items-center space-x-1 mb-1">
              <CheckCircle className="h-3 w-3 text-status-green" />
              <span className="text-xs text-gray-400">On Time</span>
            </div>
            <div className={`text-lg font-bold ${onTimePercentage >= 80 ? 'text-status-green' : onTimePercentage >= 60 ? 'text-status-orange' : 'text-status-red'}`}>
              {onTimePercentage}%
            </div>
          </div>

          {/* Average Delay */}
          <div className="bg-control-bg rounded p-2">
            <div className="flex items-center space-x-1 mb-1">
              <Clock className="h-3 w-3 text-status-orange" />
              <span className="text-xs text-gray-400">Avg Delay</span>
            </div>
            <div className={`text-lg font-bold ${stats.averageDelay <= 5 ? 'text-status-green' : stats.averageDelay <= 15 ? 'text-status-orange' : 'text-status-red'}`}>
              {stats.averageDelay}m
            </div>
          </div>

          {/* Section Utilization */}
          <div className="bg-control-bg rounded p-2">
            <div className="flex items-center space-x-1 mb-1">
              <AlertTriangle className="h-3 w-3 text-status-orange" />
              <span className="text-xs text-gray-400">Throughput</span>
            </div>
            <div className={`text-lg font-bold ${sectionUtilization <= 60 ? 'text-status-green' : sectionUtilization <= 80 ? 'text-status-orange' : 'text-status-red'}`}>
              {sectionUtilization}%
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="border-t border-control-border pt-3 mb-3">
          <h4 className="text-xs font-medium text-gray-400 mb-2">Detailed Statistics</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">On Time Trains:</span>
              <span className="text-status-green font-medium">{stats.onTimeTrains}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Delayed Trains:</span>
              <span className="text-status-orange font-medium">{stats.delayedTrains}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Maintenance:</span>
              <span className="text-status-blue font-medium">{stats.maintenanceTrains}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Occupied Sections:</span>
              <span className="text-status-orange font-medium">{stats.occupiedSections}/{stats.totalSections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Signals:</span>
              <span className="text-status-green font-medium">{stats.activeSignals}</span>
            </div>
          </div>
        </div>

        {/* AI Agents Status */}
        <div className="border-t border-control-border pt-3">
          <h4 className="text-xs font-medium text-gray-400 mb-2">AI Agents Status</h4>
          <div className="grid grid-cols-1 gap-1 mb-2">
            {agents.slice(0, 3).map((agent) => (
              <div key={agent.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-status-green' :
                    agent.status === 'idle' ? 'bg-status-orange' : 'bg-status-red'
                  }`}></div>
                  <span className="text-gray-300">{agent.name}</span>
                </div>
                <span className={`${
                  agent.status === 'active' ? 'text-status-green' :
                  agent.status === 'idle' ? 'text-status-orange' : 'text-status-red'
                }`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-control-border text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Active Agents:</span>
              <span className="text-status-green">{activeAgents}/{totalAgents}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Last Updated:</span>
              <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
