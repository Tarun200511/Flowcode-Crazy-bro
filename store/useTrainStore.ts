import { create } from 'zustand';
import { Train, Station, Track, AIRecommendation, NetworkStats, Alert, SimulationResult, Agent } from '@/types';

interface TrainStore {
  // Data
  trains: Train[];
  stations: Station[];
  tracks: Track[];
  recommendations: AIRecommendation[];
  networkStats: NetworkStats;
  alerts: Alert[];
  agents: Agent[];
  simulationResults: SimulationResult[];
  
  // UI State
  selectedTrain: Train | null;
  selectedRecommendation: AIRecommendation | null;
  isSimulationModalOpen: boolean;
  mapCenter: [number, number];
  mapZoom: number;
  
  // WebSocket connection
  isConnected: boolean;
  
  // Actions
  setTrains: (trains: Train[]) => void;
  updateTrain: (trainId: string, updates: Partial<Train>) => void;
  setStations: (stations: Station[]) => void;
  setTracks: (tracks: Track[]) => void;
  addRecommendation: (recommendation: AIRecommendation) => void;
  updateRecommendation: (id: string, updates: Partial<AIRecommendation>) => void;
  removeRecommendation: (id: string) => void;
  setNetworkStats: (stats: NetworkStats) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  clearAllAlerts: () => void;
  setAgents: (agents: Agent[]) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  addSimulationResult: (result: SimulationResult) => void;
  
  // UI Actions
  selectTrain: (train: Train | null) => void;
  selectRecommendation: (recommendation: AIRecommendation | null) => void;
  setSimulationModalOpen: (open: boolean) => void;
  setMapView: (center: [number, number], zoom: number) => void;
  setConnectionStatus: (connected: boolean) => void;
}

export const useTrainStore = create<TrainStore>((set, get) => ({
  // Initial state
  trains: [],
  stations: [],
  tracks: [],
  recommendations: [],
  networkStats: {
    totalTrains: 0,
    onTimeTrains: 0,
    delayedTrains: 0,
    emergencyTrains: 0,
    averageDelay: 0,
    networkThroughput: 0,
    activeDisruptions: 0,
    congestionHotspots: 0,
  },
  alerts: [],
  agents: [],
  simulationResults: [],
  
  selectedTrain: null,
  selectedRecommendation: null,
  isSimulationModalOpen: false,
  mapCenter: [77.2090, 28.6139], // Delhi coordinates
  mapZoom: 6,
  
  isConnected: false,
  
  // Actions
  setTrains: (trains) => set({ trains }),
  
  updateTrain: (trainId, updates) => set((state) => ({
    trains: state.trains.map(train => 
      train.id === trainId ? { ...train, ...updates } : train
    )
  })),
  
  setStations: (stations) => set({ stations }),
  
  setTracks: (tracks) => set({ tracks }),
  
  addRecommendation: (recommendation) => set((state) => ({
    recommendations: [recommendation, ...state.recommendations]
  })),
  
  updateRecommendation: (id, updates) => set((state) => ({
    recommendations: state.recommendations.map(rec => 
      rec.id === id ? { ...rec, ...updates } : rec
    )
  })),
  
  removeRecommendation: (id) => set((state) => ({
    recommendations: state.recommendations.filter(rec => rec.id !== id)
  })),
  
  setNetworkStats: (networkStats) => set({ networkStats }),
  
  addAlert: (alert) => set((state) => ({
    alerts: [alert, ...state.alerts.slice(0, 49)] // Keep only last 50 alerts
  })),
  
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    )
  })),

  clearAllAlerts: () => set({ alerts: [] }),
  
  setAgents: (agents) => set({ agents }),
  
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
    )
  })),
  
  addSimulationResult: (result) => set((state) => ({
    simulationResults: [result, ...state.simulationResults.slice(0, 9)] // Keep only last 10 results
  })),
  
  // UI Actions
  selectTrain: (train) => set({ selectedTrain: train }),
  
  selectRecommendation: (recommendation) => set({ selectedRecommendation: recommendation }),
  
  setSimulationModalOpen: (open) => set({ isSimulationModalOpen: open }),
  
  setMapView: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
  
  setConnectionStatus: (connected) => set({ isConnected: connected }),
}));
