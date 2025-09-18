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

export function NetworkOverview() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const { trains } = useTrainStore();

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
      const activeSignals = data.stations.length * 2 + data.trackSections.length; // 2 signals per station + intermediate signals
      const totalSignals = activeSignals; // All signals are active in this simulation
      
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
      <div className="h-full flex items-center justify-center bg-control-panel">
        <div className="text-gray-400 text-sm">Loading network status...</div>
      </div>
    );
  }

  const onTimePercentage = Math.round((stats.onTimeTrains / stats.totalTrains) * 100);
  const sectionUtilization = Math.round((stats.occupiedSections / stats.totalSections) * 100);

  return (
    <div className="h-full flex flex-col bg-control-panel">
      {/* Header */}
      <div className="p-3 border-b border-control-border">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-ai-glow" />
          <h2 className="text-sm font-semibold text-white">HWH-KGP Network Status</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Howrah-Kharagpur Line (100km) • Live Status
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Train Operations */}
          <div className="bg-control-bg rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Train className="h-4 w-4 text-status-blue" />
              <span className="text-xs font-medium text-white">Train Operations</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Total Active</span>
                <span className="text-sm font-bold text-white">{stats.totalTrains}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">On Time</span>
                <span className="text-sm font-bold text-status-green">{stats.onTimeTrains}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Delayed</span>
                <span className="text-sm font-bold text-status-orange">{stats.delayedTrains}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-control-bg rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-status-orange" />
              <span className="text-xs font-medium text-white">Performance</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">On-Time %</span>
                <span className={`text-sm font-bold ${onTimePercentage >= 80 ? 'text-status-green' : onTimePercentage >= 60 ? 'text-status-orange' : 'text-status-red'}`}>
                  {onTimePercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Avg Delay</span>
                <span className={`text-sm font-bold ${stats.averageDelay <= 5 ? 'text-status-green' : stats.averageDelay <= 15 ? 'text-status-orange' : 'text-status-red'}`}>
                  {stats.averageDelay}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Maintenance</span>
                <span className="text-sm font-bold text-status-blue">{stats.maintenanceTrains}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Status */}
        <div className="grid grid-cols-2 gap-3">
          {/* Track Sections */}
          <div className="bg-control-bg rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-status-orange" />
              <span className="text-xs font-medium text-white">Track Sections</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Total Sections</span>
                <span className="text-sm font-bold text-white">{stats.totalSections}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Occupied</span>
                <span className="text-sm font-bold text-status-orange">{stats.occupiedSections}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Utilization</span>
                <span className={`text-sm font-bold ${sectionUtilization <= 60 ? 'text-status-green' : sectionUtilization <= 80 ? 'text-status-orange' : 'text-status-red'}`}>
                  {sectionUtilization}%
                </span>
              </div>
            </div>
          </div>

          {/* Signaling System */}
          <div className="bg-control-bg rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Radio className="h-4 w-4 text-status-green" />
              <span className="text-xs font-medium text-white">Signaling</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Active Signals</span>
                <span className="text-sm font-bold text-status-green">{stats.activeSignals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">System Status</span>
                <span className="text-sm font-bold text-status-green">OPERATIONAL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Stations</span>
                <span className="text-sm font-bold text-white">9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-4 p-3 bg-control-bg rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-status-green" />
              <span className="text-xs font-medium text-white">Line Status</span>
            </div>
            <span className="text-xs font-bold text-status-green">OPERATIONAL</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
