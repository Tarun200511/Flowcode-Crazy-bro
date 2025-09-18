'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTrainStore } from '@/store/useTrainStore';
import { Train } from '@/types';
import { getStatusBgColor, formatDelay } from '@/lib/utils';

// Mapbox token - for demo, we'll use a public token or fallback to custom map
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function TrainMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  
  const { trains, stations, tracks, selectedTrain, selectTrain, mapCenter, mapZoom, setMapView } = useTrainStore();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (MAPBOX_TOKEN) {
      // Use real Mapbox if token is available
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: mapCenter,
        zoom: mapZoom,
        pitch: 0,
        bearing: 0
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);
        
        // Add railway tracks as lines
        tracks.forEach((track, index) => {
          if (track.coordinates && track.coordinates.length >= 2) {
            map.current?.addSource(`track-${index}`, {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {
                  name: track.name,
                  status: track.status
                },
                geometry: {
                  type: 'LineString',
                  coordinates: track.coordinates
                }
              }
            });

            map.current?.addLayer({
              id: `track-${index}`,
              type: 'line',
              source: `track-${index}`,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': track.status === 'maintenance' ? '#ff8800' : '#555555',
                'line-width': 3,
                'line-dasharray': track.status === 'maintenance' ? [2, 2] : [1, 0]
              }
            });
          }
        });
      });

      map.current.on('click', (e) => {
        setMapView([e.lngLat.lng, e.lngLat.lat], map.current?.getZoom() || mapZoom);
      });

    } else {
      // Fallback to custom map implementation
      const mapDiv = mapContainer.current;
      mapDiv.style.background = 'linear-gradient(135deg, #1a1a1b 0%, #2a2a2b 100%)';
      mapDiv.style.position = 'relative';
      mapDiv.style.overflow = 'hidden';
      
      // Add India outline (simplified)
      const indiaOutline = document.createElement('div');
      indiaOutline.style.position = 'absolute';
      indiaOutline.style.top = '20%';
      indiaOutline.style.left = '30%';
      indiaOutline.style.width = '40%';
      indiaOutline.style.height = '60%';
      indiaOutline.style.border = '2px solid #444';
      indiaOutline.style.borderRadius = '20px 20px 40px 20px';
      indiaOutline.style.opacity = '0.3';
      mapDiv.appendChild(indiaOutline);
      
      setIsMapLoaded(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapCenter, mapZoom, tracks]);

  // Update train markers
  useEffect(() => {
    if (!isMapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    if (MAPBOX_TOKEN && map.current) {
      // Use Mapbox markers
      trains.forEach(train => {
        const el = document.createElement('div');
        el.className = 'train-marker';
        el.style.backgroundColor = getStatusColor(train.status);
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([train.position.lng, train.position.lat])
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="bg-control-panel text-white p-2 rounded">
              <div class="font-semibold">${train.name}</div>
              <div class="text-gray-400 text-sm">${train.route}</div>
              <div class="text-sm">Status: <span class="${getStatusTextColor(train.status)}">${train.status.toUpperCase()}</span></div>
              <div class="text-sm">Delay: ${formatDelay(train.delay)}</div>
            </div>
          `);

        el.addEventListener('click', () => {
          selectTrain(train);
          marker.setPopup(popup).togglePopup();
        });

        markersRef.current[train.id] = marker;
      });

      // Add station markers
      stations.forEach(station => {
        const el = document.createElement('div');
        el.style.backgroundColor = '#333';
        el.style.border = '2px solid #666';
        el.style.width = '8px';
        el.style.height = '8px';
        el.style.borderRadius = '50%';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([station.position.lng, station.position.lat])
          .addTo(map.current!);

        const popup = new mapboxgl.Popup({ offset: 15 })
          .setHTML(`
            <div class="bg-control-panel text-white p-2 rounded">
              <div class="font-semibold">${station.name}</div>
              <div class="text-gray-400 text-sm">${station.code} • ${station.platforms} platforms</div>
            </div>
          `);

        el.addEventListener('click', () => {
          marker.setPopup(popup).togglePopup();
        });
      });

    } else if (mapContainer.current) {
      // Use custom implementation (existing code)
      // Clear existing content for custom map
      const existingElements = mapContainer.current?.querySelectorAll('.train-marker, .station-marker, svg');
      existingElements?.forEach(el => el.remove());

      // Add railway tracks first (before trains)
      tracks.forEach(track => {
        if (track.coordinates && track.coordinates.length >= 2) {
          // Create SVG for track lines
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.style.position = 'absolute';
          svg.style.top = '0';
          svg.style.left = '0';
          svg.style.width = '100%';
          svg.style.height = '100%';
          svg.style.pointerEvents = 'none';
          svg.style.zIndex = '1';
          
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          let pathData = '';
          
          track.coordinates.forEach((coord, index) => {
            const x = ((coord[0] - 68) / (97 - 68)) * 100;
            const y = ((37 - coord[1]) / (37 - 8)) * 100;
            
            if (index === 0) {
              pathData += `M ${x} ${y}`;
            } else {
              pathData += ` L ${x} ${y}`;
            }
          });
          
          path.setAttribute('d', pathData);
          path.setAttribute('stroke', track.status === 'maintenance' ? '#ff8800' : '#555');
          path.setAttribute('stroke-width', '3');
          path.setAttribute('stroke-dasharray', track.status === 'maintenance' ? '8,4' : 'none');
          path.setAttribute('fill', 'none');
          path.setAttribute('opacity', '0.8');
          
          svg.appendChild(path);
          mapContainer.current?.appendChild(svg);
        }
      });

      // Add station markers
      stations.forEach(station => {
        const stationEl = document.createElement('div');
        stationEl.className = 'station-marker';
        stationEl.style.width = '12px';
        stationEl.style.height = '12px';
        stationEl.style.backgroundColor = '#333';
        stationEl.style.border = '2px solid #666';
        stationEl.style.borderRadius = '50%';
        stationEl.style.position = 'absolute';
        stationEl.style.zIndex = '5';
        stationEl.style.cursor = 'pointer';
        
        const x = ((station.position.lng - 68) / (97 - 68)) * 100;
        const y = ((37 - station.position.lat) / (37 - 8)) * 100;
        
        stationEl.style.left = `${Math.max(0, Math.min(100, x))}%`;
        stationEl.style.top = `${Math.max(0, Math.min(100, y))}%`;
        stationEl.style.transform = 'translate(-50%, -50%)';
        
        // Add station name tooltip
        stationEl.addEventListener('mouseenter', () => {
          const tooltip = document.createElement('div');
          tooltip.className = 'absolute bg-control-panel border border-control-border rounded px-2 py-1 text-xs text-white z-30';
          tooltip.style.left = '15px';
          tooltip.style.top = '-25px';
          tooltip.style.whiteSpace = 'nowrap';
          tooltip.innerHTML = `
            <div class="font-semibold">${station.name}</div>
            <div class="text-gray-400">${station.code} • ${station.platforms} platforms</div>
          `;
          stationEl.appendChild(tooltip);
        });
        
        stationEl.addEventListener('mouseleave', () => {
          const tooltip = stationEl.querySelector('.absolute');
          if (tooltip) {
            tooltip.remove();
          }
        });
        
        mapContainer.current?.appendChild(stationEl);
      });

      // Add train markers
      trains.forEach(train => {
        const markerEl = document.createElement('div');
        markerEl.className = 'train-marker cursor-pointer';
        markerEl.style.width = '12px';
        markerEl.style.height = '12px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.border = '2px solid white';
        markerEl.style.backgroundColor = getStatusColor(train.status);
        markerEl.style.position = 'absolute';
        markerEl.style.zIndex = '10';
        
        // Position based on train coordinates (simplified positioning)
        const x = ((train.position.lng - 68) / (97 - 68)) * 100; // Normalize longitude
        const y = ((37 - train.position.lat) / (37 - 8)) * 100;   // Normalize latitude (inverted)
        
        markerEl.style.left = `${Math.max(0, Math.min(100, x))}%`;
        markerEl.style.top = `${Math.max(0, Math.min(100, y))}%`;
        
        // Add click handler
        markerEl.addEventListener('click', () => {
          selectTrain(train);
        });
        
        // Add hover effect
        markerEl.addEventListener('mouseenter', () => {
          markerEl.style.transform = 'scale(1.5)';
          markerEl.style.zIndex = '20';
          
          // Show tooltip
          const tooltip = document.createElement('div');
          tooltip.className = 'absolute bg-control-panel border border-control-border rounded px-2 py-1 text-xs text-white z-30';
          tooltip.style.left = '20px';
          tooltip.style.top = '-30px';
          tooltip.innerHTML = `
            <div class="font-semibold">${train.name}</div>
            <div class="text-gray-400">${train.route}</div>
            <div class="${getStatusTextColor(train.status)}">${formatDelay(train.delay)}</div>
          `;
          markerEl.appendChild(tooltip);
        });
        
        markerEl.addEventListener('mouseleave', () => {
          markerEl.style.transform = 'scale(1)';
          markerEl.style.zIndex = '10';
          const tooltip = markerEl.querySelector('.absolute');
          if (tooltip) {
            tooltip.remove();
          }
        });
        
        mapContainer.current?.appendChild(markerEl);
      });
    }

  }, [trains, stations, tracks, isMapLoaded, selectTrain, MAPBOX_TOKEN]);

  function getStatusColor(status: string): string {
    switch (status) {
      case 'on-time': return '#00ff88';
      case 'delayed': return '#ff8800';
      case 'emergency': return '#ff3333';
      case 'maintenance': return '#ffff00';
      default: return '#666666';
    }
  }

  function getStatusTextColor(status: string): string {
    switch (status) {
      case 'on-time': return 'text-status-green';
      case 'delayed': return 'text-status-orange';
      case 'emergency': return 'text-status-red';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  }

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="h-full w-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="mission-control-panel p-3">
          <h3 className="text-sm font-semibold text-white mb-2">Railway Network Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-status-green"></div>
              <span className="text-gray-300">On Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-status-orange"></div>
              <span className="text-gray-300">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-status-red"></div>
              <span className="text-gray-300">Emergency</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">Maintenance</span>
            </div>
            <div className="border-t border-control-border my-2"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-600 border border-gray-400"></div>
              <span className="text-gray-300">Major Stations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-gray-600"></div>
              <span className="text-gray-300">Railway Lines</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-status-orange" style={{borderTop: '1px dashed #ff8800'}}></div>
              <span className="text-gray-300">Under Maintenance</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selected Train Info */}
      {selectedTrain && (
        <div className="absolute top-4 right-4 w-80">
          <div className="mission-control-panel">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{selectedTrain.name}</h3>
              <button
                onClick={() => selectTrain(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span className="text-white">{selectedTrain.route}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={getStatusTextColor(selectedTrain.status)}>
                  {selectedTrain.status.toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Delay:</span>
                <span className={selectedTrain.delay > 0 ? 'text-status-orange' : 'text-status-green'}>
                  {formatDelay(selectedTrain.delay)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-white">{selectedTrain.speed} km/h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Next Station:</span>
                <span className="text-white">{selectedTrain.nextStation}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Passengers:</span>
                <span className="text-white">
                  {selectedTrain.passengers}/{selectedTrain.capacity}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">ETA:</span>
                <span className="text-white">{selectedTrain.eta}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Network Status Overlay */}
      <div className="absolute bottom-4 left-4">
        <div className="mission-control-panel p-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="status-indicator status-green"></div>
            <span className="text-gray-300">Network Status: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
