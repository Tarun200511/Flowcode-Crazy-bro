import { Train, Station, Track, NetworkStats, Agent, AIRecommendation, Alert } from '@/types';
import { generateId } from './utils';

export function initializeDemoData() {
  // Demo stations (major Indian railway stations)
  const stations: Station[] = [
    {
      id: 'NDLS',
      name: 'New Delhi',
      code: 'NDLS',
      position: { lat: 28.6414, lng: 77.2186 },
      platforms: 16,
      congestionLevel: 'high'
    },
    {
      id: 'CSTM',
      name: 'Mumbai CST',
      code: 'CSTM',
      position: { lat: 18.9401, lng: 72.8347 },
      platforms: 18,
      congestionLevel: 'high'
    },
    {
      id: 'HWH',
      name: 'Howrah Junction',
      code: 'HWH',
      position: { lat: 22.5840, lng: 88.3426 },
      platforms: 23,
      congestionLevel: 'medium'
    },
    {
      id: 'MAS',
      name: 'Chennai Central',
      code: 'MAS',
      position: { lat: 13.0827, lng: 80.2707 },
      platforms: 12,
      congestionLevel: 'medium'
    },
    {
      id: 'SBC',
      name: 'Bangalore City',
      code: 'SBC',
      position: { lat: 12.9716, lng: 77.5946 },
      platforms: 10,
      congestionLevel: 'low'
    },
    {
      id: 'PUNE',
      name: 'Pune Junction',
      code: 'PUNE',
      position: { lat: 18.5204, lng: 73.8567 },
      platforms: 6,
      congestionLevel: 'medium'
    },
    {
      id: 'JP',
      name: 'Jaipur Junction',
      code: 'JP',
      position: { lat: 26.9124, lng: 75.7873 },
      platforms: 8,
      congestionLevel: 'low'
    },
    {
      id: 'LKO',
      name: 'Lucknow',
      code: 'LKO',
      position: { lat: 26.8467, lng: 80.9462 },
      platforms: 6,
      congestionLevel: 'medium'
    }
  ];

  // Demo tracks - Major railway corridors
  const tracks: Track[] = [
    {
      id: 'track-1',
      name: 'Delhi-Mumbai Main Line (Golden Quadrilateral)',
      coordinates: [
        [77.2186, 28.6414], // New Delhi
        [78.1828, 26.2183], // Gwalior
        [79.0882, 21.1458], // Nagpur
        [72.8347, 18.9401]  // Mumbai CST
      ],
      status: 'operational',
      congestionLevel: 'high',
      maxSpeed: 130
    },
    {
      id: 'track-2',
      name: 'Delhi-Kolkata Grand Trunk Route',
      coordinates: [
        [77.2186, 28.6414], // New Delhi
        [81.8463, 25.4358], // Prayagraj
        [86.4304, 23.7957], // Dhanbad
        [88.3426, 22.5840]  // Howrah
      ],
      status: 'operational',
      congestionLevel: 'medium',
      maxSpeed: 110
    },
    {
      id: 'track-3',
      name: 'Mumbai-Chennai Coastal Line',
      coordinates: [
        [72.8347, 18.9401], // Mumbai CST
        [73.8567, 18.5204], // Pune
        [75.7139, 15.3173], // Hubli
        [77.5946, 12.9716], // Bangalore
        [80.2707, 13.0827]  // Chennai Central
      ],
      status: 'maintenance',
      congestionLevel: 'low',
      maxSpeed: 100
    },
    {
      id: 'track-4',
      name: 'Delhi-Chennai Central Line',
      coordinates: [
        [77.2186, 28.6414], // New Delhi
        [78.4867, 17.3850], // Hyderabad
        [80.2707, 13.0827]  // Chennai Central
      ],
      status: 'operational',
      congestionLevel: 'medium',
      maxSpeed: 120
    },
    {
      id: 'track-5',
      name: 'Western Railway (Mumbai-Ahmedabad)',
      coordinates: [
        [72.8347, 18.9401], // Mumbai Central
        [73.1812, 22.3072], // Vadodara
        [72.5714, 23.0225]  // Ahmedabad
      ],
      status: 'operational',
      congestionLevel: 'low',
      maxSpeed: 160
    }
  ];

  // Demo trains positioned on realistic railway routes
  const trains: Train[] = [
    {
      id: 'train-12951',
      name: 'Mumbai Rajdhani',
      route: 'Mumbai CST → New Delhi',
      status: 'delayed',
      position: { lat: 21.1458, lng: 79.0882 }, // Nagpur - on Mumbai-Delhi main line
      speed: 95,
      delay: 15,
      eta: '14:30',
      nextStation: 'Nagpur Junction',
      passengers: 1200,
      capacity: 1500,
      direction: 45
    },
    {
      id: 'train-12002',
      name: 'Shatabdi Express',
      route: 'New Delhi → Bhopal',
      status: 'on-time',
      position: { lat: 26.2183, lng: 78.1828 }, // Gwalior - on Delhi-Bhopal route
      speed: 120,
      delay: 0,
      eta: '11:45',
      nextStation: 'Gwalior Junction',
      passengers: 800,
      capacity: 1000,
      direction: 180
    },
    {
      id: 'train-12626',
      name: 'Kerala Express',
      route: 'New Delhi → Thiruvananthapuram',
      status: 'on-time',
      position: { lat: 15.3173, lng: 75.7139 }, // Karnataka - on Delhi-Kerala route
      speed: 85,
      delay: -5,
      eta: '06:20',
      nextStation: 'Hubli Junction',
      passengers: 1400,
      capacity: 1600,
      direction: 225
    },
    {
      id: 'train-12840',
      name: 'Howrah Mail',
      route: 'Mumbai CST → Howrah',
      status: 'delayed',
      position: { lat: 20.9517, lng: 85.0985 }, // Bhubaneswar - on Mumbai-Kolkata route
      speed: 78,
      delay: 25,
      eta: '22:15',
      nextStation: 'Bhubaneswar',
      passengers: 1100,
      capacity: 1300,
      direction: 90
    },
    {
      id: 'train-12434',
      name: 'Chennai Rajdhani',
      route: 'Chennai Central → New Delhi',
      status: 'on-time',
      position: { lat: 17.3850, lng: 78.4867 }, // Hyderabad - on Chennai-Delhi route
      speed: 110,
      delay: 0,
      eta: '05:55',
      nextStation: 'Secunderabad',
      passengers: 900,
      capacity: 1200,
      direction: 315
    },
    {
      id: 'train-19024',
      name: 'Firozpur Janata',
      route: 'Firozpur → Mumbai CST',
      status: 'emergency',
      position: { lat: 23.7957, lng: 86.4304 }, // Dhanbad - emergency stop
      speed: 0,
      delay: 45,
      eta: 'DELAYED',
      nextStation: 'Dhanbad Junction',
      passengers: 1300,
      capacity: 1500,
      direction: 0
    },
    {
      id: 'train-12615',
      name: 'Grand Trunk Express',
      route: 'New Delhi → Chennai Central',
      status: 'on-time',
      position: { lat: 25.4358, lng: 81.8463 }, // Prayagraj - on GT route
      speed: 105,
      delay: 2,
      eta: '18:40',
      nextStation: 'Prayagraj Junction',
      passengers: 1000,
      capacity: 1400,
      direction: 135
    },
    {
      id: 'train-12009',
      name: 'Mumbai-Ahmedabad Shatabdi',
      route: 'Mumbai Central → Ahmedabad',
      status: 'on-time',
      position: { lat: 22.3072, lng: 73.1812 }, // Vadodara - on Western Railway
      speed: 130,
      delay: 0,
      eta: '12:30',
      nextStation: 'Vadodara Junction',
      passengers: 600,
      capacity: 800,
      direction: 0
    }
  ];

  // Calculate network stats
  const networkStats: NetworkStats = {
    totalTrains: trains.length,
    onTimeTrains: trains.filter(t => t.status === 'on-time').length,
    delayedTrains: trains.filter(t => t.status === 'delayed').length,
    emergencyTrains: trains.filter(t => t.status === 'emergency').length,
    averageDelay: Math.round(trains.reduce((sum, t) => sum + Math.max(0, t.delay), 0) / trains.length),
    networkThroughput: 87.5, // percentage
    activeDisruptions: 3,
    congestionHotspots: 2
  };

  // Demo AI agents
  const agents: Agent[] = [
    {
      id: 'agent-collector',
      name: 'Data Collector',
      type: 'data-collector',
      status: 'active',
      lastActivity: new Date().toISOString(),
      processedEvents: 1247,
      accuracy: 98.5
    },
    {
      id: 'agent-scheduler',
      name: 'Schedule Optimizer',
      type: 'scheduler',
      status: 'processing',
      lastActivity: new Date(Date.now() - 30000).toISOString(),
      processedEvents: 856,
      accuracy: 94.2
    },
    {
      id: 'agent-resolver',
      name: 'Conflict Resolver',
      type: 'conflict-resolver',
      status: 'active',
      lastActivity: new Date(Date.now() - 15000).toISOString(),
      processedEvents: 423,
      accuracy: 91.8
    },
    {
      id: 'agent-predictor',
      name: 'Congestion Predictor',
      type: 'predictor',
      status: 'active',
      lastActivity: new Date(Date.now() - 45000).toISOString(),
      processedEvents: 2341,
      accuracy: 96.7
    },
    {
      id: 'agent-coordinator',
      name: 'System Coordinator',
      type: 'coordinator',
      status: 'active',
      lastActivity: new Date(Date.now() - 5000).toISOString(),
      processedEvents: 1876,
      accuracy: 97.3
    }
  ];

  return {
    trains,
    stations,
    tracks,
    networkStats,
    agents
  };
}

