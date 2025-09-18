'use client';

import { Train, Wifi, WifiOff, Activity, Bell, ChevronDown, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useTrainStore } from '@/store/useTrainStore';
import { formatTime } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Header() {
  const { isConnected, networkStats, agents, alerts } = useTrainStore();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  useEffect(() => {
    // Set initial time on client side to avoid hydration mismatch
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNetworkDropdown) {
        setShowNetworkDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNetworkDropdown]);

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

        {/* Alerts Button */}
        <button
          onClick={() => setShowAlertsModal(true)}
          className="relative flex items-center space-x-2 px-3 py-2 rounded-lg bg-control-bg border border-control-border hover:border-status-orange transition-colors"
        >
          <Bell className="h-4 w-4 text-status-orange" />
          <span className="text-sm text-gray-300">Alerts</span>
          {alerts.filter(a => !a.acknowledged).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-status-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {alerts.filter(a => !a.acknowledged).length}
            </span>
          )}
        </button>

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
            <div className="absolute top-full right-0 mt-2 w-80 bg-control-panel border border-control-border rounded-lg shadow-lg z-50">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-ai-glow" />
                  <span>Network Status Overview</span>
                </h3>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-control-bg rounded p-2">
                    <div className="text-xs text-gray-400">Total Trains</div>
                    <div className="text-lg font-bold text-status-blue">{networkStats.totalTrains}</div>
                  </div>
                  <div className="bg-control-bg rounded p-2">
                    <div className="text-xs text-gray-400">On Time</div>
                    <div className="text-lg font-bold text-status-green">
                      {Math.round((networkStats.onTimeTrains / networkStats.totalTrains) * 100)}%
                    </div>
                  </div>
                  <div className="bg-control-bg rounded p-2">
                    <div className="text-xs text-gray-400">Avg Delay</div>
                    <div className="text-lg font-bold text-status-orange">{networkStats.averageDelay}m</div>
                  </div>
                  <div className="bg-control-bg rounded p-2">
                    <div className="text-xs text-gray-400">Throughput</div>
                    <div className="text-lg font-bold text-ai-glow">{networkStats.networkThroughput}%</div>
                  </div>
                </div>

                {/* Alert Summary */}
                <div className="border-t border-control-border pt-3">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">Recent Alerts</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center space-x-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-status-red' :
                          alert.severity === 'warning' ? 'bg-status-orange' :
                          alert.severity === 'info' ? 'bg-status-blue' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-gray-300 truncate flex-1">{alert.title}</span>
                        <span className="text-gray-500">{formatTime(alert.timestamp)}</span>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-2">No recent alerts</div>
                    )}
                  </div>
                </div>

                {/* AI Agents Status */}
                <div className="border-t border-control-border pt-3 mt-3">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">AI Agents Status</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {agents.slice(0, 3).map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'active' ? 'bg-status-green' :
                            agent.status === 'processing' ? 'bg-status-orange' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-gray-300">{agent.name}</span>
                        </div>
                        <span className="text-ai-glow">{agent.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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

      {/* Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-control-panel border border-control-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-control-border flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-status-orange" />
                <h2 className="text-lg font-semibold text-white">System Alerts & Notifications</h2>
                <span className="bg-status-red text-white text-xs px-2 py-1 rounded-full">
                  {alerts.filter(a => !a.acknowledged).length} unread
                </span>
              </div>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No alerts to display</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 transition-all ${
                        alert.acknowledged 
                          ? 'bg-control-bg border-control-border opacity-60' 
                          : 'bg-control-panel border-status-orange'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {alert.type === 'weather' ? '🌧️' : 
                             alert.type === 'maintenance' ? '🔧' : 
                             alert.type === 'emergency' ? '🚨' : 
                             alert.type === 'congestion' ? '⚠️' : '💻'}
                          </span>
                          <div>
                            <h3 className="text-sm font-medium text-white">{alert.title}</h3>
                            <p className="text-xs text-gray-400">
                              {alert.type.toUpperCase()} • {formatTime(alert.timestamp)}
                            </p>
                          </div>
                        </div>
                        {!alert.acknowledged && (
                          <button
                            onClick={() => {
                              // This would call acknowledgeAlert from the store
                              console.log('Acknowledge alert:', alert.id);
                            }}
                            className="text-xs bg-status-green text-black px-2 py-1 rounded hover:bg-status-green/80"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                      
                      {alert.location && (
                        <div className="text-xs text-gray-400">
                          📍 {alert.location}
                        </div>
                      )}
                      
                      {alert.affectedTrains && alert.affectedTrains.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-control-border">
                          <div className="text-xs text-gray-400 mb-1">
                            Affected Trains ({alert.affectedTrains.length}):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {alert.affectedTrains.slice(0, 5).map((trainId) => (
                              <span 
                                key={trainId}
                                className="text-xs bg-control-bg px-2 py-1 rounded text-white"
                              >
                                {trainId.replace('train-', '')}
                              </span>
                            ))}
                            {alert.affectedTrains.length > 5 && (
                              <span className="text-xs text-gray-400">
                                +{alert.affectedTrains.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-control-border flex justify-between items-center">
              <div className="text-xs text-gray-400">
                {alerts.length} total alerts • {alerts.filter(a => a.acknowledged).length} acknowledged
              </div>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="px-4 py-2 bg-ai-glow text-black rounded hover:bg-ai-glow/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
