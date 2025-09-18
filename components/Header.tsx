'use client';

import { Train, Wifi, WifiOff, Activity, ChevronDown, Bell, AlertTriangle } from 'lucide-react';
import { useTrainStore } from '@/store/useTrainStore';
import { formatTime } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { NetworkStatusDropdown } from './NetworkStatusDropdown';

export function Header() {
  const { isConnected, networkStats, agents, alerts } = useTrainStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  useEffect(() => {
    // Set initial time on client side to avoid hydration mismatch
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNetworkDropdown) {
        setShowNetworkDropdown(false);
      }
      if (showAlertsDropdown) {
        setShowAlertsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNetworkDropdown, showAlertsDropdown]);

  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalAgents = agents.length;

  return (
    <header className="h-16 bg-control-panel border-b border-control-border px-6 flex items-center justify-between">
      {/* Left: Logo and Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Train className="h-8 w-8 text-ai-glow" />
          <div>
            <h1 className="text-xl font-bold text-white">Railway Mission Control</h1>
            <p className="text-xs text-gray-400">AI Traffic Optimization System</p>
          </div>
        </div>
      </div>

      {/* Center: Quick Stats */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className={`status-indicator ${networkStats.totalTrains > 0 ? 'status-green' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-300">
            {networkStats.totalTrains} Trains Active
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-ai-glow" />
          <span className="text-sm text-gray-300">
            {activeAgents}/{totalAgents} AI Agents
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-status-green" />
          ) : (
            <WifiOff className="h-4 w-4 text-status-red" />
          )}
          <span className="text-sm text-gray-300">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>


        {/* Alerts Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative flex items-center space-x-2 px-3 py-2 rounded-lg bg-control-bg border border-control-border hover:border-status-orange transition-colors"
          >
            <Bell className="h-4 w-4 text-status-orange" />
            <span className="text-sm text-gray-300">Alerts</span>
            {alerts.filter(a => !a.acknowledged).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-status-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {alerts.filter(a => !a.acknowledged).length}
              </span>
            )}
            <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${showAlertsDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showAlertsDropdown && (
            <div className="absolute top-full right-0 mt-2 w-96 bg-control-panel border border-control-border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
              <div className="p-3 border-b border-control-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">System Alerts</h3>
                  <span className="text-xs text-gray-400">
                    {alerts.filter(a => !a.acknowledged).length} unread
                  </span>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No alerts to display</p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-2 rounded border transition-all ${
                          alert.acknowledged 
                            ? 'bg-control-bg border-control-border opacity-60' 
                            : 'bg-control-panel border-status-orange/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-3 w-3 text-status-orange flex-shrink-0" />
                            <span className="text-xs font-medium text-white truncate">{alert.title}</span>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatTime(alert.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mb-1">{alert.message}</p>
                        {alert.location && (
                          <p className="text-xs text-gray-400">📍 {alert.location}</p>
                        )}
                      </div>
                    ))}
                    {alerts.length > 5 && (
                      <div className="text-center p-2 text-xs text-gray-400">
                        +{alerts.length - 5} more alerts
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Network Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-control-bg border border-control-border hover:border-ai-glow transition-colors"
          >
            <Activity className="h-4 w-4 text-ai-glow" />
            <span className="text-sm text-gray-300">Network</span>
            <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showNetworkDropdown && (
            <NetworkStatusDropdown />
          )}
        </div>
      </div>

      {/* Right: Time and System Status */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-lg font-mono text-white">
            {currentTime ? formatTime(currentTime.toISOString()) : '--:--:--'}
          </div>
          <div className="text-xs text-gray-400">
            {currentTime ? currentTime.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }) : '---'}
          </div>
        </div>
        
        <div className="w-px h-8 bg-control-border" />
        
        <div className="flex items-center space-x-2">
          <div className="status-indicator status-green" />
          <span className="text-sm text-status-green font-medium">OPERATIONAL</span>
        </div>
      </div>

    </header>
  );
}