export function generateDemoRecommendations(): AIRecommendation[] {
  return [
    {
      id: generateId(),
      agentId: 'agent-resolver',
      agentName: 'HWH-KGP Traffic Controller',
      type: 'priority',
      trainId: 'train-12840',
      affectedTrains: ['train-12840', 'train-58016'],
      title: 'Priority Signal for Howrah Mail at Bagnan',
      description: 'Howrah Mail (25min delay) approaching Bagnan. Grant priority over EMU Local to reduce passenger delay on long-distance service.',
      impact: {
        delayReduction: 8,
        congestionReduction: 12,
        affectedTrains: 2,
        estimatedSavings: 15
      },
      confidence: 94,
      timestamp: new Date().toISOString(),
      status: 'pending',
      urgency: 'high'
    },
    {
      id: generateId(),
      agentId: 'agent-scheduler',
      agentName: 'KGP Section Optimizer',
      type: 'reroute',
      trainId: 'train-18448',
      affectedTrains: ['train-18448', 'train-22512'],
      title: 'Reroute Hirakhand Express via Loop Line',
      description: 'Congestion at Mecheda. Route Hirakhand via loop line to allow Kamakhya Express clear run. Saves 15 minutes overall.',
      impact: {
        delayReduction: 15,
        congestionReduction: 20,
        affectedTrains: 2,
        estimatedSavings: 25
      },
      confidence: 89,
      timestamp: new Date(Date.now() - 180000).toISOString(),
      status: 'pending',
      urgency: 'medium'
    },
    {
      id: generateId(),
      agentId: 'agent-maintenance',
      agentName: 'Track Maintenance AI',
      type: 'maintenance',
      trainId: 'train-58018',
      affectedTrains: ['train-58018'],
      title: 'Goods Train Maintenance at Uluberia',
      description: 'Goods train showing reduced speed (25 kmph). Schedule immediate inspection at Uluberia yard to prevent line blocking.',
      impact: {
        delayReduction: 0,
        congestionReduction: 30,
        affectedTrains: 1,
        estimatedSavings: 45
      },
      confidence: 96,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      status: 'pending',
      urgency: 'high'
    },
    {
      id: generateId(),
      agentId: 'agent-predictor',
      agentName: 'EMU Schedule Optimizer',
      type: 'delay',
      trainId: 'train-58014',
      affectedTrains: ['train-58014', 'train-12872'],
      title: 'Hold EMU at Shalimar for 2 minutes',
      description: 'Ispat Express approaching HWH on time. Brief EMU hold prevents platform congestion and ensures smooth arrival.',
      impact: {
        delayReduction: 5,
        congestionReduction: 18,
        affectedTrains: 2,
        estimatedSavings: 12
      },
      confidence: 91,
      timestamp: new Date(Date.now() - 240000).toISOString(),
      status: 'pending',
      urgency: 'medium'
    }
  ];
}

