'use client';

import { useEffect, useState } from 'react';
import { InteractiveRailwaySignaling } from '@/components/RailwaySignaling';
import { StatusDashboard } from '@/components/StatusDashboard';
import { AIRecommendations } from '@/components/AIRecommendations';
import { AlertsPanel } from '@/components/AlertsPanel';
import { Header } from '@/components/Header';
import { SimulationModal } from '@/components/SimulationModal';
import { useTrainStore } from '@/store/useTrainStore';
import { initializeDemoData } from '@/lib/demoData';

export default function Home() {
  const { 
    setTrains, 
    setStations, 
    setTracks, 
    setNetworkStats, 
    setAgents,
    isSimulationModalOpen,
    setConnectionStatus,
    clearAllAlerts
  } = useTrainStore();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this only runs on client side
    setIsClient(true);
    
    // Clear any existing alerts first
    clearAllAlerts();
    
    // Initialize with demo data
    const demoData = initializeDemoData();
    setTrains(demoData.trains);
    setStations(demoData.stations);
    setTracks(demoData.tracks);
    setNetworkStats(demoData.networkStats);
    setAgents(demoData.agents);

    // Simulate connection
    setConnectionStatus(true);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // This will be replaced with WebSocket connection
      // For now, just simulate some updates
    }, 5000);

    return () => clearInterval(interval);
  }, [setTrains, setStations, setTracks, setNetworkStats, setAgents, setConnectionStatus, clearAllAlerts]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="h-screen flex items-center justify-center bg-control-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-ai-glow border-t-transparent mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">Loading Railway Mission Control...</div>
          <div className="text-gray-400 text-sm mt-2">Initializing AI agents and network data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-control-bg">
      <Header />
      
      {/* Top Panel - Network Status */}
      <div className="h-64 border-b border-control-border">
        <StatusDashboard />
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Signaling Area - 60% width */}
        <div className="flex-1 relative">
          <InteractiveRailwaySignaling />
        </div>
        
        {/* Right Sidebar - 40% width */}
        <div className="w-96 border-l border-control-border flex flex-col h-full">
          {/* AI Recommendations - Top Half */}
          <div className="flex-1 border-b border-control-border min-h-0">
            <AIRecommendations />
          </div>
          
          {/* Alerts Panel - Bottom Half */}
          <div className="flex-1 min-h-0">
            <AlertsPanel />
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {isSimulationModalOpen && <SimulationModal />}
    </div>
  );
}
