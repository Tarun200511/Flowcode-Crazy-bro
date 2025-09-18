'use client';

import { useState, useEffect } from 'react';
import { Play, RotateCcw, TrendingUp, TrendingDown, Clock, Users, Zap, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTrainStore } from '@/store/useTrainStore';
import { SimulationResult } from '@/types';
import { formatNumber, generateId } from '@/lib/utils';

export function SimulationModal() {
  const { 
    isSimulationModalOpen, 
    setSimulationModalOpen, 
    selectedRecommendation,
    addSimulationResult,
    simulationResults
  } = useTrainStore();

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [parameters, setParameters] = useState({
    duration: 60, // minutes
    scope: 'regional', // local, regional, network
    accuracy: 'high' // low, medium, high
  });

  useEffect(() => {
    if (!isSimulationModalOpen) {
      setCurrentResult(null);
      setProgress(0);
      setIsRunning(false);
    }
  }, [isSimulationModalOpen]);

  const runSimulation = async () => {
    if (!selectedRecommendation) return;

    setIsRunning(true);
    setProgress(0);
    setCurrentResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate computation time
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Generate simulation result
      const result = generateSimulationResult(selectedRecommendation, parameters);
      setCurrentResult(result);
      addSimulationResult(result);
      setIsRunning(false);
    }, 3000);
  };

  const resetSimulation = () => {
    setCurrentResult(null);
    setProgress(0);
    setIsRunning(false);
  };

  if (!selectedRecommendation) return null;

  return (
    <Dialog open={isSimulationModalOpen} onOpenChange={setSimulationModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-control-panel border-control-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center space-x-2">
            <Play className="h-5 w-5 text-ai-glow" />
            <span>What-If Simulation</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Analyze the potential impact of implementing this AI recommendation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recommendation Summary */}
          <div className="mission-control-panel">
            <h3 className="text-lg font-semibold text-white mb-3">Recommendation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Title</div>
                <div className="text-white">{selectedRecommendation.title}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Agent</div>
                <div className="text-ai-glow">{selectedRecommendation.agentName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Type</div>
                <div className="text-white capitalize">{selectedRecommendation.type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Confidence</div>
                <div className="text-white">{selectedRecommendation.confidence}%</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-400 mb-1">Description</div>
              <div className="text-white text-sm">{selectedRecommendation.description}</div>
            </div>
          </div>

          {/* Simulation Parameters */}
          <div className="mission-control-panel">
            <h3 className="text-lg font-semibold text-white mb-3">Simulation Parameters</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Duration (minutes)</label>
                <select 
                  value={parameters.duration}
                  onChange={(e) => setParameters(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full bg-control-bg border border-control-border rounded px-3 py-2 text-white"
                  disabled={isRunning}
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Scope</label>
                <select 
                  value={parameters.scope}
                  onChange={(e) => setParameters(prev => ({ ...prev, scope: e.target.value }))}
                  className="w-full bg-control-bg border border-control-border rounded px-3 py-2 text-white"
                  disabled={isRunning}
                >
                  <option value="local">Local (5km radius)</option>
                  <option value="regional">Regional (50km radius)</option>
                  <option value="network">Network-wide</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Accuracy</label>
                <select 
                  value={parameters.accuracy}
                  onChange={(e) => setParameters(prev => ({ ...prev, accuracy: e.target.value }))}
                  className="w-full bg-control-bg border border-control-border rounded px-3 py-2 text-white"
                  disabled={isRunning}
                >
                  <option value="low">Low (Fast)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Detailed)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="flex space-x-4">
            <Button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex-1 bg-ai-glow text-black hover:bg-ai-glow/80"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            
            <Button
              onClick={resetSimulation}
              variant="outline"
              disabled={isRunning}
              className="border-control-border text-gray-400 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Progress Bar */}
          {(isRunning || progress > 0) && (
            <div className="mission-control-panel">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Simulation Progress</span>
                <span className="text-sm text-ai-glow">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-control-bg rounded-full h-2">
                <div 
                  className="bg-ai-glow h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {isRunning && (
                <div className="text-xs text-gray-400 mt-2">
                  Analyzing network impact, calculating delays, optimizing routes...
                </div>
              )}
            </div>
          )}

          {/* Simulation Results */}
          {currentResult && (
            <div className="mission-control-panel">
              <h3 className="text-lg font-semibold text-white mb-4">Simulation Results</h3>
              
              {/* Impact Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-control-bg rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-status-green" />
                    <span className="text-sm text-gray-400">Delay Impact</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      {currentResult.results.delayChange > 0 ? '+' : ''}{currentResult.results.delayChange}m
                    </span>
                    {currentResult.results.delayChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-status-green" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-status-red" />
                    )}
                  </div>
                </div>

                <div className="bg-control-bg rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-status-blue" />
                    <span className="text-sm text-gray-400">Congestion Change</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      {currentResult.results.congestionChange > 0 ? '+' : ''}{currentResult.results.congestionChange}%
                    </span>
                    {currentResult.results.congestionChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-status-green" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-status-red" />
                    )}
                  </div>
                </div>

                <div className="bg-control-bg rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-ai-glow" />
                    <span className="text-sm text-gray-400">Throughput Change</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      {currentResult.results.throughputChange > 0 ? '+' : ''}{currentResult.results.throughputChange}%
                    </span>
                    {currentResult.results.throughputChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-status-green" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-status-red" />
                    )}
                  </div>
                </div>

                <div className="bg-control-bg rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-status-orange" />
                    <span className="text-sm text-gray-400">Affected Trains</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(currentResult.results.affectedTrains)}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-control-bg rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Impact Summary</span>
                  <span className="text-sm text-ai-glow">
                    {currentResult.confidence}% confidence
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {currentResult.results.estimatedImpact}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-4">
                <Button
                  onClick={() => {
                    // Here you would implement the actual recommendation
                    setSimulationModalOpen(false);
                  }}
                  className="flex-1 bg-status-green text-black hover:bg-status-green/80"
                >
                  Implement Recommendation
                </Button>
                
                <Button
                  onClick={() => setSimulationModalOpen(false)}
                  variant="outline"
                  className="border-control-border text-gray-400 hover:text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Previous Results */}
          {simulationResults.length > 0 && !currentResult && (
            <div className="mission-control-panel">
              <h3 className="text-lg font-semibold text-white mb-3">Recent Simulations</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {simulationResults.slice(0, 3).map((result) => (
                  <div key={result.id} className="bg-control-bg rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{result.scenario}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Delay: {result.results.delayChange}m | 
                      Congestion: {result.results.congestionChange}% | 
                      Confidence: {result.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateSimulationResult(recommendation: any, parameters: any): SimulationResult {
  // Simulate realistic results based on recommendation type
  const baseDelayChange = recommendation.impact.delayReduction * -1; // Negative means improvement
  const baseCongestionChange = recommendation.impact.congestionReduction * -1;
  
  // Add some randomness and parameter influence
  const scopeMultiplier = parameters.scope === 'network' ? 1.5 : parameters.scope === 'regional' ? 1.2 : 1.0;
  const accuracyVariance = parameters.accuracy === 'high' ? 0.1 : parameters.accuracy === 'medium' ? 0.2 : 0.3;
  
  const delayChange = Math.round(baseDelayChange * scopeMultiplier * (1 + (Math.random() - 0.5) * accuracyVariance));
  const congestionChange = Math.round(baseCongestionChange * scopeMultiplier * (1 + (Math.random() - 0.5) * accuracyVariance));
  const throughputChange = Math.round(Math.abs(congestionChange) * 0.6 * (congestionChange < 0 ? 1 : -1));
  const affectedTrains = Math.round(recommendation.impact.affectedTrains * scopeMultiplier);

  let estimatedImpact = '';
  if (delayChange < -10 && congestionChange < -15) {
    estimatedImpact = 'Excellent optimization potential. Significant improvement in network efficiency with minimal disruption to passenger services.';
  } else if (delayChange < -5 && congestionChange < -10) {
    estimatedImpact = 'Good optimization opportunity. Moderate improvement in network performance with acceptable trade-offs.';
  } else if (delayChange < 0 && congestionChange < 0) {
    estimatedImpact = 'Minor optimization benefit. Small improvement in network efficiency with low risk.';
  } else {
    estimatedImpact = 'Limited optimization benefit. Consider alternative approaches or parameter adjustments.';
  }

  return {
    id: generateId(),
    scenario: recommendation.title,
    parameters,
    results: {
      delayChange,
      congestionChange,
      throughputChange,
      affectedTrains,
      estimatedImpact
    },
    confidence: Math.max(70, recommendation.confidence + (Math.random() - 0.5) * 20),
    timestamp: new Date().toISOString()
  };
}
