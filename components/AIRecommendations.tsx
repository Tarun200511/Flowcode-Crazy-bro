'use client';

import { useEffect } from 'react';
import { Bot, CheckCircle, XCircle, PlayCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrainStore } from '@/store/useTrainStore';
import { AIRecommendation } from '@/types';
import { formatDateTime, getUrgencyColor, generateId } from '@/lib/utils';
import { generateDemoRecommendations } from '@/lib/demoData';

export function AIRecommendations() {
  const { 
    recommendations, 
    addRecommendation, 
    updateRecommendation, 
    removeRecommendation,
    setSimulationModalOpen,
    selectRecommendation,
    trains,
    updateTrain,
    addAlert
  } = useTrainStore();

  // Initialize with demo recommendations
  useEffect(() => {
    if (recommendations.length === 0) {
      const demoRecs = generateDemoRecommendations();
      demoRecs.forEach(rec => addRecommendation(rec));
    }

    // Simulate new recommendations coming in
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newRec = generateNewRecommendation();
        addRecommendation(newRec);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [recommendations.length, addRecommendation]);

  const applyRecommendationChanges = (recommendation: AIRecommendation) => {
    // Apply changes based on recommendation type and affected trains
    const affectedTrainIds = recommendation.affectedTrains || [];
    
    switch (recommendation.type) {
      case 'reroute':
        affectedTrainIds.forEach(trainId => {
          const train = trains.find(t => t.id === trainId);
          if (train) {
            // Update train route - no alert generation
            updateTrain(trainId, { 
              status: 'delayed',
              delay: Math.max(0, train.delay + 5) // Add 5 min delay for rerouting
            });
          }
        });
        break;
        
      case 'delay':
        affectedTrainIds.forEach(trainId => {
          const train = trains.find(t => t.id === trainId);
          if (train) {
            updateTrain(trainId, { 
              status: 'delayed',
              delay: train.delay + 10,
              speed: Math.max(20, train.speed - 15) // Reduce speed
            });
          }
        });
        break;
        
      case 'priority':
        affectedTrainIds.forEach(trainId => {
          const train = trains.find(t => t.id === trainId);
          if (train) {
            updateTrain(trainId, { 
              status: 'on-time',
              delay: Math.max(0, train.delay - 5),
              speed: Math.min(120, train.speed + 10) // Increase speed
            });
          }
        });
        break;
        
      case 'maintenance':
        affectedTrainIds.forEach(trainId => {
          const train = trains.find(t => t.id === trainId);
          if (train) {
            updateTrain(trainId, { 
              status: 'maintenance',
              speed: 0
            });
          }
        });
        break;
        
      case 'emergency':
        affectedTrainIds.forEach(trainId => {
          const train = trains.find(t => t.id === trainId);
          if (train) {
            updateTrain(trainId, { 
              status: 'emergency',
              speed: 0
            });
          }
        });
        break;
    }
  };

  const handleAccept = (recommendation: AIRecommendation) => {
    // First update status to simulating
    updateRecommendation(recommendation.id, { status: 'simulating' });
    
    // Run simulation first
    selectRecommendation(recommendation);
    setSimulationModalOpen(true);
    
    // After simulation modal closes, mark as accepted and apply changes
    setTimeout(() => {
      updateRecommendation(recommendation.id, { status: 'accepted' });
      
      // Apply the recommendation changes to trains and system
      applyRecommendationChanges(recommendation);
      
      // Then remove after implementation delay
      setTimeout(() => {
        removeRecommendation(recommendation.id);
      }, 3000);
    }, 1000);
  };

  const handleReject = (recommendation: AIRecommendation) => {
    updateRecommendation(recommendation.id, { status: 'rejected' });
    
    setTimeout(() => {
      removeRecommendation(recommendation.id);
    }, 2000);
  };

  const handleSimulate = (recommendation: AIRecommendation) => {
    selectRecommendation(recommendation);
    setSimulationModalOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reroute': return '🔄';
      case 'delay': return '⏱️';
      case 'priority': return '⚡';
      case 'maintenance': return '🔧';
      case 'emergency': return '🚨';
      default: return '💡';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reroute': return 'text-blue-400';
      case 'delay': return 'text-yellow-400';
      case 'priority': return 'text-purple-400';
      case 'maintenance': return 'text-orange-400';
      case 'emergency': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-control-panel">
      {/* Header */}
      <div className="p-4 border-b border-control-border">
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="h-5 w-5 text-ai-glow" />
          <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
        </div>
        <p className="text-xs text-gray-400">
          Real-time optimization suggestions from AI agents
        </p>
      </div>

      {/* Recommendations List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 min-h-0" style={{ scrollBehavior: 'smooth' }}>
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active recommendations</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onAccept={() => handleAccept(rec)}
              onReject={() => handleReject(rec)}
              onSimulate={() => handleSimulate(rec)}
              getTypeIcon={getTypeIcon}
              getTypeColor={getTypeColor}
            />
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-control-border">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold text-status-green">
              {recommendations.filter(r => r.status === 'accepted').length}
            </div>
            <div className="text-gray-400">Accepted</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-ai-glow">
              {recommendations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-gray-400">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onAccept: () => void;
  onReject: () => void;
  onSimulate: () => void;
  getTypeIcon: (type: string) => string;
  getTypeColor: (type: string) => string;
}

function RecommendationCard({
  recommendation,
  onAccept,
  onReject,
  onSimulate,
  getTypeIcon,
  getTypeColor
}: RecommendationCardProps) {
  const isProcessing = recommendation.status === 'accepted' || recommendation.status === 'rejected';

  return (
    <div className={`ai-suggestion-card ${isProcessing ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${getTypeColor(recommendation.type)}`}>
                {recommendation.type.toUpperCase()}
              </span>
              <span className={`text-xs ${getUrgencyColor(recommendation.urgency)}`}>
                {recommendation.urgency.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              {recommendation.agentName}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-ai-glow font-mono">
            {recommendation.confidence}% confidence
          </div>
          <div className="text-xs text-gray-400">
            {formatDateTime(recommendation.timestamp)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h4 className="text-sm font-medium text-white mb-1">
          {recommendation.title}
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="bg-control-bg rounded p-2">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 text-status-green" />
            <span className="text-gray-400">Delay Reduction</span>
          </div>
          <div className="text-status-green font-medium">
            {recommendation.impact.delayReduction}m
          </div>
        </div>
        
        <div className="bg-control-bg rounded p-2">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-status-blue" />
            <span className="text-gray-400">Congestion</span>
          </div>
          <div className="text-status-blue font-medium">
            -{recommendation.impact.congestionReduction}%
          </div>
        </div>
      </div>

      {/* Actions */}
      {recommendation.status === 'pending' && !isProcessing && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="accept"
            onClick={onAccept}
            className="flex-1 text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Accept
          </Button>
          
          <Button
            size="sm"
            variant="reject"
            onClick={onReject}
            className="flex-1 text-xs"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Reject
          </Button>
          
          <Button
            size="sm"
            variant="simulate"
            onClick={onSimulate}
            className="text-xs"
          >
            <PlayCircle className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Status Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-ai-glow border-t-transparent"></div>
            <span className="text-xs text-ai-glow">
              {recommendation.status === 'accepted' ? 'Implementing...' : 'Rejecting...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function generateNewRecommendation(): AIRecommendation {
  const types: AIRecommendation['type'][] = ['reroute', 'delay', 'priority', 'maintenance', 'emergency'];
  const urgencies: AIRecommendation['urgency'][] = ['low', 'medium', 'high', 'critical'];
  const agents = [
    { id: 'agent-resolver', name: 'Conflict Resolver' },
    { id: 'agent-scheduler', name: 'Schedule Optimizer' },
    { id: 'agent-predictor', name: 'Congestion Predictor' }
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
  const agent = agents[Math.floor(Math.random() * agents.length)];

  return {
    id: generateId(),
    agentId: agent.id,
    agentName: agent.name,
    type,
    title: `${type === 'reroute' ? 'Reroute' : type === 'delay' ? 'Delay' : 'Optimize'} Train Operations`,
    description: `AI detected optimization opportunity with ${Math.floor(Math.random() * 30 + 10)}% efficiency improvement.`,
    impact: {
      delayReduction: Math.floor(Math.random() * 25 + 5),
      congestionReduction: Math.floor(Math.random() * 20 + 5),
      affectedTrains: Math.floor(Math.random() * 5 + 1),
      estimatedSavings: Math.floor(Math.random() * 60 + 15)
    },
    confidence: Math.floor(Math.random() * 20 + 80),
    timestamp: new Date().toISOString(),
    status: 'pending',
    urgency
  };
}