// Howrah-Kharagpur line stations with realistic positions (~100km route)
export function getHowrahKgpLineData() {
  const stations = [
    { id: 'HWH', name: 'Howrah Junction', code: 'HWH', position: { lat: 22.5840, lng: 88.3426 }, km: 0, platforms: 23 },
    { id: 'SHE', name: 'Shalimar', code: 'SHE', position: { lat: 22.5650, lng: 88.3200 }, km: 8, platforms: 4 },
    { id: 'ULU', name: 'Uluberia', code: 'ULU', position: { lat: 22.4833, lng: 88.1167 }, km: 25, platforms: 3 },
    { id: 'BGA', name: 'Bagnan', code: 'BGA', position: { lat: 22.4667, lng: 88.0833 }, km: 32, platforms: 2 },
    { id: 'MCA', name: 'Mecheda', code: 'MCA', position: { lat: 22.4500, lng: 87.9500 }, km: 45, platforms: 3 },
    { id: 'TMZ', name: 'Tamluk', code: 'TMZ', position: { lat: 22.3000, lng: 87.9167 }, km: 58, platforms: 2 },
    { id: 'HIJ', name: 'Hijli', code: 'HIJ', position: { lat: 22.2833, lng: 87.7167 }, km: 72, platforms: 2 },
    { id: 'MDN', name: 'Midnapore', code: 'MDN', position: { lat: 22.4167, lng: 87.3167 }, km: 85, platforms: 4 },
    { id: 'KGP', name: 'Kharagpur Junction', code: 'KGP', position: { lat: 22.3460, lng: 87.3200 }, km: 100, platforms: 9 }
  ];

  // Track sections with signal blocks
  const trackSections: Array<{
    id: string;
    from: string;
    to: string;
    startKm: number;
    endKm: number;
    status: 'clear' | 'occupied' | 'caution' | 'blocked';
    maxSpeed: number;
  }> = [
    { id: 'HWH-SHE', from: 'HWH', to: 'SHE', startKm: 0, endKm: 8, status: 'clear', maxSpeed: 60 },
    { id: 'SHE-ULU', from: 'SHE', to: 'ULU', startKm: 8, endKm: 25, status: 'occupied', maxSpeed: 100 },
    { id: 'ULU-BGA', from: 'ULU', to: 'BGA', startKm: 25, endKm: 32, status: 'clear', maxSpeed: 110 },
    { id: 'BGA-MCA', from: 'BGA', to: 'MCA', startKm: 32, endKm: 45, status: 'clear', maxSpeed: 120 },
    { id: 'MCA-TMZ', from: 'MCA', to: 'TMZ', startKm: 45, endKm: 58, status: 'occupied', maxSpeed: 100 },
    { id: 'TMZ-HIJ', from: 'TMZ', to: 'HIJ', startKm: 58, endKm: 72, status: 'caution', maxSpeed: 80 },
    { id: 'HIJ-MDN', from: 'HIJ', to: 'MDN', startKm: 72, endKm: 85, status: 'clear', maxSpeed: 130 },
    { id: 'MDN-KGP', from: 'MDN', to: 'KGP', startKm: 85, endKm: 100, status: 'occupied', maxSpeed: 100 }
  ];

  // 20+ trains on the Howrah-KGP line
  const trains: Array<{
    id: string;
    name: string;
    route: string;
    position: { km: number };
    speed: number;
    delay: number;
    direction: 'up' | 'down';
    status: 'on-time' | 'delayed' | 'emergency' | 'maintenance';
  }> = [
    { id: 'train-18030', name: 'SHM Express', route: 'HWH-KGP', position: { km: 15 }, speed: 85, delay: 5, direction: 'down', status: 'on-time' },
    { id: 'train-12860', name: 'Gitanjali Exp', route: 'HWH-KGP', position: { km: 67 }, speed: 95, delay: 0, direction: 'down', status: 'on-time' },
    { id: 'train-12810', name: 'HWH-KGP Pass', route: 'HWH-KGP', position: { km: 38 }, speed: 60, delay: 12, direction: 'down', status: 'delayed' },
    { id: 'train-18410', name: 'Prasanti Exp', route: 'KGP-HWH', position: { km: 78 }, speed: 105, delay: 0, direction: 'up', status: 'on-time' },
    { id: 'train-12020', name: 'Shatabdi Exp', route: 'HWH-KGP', position: { km: 92 }, speed: 120, delay: -3, direction: 'down', status: 'on-time' },
    { id: 'train-58012', name: 'HWH-KGP Pass', route: 'HWH-KGP', position: { km: 22 }, speed: 45, delay: 8, direction: 'down', status: 'delayed' },
    { id: 'train-12834', name: 'ADI HWH Exp', route: 'KGP-HWH', position: { km: 55 }, speed: 90, delay: 15, direction: 'up', status: 'delayed' },
    { id: 'train-22890', name: 'Digha Express', route: 'HWH-KGP', position: { km: 73 }, speed: 85, delay: 0, direction: 'down', status: 'on-time' },
    { id: 'train-18006', name: 'KGP-HWH Exp', route: 'KGP-HWH', position: { km: 45 }, speed: 80, delay: 20, direction: 'up', status: 'delayed' },
    { id: 'train-12802', name: 'Purushottam', route: 'HWH-KGP', position: { km: 88 }, speed: 110, delay: 0, direction: 'down', status: 'on-time' },
    { id: 'train-58014', name: 'Local Pass', route: 'HWH-KGP', position: { km: 5 }, speed: 35, delay: 3, direction: 'down', status: 'on-time' },
    { id: 'train-12704', name: 'Falaknuma', route: 'KGP-HWH', position: { km: 95 }, speed: 100, delay: 10, direction: 'up', status: 'delayed' },
    { id: 'train-18420', name: 'Jagannath', route: 'HWH-KGP', position: { km: 62 }, speed: 95, delay: 0, direction: 'down', status: 'on-time' },
    { id: 'train-12816', name: 'Nandan Kanan', route: 'KGP-HWH', position: { km: 28 }, speed: 85, delay: 5, direction: 'up', status: 'on-time' },
    { id: 'train-58016', name: 'EMU Local', route: 'HWH-KGP', position: { km: 18 }, speed: 40, delay: 0, direction: 'down', status: 'on-time' },
    { id: 'train-12906', name: 'Porbandar', route: 'KGP-HWH', position: { km: 82 }, speed: 90, delay: 8, direction: 'up', status: 'delayed' },
    { id: 'train-22512', name: 'Kamakhya', route: 'HWH-KGP', position: { km: 48 }, speed: 100, delay: 0, direction: 'down', status: 'on-time' },
    { id: 'train-12840', name: 'Howrah Mail', route: 'KGP-HWH', position: { km: 65 }, speed: 85, delay: 25, direction: 'up', status: 'delayed' },
    { id: 'train-18448', name: 'Hirakhand', route: 'HWH-KGP', position: { km: 35 }, speed: 75, delay: 12, direction: 'down', status: 'delayed' },
    { id: 'train-12872', name: 'Ispat Express', route: 'KGP-HWH', position: { km: 12 }, speed: 95, delay: 0, direction: 'up', status: 'on-time' },
    { id: 'train-58018', name: 'Goods Train', route: 'HWH-KGP', position: { km: 58 }, speed: 25, delay: 0, direction: 'down', status: 'maintenance' },
    { id: 'train-12254', name: 'ANGA Express', route: 'KGP-HWH', position: { km: 90 }, speed: 105, delay: 0, direction: 'up', status: 'on-time' },
    { id: 'train-18016', name: 'Chhapra Exp', route: 'HWH-KGP', position: { km: 75 }, speed: 0, delay: 45, direction: 'down', status: 'emergency' }
  ];

  return { stations, trackSections, trains };
}

