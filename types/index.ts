export interface Train {
  id: string;
  name: string;
  route: string;
  status: 'on-time' | 'delayed' | 'emergency' | 'maintenance';
  position: {
    lat: number;
    lng: number;
    km?: number; // km position for railway signaling
  };
  speed: number; // km/h
  delay: number; // minutes
  eta: string;
  nextStation: string;
  passengers: number;
  capacity: number;
  direction: number | 'up' | 'down'; // degrees or direction
}

export interface Station {
  id: string;
  name: string;
  code: string;
  position: {
    lat: number;
    lng: number;
  };
  platforms: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface Track {
  id: string;
  name: string;
  coordinates: [number, number][];
  status: 'operational' | 'maintenance' | 'blocked';
  congestionLevel: 'low' | 'medium' | 'high';
  maxSpeed: number;
}

export interface AIRecommendation {
  id: string;
  agentId: string;
  agentName: string;
  type: 'reroute' | 'delay' | 'priority' | 'maintenance' | 'emergency';
  trainId?: string;
  affectedTrains?: string[];
  title: string;
  description: string;
  impact: {
    delayReduction: number; // minutes
    congestionReduction: number; // percentage
    affectedTrains: number;
    estimatedSavings: number; // in minutes across network
  };
  confidence: number; // 0-100
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'simulating';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface NetworkStats {
  totalTrains: number;
  onTimeTrains: number;
  delayedTrains: number;
  emergencyTrains: number;
  averageDelay: number;
  networkThroughput: number;
  activeDisruptions: number;
  congestionHotspots: number;
}

export interface Alert {
  id: string;
  type: 'weather' | 'maintenance' | 'emergency' | 'congestion' | 'system';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  location?: string;
  timestamp: string;
  acknowledged: boolean;
  affectedTrains?: string[];
}

export interface SimulationResult {
  id: string;
  scenario: string;
  parameters: Record<string, any>;
  results: {
    delayChange: number;
    congestionChange: number;
    throughputChange: number;
    affectedTrains: number;
    estimatedImpact: string;
  };
  confidence: number;
  timestamp: string;
}

export interface WeatherData {
  location: string;
  condition: 'clear' | 'rain' | 'heavy-rain' | 'fog' | 'snow';
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number; // km
  impact: 'none' | 'minor' | 'moderate' | 'severe';
}

export interface Agent {
  id: string;
  name: string;
  type: 'data-collector' | 'scheduler' | 'conflict-resolver' | 'predictor' | 'coordinator';
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  processedEvents: number;
  accuracy: number; // percentage
}

export interface SignalState {
  id: string;
  position: number; // km position
  state: 'green' | 'yellow' | 'red';
  type: 'home' | 'distant' | 'intermediate';
  stationCode?: string;
}

export interface TrackSection {
  id: string;
  from: string;
  to: string;
  startKm: number;
  endKm: number;
  status: 'clear' | 'occupied' | 'caution' | 'blocked';
  maxSpeed: number;
}

export interface RailwayLine {
  id: string;
  name: string;
  stations: Station[];
  trackSections: TrackSection[];
  signals: SignalState[];
  totalLength: number;
}
