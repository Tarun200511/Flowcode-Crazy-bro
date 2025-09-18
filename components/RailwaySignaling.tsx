'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTrainStore } from '@/store/useTrainStore';
import { getHowrahKgpLineData } from '@/lib/demoData';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Gauge, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SignalState {
  id: string;
  position: number; // km position
  state: 'green' | 'yellow' | 'red';
  type: 'home' | 'distant' | 'intermediate';
}

interface TrackSection {
  id: string;
  from: string;
  to: string;
  startKm: number;
  endKm: number;
  status: 'clear' | 'occupied' | 'caution' | 'blocked';
  maxSpeed: number;
}

interface Station {
  id: string;
  name: string;
  code: string;
  km: number;
  platforms: number;
}

interface Train {
  id: string;
  name: string;
  route: string;
  position: { km: number };
  speed: number;
  delay: number;
  direction: 'up' | 'down';
  status: 'on-time' | 'delayed' | 'emergency' | 'maintenance';
}

export function InteractiveRailwaySignaling() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [lineData, setLineData] = useState<{
    stations: Station[];
    trackSections: TrackSection[];
    trains: Train[];
  } | null>(null);
  
  const [signals, setSignals] = useState<SignalState[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({ visible: false, x: 0, y: 0, content: null });
  
  // Pan and zoom state
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const { addAlert } = useTrainStore();

  useEffect(() => {
    // Initialize Howrah-KGP line data
    const data = getHowrahKgpLineData();
    setLineData(data);

    // Generate signals at stations and intermediate points
    const generatedSignals: SignalState[] = [];
    data.stations.forEach((station, index) => {
      // Home signal at each station
      generatedSignals.push({
        id: `${station.code}-HOME`,
        position: station.km,
        state: getSignalState(station.km, data.trains, data.trackSections),
        type: 'home'
      });

      // Distant signal 1km before each major station
      if (station.platforms > 2 && station.km > 1) {
        generatedSignals.push({
          id: `${station.code}-DIST`,
          position: station.km - 1,
          state: getDistantSignalState(station.km, data.trains, data.trackSections),
          type: 'distant'
        });
      }
    });

    // Intermediate signals every 10km
    for (let km = 10; km < 100; km += 10) {
      if (!data.stations.some(s => Math.abs(s.km - km) < 2)) {
        generatedSignals.push({
          id: `INT-${km}`,
          position: km,
          state: getSignalState(km, data.trains, data.trackSections),
          type: 'intermediate'
        });
      }
    }

    setSignals(generatedSignals);

    // Update signals every 5 seconds
    const interval = setInterval(() => {
      updateSignals(data.trains, data.trackSections);
      updateTrainPositions();
    }, 5000);

    return () => clearInterval(interval);
  }, [addAlert]);

  const getSignalState = (position: number, trains: Train[], sections: TrackSection[]): 'green' | 'yellow' | 'red' => {
    // Check if any train is within 2km ahead
    const nearbyTrains = trains.filter(train => 
      Math.abs(train.position.km - position) < 2 && train.speed > 0
    );

    if (nearbyTrains.length > 0) return 'red';

    // Check track section status
    const section = sections.find(s => position >= s.startKm && position <= s.endKm);
    if (section?.status === 'occupied') return 'red';
    if (section?.status === 'caution') return 'yellow';

    return 'green';
  };

  const getDistantSignalState = (stationKm: number, trains: Train[], sections: TrackSection[]): 'green' | 'yellow' | 'red' => {
    const homeSignalState = getSignalState(stationKm, trains, sections);
    if (homeSignalState === 'red') return 'yellow';
    if (homeSignalState === 'yellow') return 'yellow';
    return 'green';
  };

  const updateSignals = (trains: Train[], sections: TrackSection[]) => {
    setSignals(prevSignals => 
      prevSignals.map(signal => ({
        ...signal,
        state: signal.type === 'distant' 
          ? getDistantSignalState(signal.position + 1, trains, sections)
          : getSignalState(signal.position, trains, sections)
      }))
    );
  };

  const updateTrainPositions = () => {
    if (!lineData) return;
    
    setLineData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        trains: prev.trains.map(train => {
          if (train.status === 'emergency' || train.speed === 0) return train;
          
          // Move train based on speed and direction
          const movement = (train.speed / 60) * (5 / 60); // km moved in 5 seconds
          const newKm = train.direction === 'down' 
            ? Math.min(100, train.position.km + movement)
            : Math.max(0, train.position.km - movement);
            
          return {
            ...train,
            position: { km: newKm }
          };
        })
      };
    });
  };

  // Pan and zoom functions
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({ x: e.clientX, y: e.clientY });
        setLastPanPoint({ x: viewBox.x, y: viewBox.y });
      }
    }
  }, [viewBox]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      const deltaX = (dragStart.x - e.clientX) * (viewBox.width / 1000);
      const deltaY = (dragStart.y - e.clientY) * (viewBox.height / 300);
      
      setViewBox(prev => ({
        ...prev,
        x: Math.max(0, Math.min(1000 - prev.width, lastPanPoint.x + deltaX)),
        y: Math.max(0, Math.min(300 - prev.height, lastPanPoint.y + deltaY))
      }));
    }
  }, [isDragging, dragStart, lastPanPoint, viewBox]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const rect = svgRef.current?.getBoundingClientRect();
    
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Convert mouse position to SVG coordinates
      const svgX = (mouseX / rect.width) * viewBox.width + viewBox.x;
      const svgY = (mouseY / rect.height) * viewBox.height + viewBox.y;
      
      setViewBox(prev => {
        const newWidth = Math.max(200, Math.min(1000, prev.width * zoomFactor));
        const newHeight = Math.max(100, Math.min(300, prev.height * zoomFactor));
        
        const newX = Math.max(0, Math.min(1000 - newWidth, svgX - (svgX - prev.x) * (newWidth / prev.width)));
        const newY = Math.max(0, Math.min(300 - newHeight, svgY - (svgY - prev.y) * (newHeight / prev.height)));
        
        return { x: newX, y: newY, width: newWidth, height: newHeight };
      });
    }
  }, [viewBox]);

  const zoomIn = () => {
    setViewBox(prev => {
      const newWidth = Math.max(200, prev.width * 0.8);
      const newHeight = Math.max(100, prev.height * 0.8);
      const newX = Math.max(0, Math.min(1000 - newWidth, prev.x + (prev.width - newWidth) / 2));
      const newY = Math.max(0, Math.min(300 - newHeight, prev.y + (prev.height - newHeight) / 2));
      return { x: newX, y: newY, width: newWidth, height: newHeight };
    });
  };

  const zoomOut = () => {
    setViewBox(prev => {
      const newWidth = Math.min(1000, prev.width * 1.25);
      const newHeight = Math.min(300, prev.height * 1.25);
      const newX = Math.max(0, Math.min(1000 - newWidth, prev.x - (newWidth - prev.width) / 2));
      const newY = Math.max(0, Math.min(300 - newHeight, prev.y - (newHeight - prev.height) / 2));
      return { x: newX, y: newY, width: newWidth, height: newHeight };
    });
  };

  const resetView = () => {
    setViewBox({ x: 0, y: 0, width: 1000, height: 300 });
  };

  const zoomToSection = (startKm: number, endKm: number) => {
    const startX = (startKm / 100) * 1000;
    const endX = (endKm / 100) * 1000;
    const sectionWidth = endX - startX;
    const padding = sectionWidth * 0.2;
    
    setViewBox({
      x: Math.max(0, startX - padding),
      y: 50,
      width: Math.min(1000, sectionWidth + padding * 2),
      height: 200
    });
  };

  // Tooltip functions
  const showTooltip = (e: React.MouseEvent, content: React.ReactNode) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left + 10,
        y: e.clientY - rect.top - 10,
        content
      });
    }
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Convert km to SVG x coordinate
  const kmToX = (km: number) => (km / 100) * 1000;

  const getSignalColor = (state: 'green' | 'yellow' | 'red') => {
    switch (state) {
      case 'green': return '#00ff00';
      case 'yellow': return '#ffff00';
      case 'red': return '#ff0000';
    }
  };

  const getTrainColor = (status: string) => {
    switch (status) {
      case 'on-time': return '#00ff88';
      case 'delayed': return '#ff8800';
      case 'emergency': return '#ff3333';
      case 'maintenance': return '#ffff00';
      default: return '#666666';
    }
  };

  if (!lineData) return <div className="flex items-center justify-center h-full text-white">Loading railway data...</div>;

  return (
    <div className="h-full bg-control-panel p-4 relative">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Interactive Railway Signaling - Howrah-Kharagpur Line
          </h2>
          <div className="text-sm text-gray-400">
            Click and drag to pan • Scroll to zoom • Hover for details • {lineData.trains.length} trains active
          </div>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={zoomIn} className="p-2">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={zoomOut} className="p-2">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={resetView} className="p-2">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main SVG Visualization */}
      <div className="bg-gray-900 rounded-lg overflow-hidden relative" style={{ height: 'calc(100% - 200px)' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#333" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="1000" height="300" fill="url(#grid)" />

          {/* Main track lines */}
          <line x1="0" y1="120" x2="1000" y2="120" stroke="#666" strokeWidth="4" />
          <line x1="0" y1="160" x2="1000" y2="160" stroke="#666" strokeWidth="4" />

          {/* Track sections with status colors */}
          {lineData.trackSections.map((section) => {
            const startX = kmToX(section.startKm);
            const endX = kmToX(section.endKm);
            const sectionColor = section.status === 'occupied' ? '#ff4444' : 
                               section.status === 'caution' ? '#ffaa00' : '#00aa00';
            
            return (
              <g key={section.id}>
                <line 
                  x1={startX} y1="112" 
                  x2={endX} y2="112" 
                  stroke={sectionColor} 
                  strokeWidth="8" 
                  opacity="0.7"
                  className="cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, (
                    <div className="bg-control-panel border border-control-border rounded p-2 text-xs">
                      <div className="font-semibold text-white">{section.id}</div>
                      <div className="text-gray-400">Status: {section.status}</div>
                      <div className="text-gray-400">Max Speed: {section.maxSpeed} km/h</div>
                      <div className="text-gray-400">Length: {section.endKm - section.startKm} km</div>
                    </div>
                  ))}
                  onMouseLeave={hideTooltip}
                  onClick={() => zoomToSection(section.startKm, section.endKm)}
                />
                <line 
                  x1={startX} y1="168" 
                  x2={endX} y2="168" 
                  stroke={sectionColor} 
                  strokeWidth="8" 
                  opacity="0.7"
                />
                
                {/* Section label */}
                <text 
                  x={(startX + endX) / 2} 
                  y="40" 
                  fill="#ccc" 
                  fontSize="10" 
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {section.id}
                </text>
              </g>
            );
          })}

          {/* Stations */}
          {lineData.stations.map((station) => {
            const x = kmToX(station.km);
            return (
              <g key={station.id}>
                {/* Station marker */}
                <rect 
                  x={x-3} 
                  y="100" 
                  width="6" 
                  height="80" 
                  fill="#333" 
                  stroke="#666" 
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, (
                    <div className="bg-control-panel border border-control-border rounded p-2 text-xs">
                      <div className="font-semibold text-white">{station.name}</div>
                      <div className="text-gray-400">{station.code} • {station.platforms} platforms</div>
                      <div className="text-gray-400">Distance: {station.km} km</div>
                    </div>
                  ))}
                  onMouseLeave={hideTooltip}
                  onClick={() => zoomToSection(Math.max(0, station.km - 5), Math.min(100, station.km + 5))}
                />
                
                {/* Station code */}
                <text x={x} y="195" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">
                  {station.code}
                </text>
                
                {/* Station name */}
                <text x={x} y="208" fill="#aaa" fontSize="9" textAnchor="middle">
                  {station.name.split(' ')[0]}
                </text>
                
                {/* KM marker */}
                <text x={x} y="25" fill="#888" fontSize="8" textAnchor="middle">
                  {station.km}km
                </text>
              </g>
            );
          })}

          {/* Signals */}
          {signals.map((signal) => {
            const x = kmToX(signal.position);
            const y = signal.type === 'home' ? 85 : 
                     signal.type === 'distant' ? 195 : 140;
            
            return (
              <g key={signal.id}>
                {/* Signal post */}
                <line x1={x} y1={y} x2={x} y2={y+15} stroke="#444" strokeWidth="2" />
                
                {/* Signal light */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="5" 
                  fill={getSignalColor(signal.state)}
                  stroke="#000"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onMouseEnter={(e) => showTooltip(e, (
                    <div className="bg-control-panel border border-control-border rounded p-2 text-xs">
                      <div className="font-semibold text-white">{signal.id}</div>
                      <div className="text-gray-400">Type: {signal.type}</div>
                      <div className="text-gray-400">State: {signal.state.toUpperCase()}</div>
                      <div className="text-gray-400">Position: {signal.position} km</div>
                    </div>
                  ))}
                  onMouseLeave={hideTooltip}
                />
                
                {/* Signal ID */}
                <text 
                  x={x} 
                  y={y-10} 
                  fill="#ccc" 
                  fontSize="7" 
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {signal.id.split('-')[1] || signal.id}
                </text>
              </g>
            );
          })}

          {/* Trains */}
          {lineData.trains.map((train) => {
            const x = kmToX(train.position.km);
            const y = train.direction === 'down' ? 120 : 160;
            
            return (
              <g key={train.id}>
                {/* Train marker */}
                <rect 
                  x={x-8} 
                  y={y-4} 
                  width="16" 
                  height="8" 
                  fill={getTrainColor(train.status)}
                  stroke="#fff"
                  strokeWidth="2"
                  rx="3"
                  className="cursor-pointer hover:stroke-ai-glow"
                  onMouseEnter={(e) => showTooltip(e, (
                    <div className="bg-control-panel border border-control-border rounded p-3 text-xs min-w-[200px]">
                      <div className="font-semibold text-white mb-2">{train.name}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-gray-400">Route:</div>
                          <div className="text-white">{train.route}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Status:</div>
                          <div className={`${train.status === 'on-time' ? 'text-status-green' : 
                                           train.status === 'delayed' ? 'text-status-orange' : 
                                           train.status === 'emergency' ? 'text-status-red' : 'text-yellow-500'}`}>
                            {train.status.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Speed:</div>
                          <div className="text-white">{train.speed} km/h</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Delay:</div>
                          <div className={train.delay > 0 ? 'text-status-orange' : 'text-status-green'}>
                            {train.delay > 0 ? `+${train.delay}` : train.delay}m
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Position:</div>
                          <div className="text-white">{train.position.km.toFixed(1)} km</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Direction:</div>
                          <div className="text-white">{train.direction === 'down' ? '→ KGP' : '← HWH'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  onMouseLeave={hideTooltip}
                  onClick={() => setSelectedTrain(train)}
                />
                
                {/* Train number */}
                <text 
                  x={x} 
                  y={y-8} 
                  fill="#fff" 
                  fontSize="8" 
                  textAnchor="middle"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {train.id.split('-')[1]}
                </text>
                
                {/* Speed indicator */}
                <text 
                  x={x} 
                  y={y+18} 
                  fill="#aaa" 
                  fontSize="7" 
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {train.speed}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div 
            className="absolute z-50 pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.content}
          </div>
        )}
      </div>

      {/* Quick Section Navigation */}
      <div className="mt-4 flex flex-wrap gap-2">
        {lineData.trackSections.map((section) => (
          <Button
            key={section.id}
            size="sm"
            variant="outline"
            onClick={() => zoomToSection(section.startKm, section.endKm)}
            className="text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {section.id}
          </Button>
        ))}
      </div>

      {/* Selected Train Details Panel */}
      {selectedTrain && (
        <div className="absolute top-4 right-4 w-80 bg-control-panel border border-control-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">{selectedTrain.name}</h3>
            <button
              onClick={() => setSelectedTrain(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-400 mb-1">Route</div>
                <div className="text-white">{selectedTrain.route}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Status</div>
                <div className={`${selectedTrain.status === 'on-time' ? 'text-status-green' : 
                                 selectedTrain.status === 'delayed' ? 'text-status-orange' : 
                                 selectedTrain.status === 'emergency' ? 'text-status-red' : 'text-yellow-500'}`}>
                  {selectedTrain.status.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Current Speed</div>
                <div className="text-white flex items-center">
                  <Gauge className="h-4 w-4 mr-1" />
                  {selectedTrain.speed} km/h
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Delay</div>
                <div className={`flex items-center ${selectedTrain.delay > 0 ? 'text-status-orange' : 'text-status-green'}`}>
                  <Clock className="h-4 w-4 mr-1" />
                  {selectedTrain.delay > 0 ? `+${selectedTrain.delay}` : selectedTrain.delay}m
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-gray-400 mb-1">Current Position</div>
              <div className="text-white">{selectedTrain.position.km.toFixed(2)} km from Howrah</div>
            </div>
            
            <div>
              <div className="text-gray-400 mb-1">Direction</div>
              <div className="text-white">
                {selectedTrain.direction === 'down' ? 'Howrah → Kharagpur' : 'Kharagpur → Howrah'}
              </div>
            </div>

            <Button
              onClick={() => zoomToSection(
                Math.max(0, selectedTrain.position.km - 10), 
                Math.min(100, selectedTrain.position.km + 10)
              )}
              className="w-full mt-3"
              size="sm"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Zoom to Train
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
