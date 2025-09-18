import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDelay(minutes: number): string {
  if (minutes === 0) return "On time";
  if (minutes > 0) return `+${minutes}m`;
  return `${minutes}m early`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'on-time': return 'text-status-green';
    case 'delayed': return 'text-status-orange';
    case 'emergency': return 'text-status-red';
    case 'maintenance': return 'text-yellow-500';
    default: return 'text-gray-400';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'on-time': return 'bg-status-green';
    case 'delayed': return 'bg-status-orange';
    case 'emergency': return 'bg-status-red';
    case 'maintenance': return 'bg-yellow-500';
    default: return 'bg-gray-400';
  }
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'low': return 'text-blue-400';
    case 'medium': return 'text-yellow-400';
    case 'high': return 'text-orange-400';
    case 'critical': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

export function getAlertIcon(type: string): string {
  switch (type) {
    case 'weather': return '🌧️';
    case 'maintenance': return '🔧';
    case 'emergency': return '🚨';
    case 'congestion': return '⚠️';
    case 'system': return '💻';
    default: return 'ℹ️';
  }
}

export function interpolatePosition(
  start: [number, number],
  end: [number, number],
  progress: number
): [number, number] {
  return [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress
  ];
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}