export function generateDemoAlerts(): Alert[] {
  return [
    {
      id: generateId(),
      type: 'weather',
      severity: 'warning',
      title: 'Heavy Rainfall Alert',
      message: 'Heavy rainfall detected near Kanpur region. Speed restrictions may apply.',
      location: 'Kanpur Division',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      affectedTrains: ['train-12615', 'train-12002']
    },
    {
      id: generateId(),
      type: 'emergency',
      severity: 'critical',
      title: 'Train Emergency Stop',
      message: 'Firozpur Janata has made an emergency stop due to technical issues.',
      location: 'Dhanbad Junction',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      acknowledged: false,
      affectedTrains: ['train-19024']
    },
    {
      id: generateId(),
      type: 'maintenance',
      severity: 'info',
      title: 'Scheduled Track Maintenance',
      message: 'Track maintenance scheduled on Mumbai-Chennai line from 02:00 to 06:00.',
      location: 'Mumbai-Chennai Line',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      acknowledged: true,
      affectedTrains: ['train-12626']
    },
    {
      id: generateId(),
      type: 'system',
      severity: 'warning',
      title: 'Signal System Alert',
      message: 'Automatic signaling system showing caution between Tamluk-Hijli section.',
      location: 'TMZ-HIJ Section',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      acknowledged: false,
      affectedTrains: ['train-58018', 'train-22890']
    },
    {
      id: generateId(),
      type: 'emergency',
      severity: 'critical',
      title: 'Emergency Brake Applied',
      message: 'Chhapra Express has applied emergency brakes near Hijli due to track obstruction.',
      location: 'Near Hijli Station',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      acknowledged: false,
      affectedTrains: ['train-18016']
    }
  ];
}
