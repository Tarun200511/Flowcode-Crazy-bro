'use client';

import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrainStore } from '@/store/useTrainStore';
import { Alert } from '@/types';
import { formatDateTime, getAlertIcon } from '@/lib/utils';
import { generateDemoAlerts } from '@/lib/demoData';

export function AlertsPanel() {
  const { alerts, addAlert, acknowledgeAlert, clearAllAlerts } = useTrainStore();
  const [filter, setFilter] = useState<'all' | 'unacknowledged'>('all');

  useEffect(() => {
    // No automatic alert initialization or generation
    // Alerts will only be created when AI recommendations are applied
  }, []);

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || !alert.acknowledged
  );

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertCircle;
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-status-red border-status-red bg-status-red/10';
      case 'error': return 'text-status-red border-status-red bg-status-red/10';
      case 'warning': return 'text-status-orange border-status-orange bg-status-orange/10';
      case 'info': return 'text-status-blue border-status-blue bg-status-blue/10';
      default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="h-full flex flex-col bg-control-panel">
      {/* Header */}
      <div className="p-4 border-b border-control-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-status-orange" />
            <h2 className="text-lg font-semibold text-white">Alerts & Notifications</h2>
            {unacknowledgedCount > 0 && (
              <span className="bg-status-red text-white text-xs px-2 py-1 rounded-full">
                {unacknowledgedCount}
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllAlerts}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filter === 'all' 
                ? 'bg-ai-glow text-black' 
                : 'bg-control-bg text-gray-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unacknowledged')}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              filter === 'unacknowledged' 
                ? 'bg-status-orange text-black' 
                : 'bg-control-bg text-gray-400 hover:text-white'
            }`}
          >
            Unread ({unacknowledgedCount})
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts to display</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={() => acknowledgeAlert(alert.id)}
                getSeverityIcon={getSeverityIcon}
                getSeverityColor={getSeverityColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 border-t border-control-border">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-status-red font-bold">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-status-orange font-bold">
              {alerts.filter(a => a.severity === 'error').length}
            </div>
            <div className="text-gray-400">Error</div>
          </div>
          <div className="text-center">
            <div className="text-status-blue font-bold">
              {alerts.filter(a => a.severity === 'warning').length}
            </div>
            <div className="text-gray-400">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-status-green font-bold">
              {alerts.filter(a => a.acknowledged).length}
            </div>
            <div className="text-gray-400">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: () => void;
  getSeverityIcon: (severity: string) => any;
  getSeverityColor: (severity: string) => string;
}

function AlertCard({ alert, onAcknowledge, getSeverityIcon, getSeverityColor }: AlertCardProps) {
  const SeverityIcon = getSeverityIcon(alert.severity);
  const severityColors = getSeverityColor(alert.severity);

  return (
    <div className={`border rounded-lg p-3 transition-all duration-200 ${
      alert.acknowledged 
        ? 'bg-control-bg border-control-border opacity-60' 
        : `${severityColors}`
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getAlertIcon(alert.type)}</span>
          <SeverityIcon className="h-4 w-4" />
          <div>
            <div className="text-sm font-medium text-white">
              {alert.title}
            </div>
            <div className="text-xs text-gray-400">
              {alert.type.toUpperCase()} • {formatDateTime(alert.timestamp)}
            </div>
          </div>
        </div>
        
        {!alert.acknowledged && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onAcknowledge}
            className="h-6 w-6 p-0 hover:bg-status-green/20"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="mb-2">
        <p className="text-sm text-gray-300 leading-relaxed">
          {alert.message}
        </p>
        
        {alert.location && (
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-gray-400">Location:</span>
            <span className="text-xs text-white">{alert.location}</span>
          </div>
        )}
      </div>

      {/* Affected Trains */}
      {alert.affectedTrains && alert.affectedTrains.length > 0 && (
        <div className="border-t border-control-border pt-2">
          <div className="text-xs text-gray-400 mb-1">
            Affected Trains ({alert.affectedTrains.length}):
          </div>
          <div className="flex flex-wrap gap-1">
            {alert.affectedTrains.slice(0, 3).map((trainId) => (
              <span 
                key={trainId}
                className="text-xs bg-control-bg px-2 py-1 rounded text-white"
              >
                {trainId.replace('train-', '')}
              </span>
            ))}
            {alert.affectedTrains.length > 3 && (
              <span className="text-xs text-gray-400">
                +{alert.affectedTrains.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {alert.acknowledged && (
        <div className="flex items-center justify-center mt-2 pt-2 border-t border-control-border">
          <div className="flex items-center space-x-1 text-xs text-status-green">
            <Check className="h-3 w-3" />
            <span>Acknowledged</span>
          </div>
        </div>
      )}
    </div>
  );
}

function generateRandomAlert(): Alert {
  const types: Alert['type'][] = ['weather', 'maintenance', 'emergency', 'congestion', 'system'];
  const severities: Alert['severity'][] = ['critical', 'error', 'warning', 'info'];
  const locations = [
    'Platform 1, New Delhi',
    'Track Section A-12',
    'Mumbai Central',
    'Signal Box 47',
    'Bangalore Junction'
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];

  const messages = {
    weather: [
      'Heavy rainfall detected affecting train operations',
      'Fog conditions reducing visibility on tracks',
      'Strong winds reported in the region'
    ],
    maintenance: [
      'Scheduled track maintenance in progress',
      'Signal maintenance causing minor delays',
      'Platform renovation affecting operations'
    ],
    emergency: [
      'Emergency stop activated for safety',
      'Medical emergency on board train',
      'Technical fault detected in locomotive'
    ],
    congestion: [
      'High traffic density causing delays',
      'Platform congestion at major junction',
      'Multiple trains converging at station'
    ],
    system: [
      'Communication system experiencing issues',
      'Signaling system requires attention',
      'Power supply fluctuation detected'
    ]
  };

  const titles = {
    weather: 'Weather Alert',
    maintenance: 'Maintenance Notice',
    emergency: 'Emergency Situation',
    congestion: 'Traffic Congestion',
    system: 'System Alert'
  };

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    severity: severity,
    title: titles[type] || 'System Alert',
    message: messages[type] ? messages[type][Math.floor(Math.random() * messages[type].length)] : 'System notification',
    location,
    timestamp: new Date().toISOString(),
    acknowledged: false,
    affectedTrains: Math.random() > 0.5 ? [
      `train-${Math.floor(Math.random() * 20000 + 10000)}`,
      `train-${Math.floor(Math.random() * 20000 + 10000)}`
    ] : undefined
  };
}
