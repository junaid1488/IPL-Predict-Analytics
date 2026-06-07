import React, { useState } from 'react';
import { TEAMS, VENUES } from '../data/iplData';
import { calculatePrediction, simulateModelTraining, initialMetrics } from '../utils/mlEngine';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, Play, BarChart2, ShieldCheck, Activity, Terminal, CheckCircle, RefreshCcw, Sparkles } from 'lucide-react';
import { MLPipelineMetrics } from '../types';
import { ModelPipelineLog } from '../utils/mlEngine';

export default function MlEngineView() {
  const [team1, setTeam1] = useState('CSK');
  const [team2, setTeam2] = useState('MI');
  const [venue, setVenue] = useState(VENUES[0].name);
  const [tossWinner, setTossWinner] = useState('CSK');
  const [tossDecision, setTossDecision] = useState<'bat' | 'field'>('field');

  const [isCalculated, setIsCalculated] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  // Model training pipe state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState<ModelPipelineLog[]>([]);
  const [modelMetrics, setModelMetrics] = useState<MLPipelineMetrics>(initialMetrics);

  const handlePredict = () => {
    setIsCalculated(true);
    const result = calculatePrediction({
      team1,
      team2,
      venue,
      tossWinner,
      tossDecision
    });
    setPredictionResult(result);
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingLogs([]);
    
    const trainingOutput = simulateModelTraining();
    
    // Staggered log print simulations
    let index = 0;
    const interval = setInterval(() => {
      if (index < trainingOutput.logs.length) {
        const logItem = trainingOutput.logs[index];
        setTrainingLogs(p => [...p, logItem]);
        index++;
      } else {
        clearInterval(interval);
        setIsTraining(false);
        setModelMetrics(trainingOutput.metrics);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
          🤖 Machine Learning Matrix
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">ML Classifier Predictor Engine</h2>
        <p className="text-slate-400 text-sm">Tune hyperparameters, feed tournament match vectors, and predict live win factors via Random Forest assemblies.</p>
      </div>

      {/* Prediction Lab Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Playbook Inputs Panel */}
        <div className="xl:col-span-5 bg-gradient-to-b from-slate-900/60 to-slate-950 rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">Predictor Parameter Hyper-Tuning</h3>
          
          <div className="space-y-3.5">
            {/* Team A Selection */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">First Match Franchise (Team 1)</label>
              <select
                value={team1}
                onChange={(e) => {
                  setTeam1(e.target.value);
                  if (tossWinner !== e.target.value && tossWinner !== team2) {
                    setTossWinner(e.target.value);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800/85 text-white rounded-xl p-2.5 text-xs font-semibold focus:border-rose-500 outline-none transition cursor-pointer"
              >
                {TEAMS.map(t => (
                  <option key={t.shortName} value={t.shortName} disabled={t.shortName === team2}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>

            {/* Team B Selection */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Second Match Franchise (Team 2)</label>
              <select
                value={team2}
                onChange={(e) => {
                  setTeam2(e.target.value);
                  if (tossWinner !== e.target.value && tossWinner !== team1) {
                    setTossWinner(e.target.value);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800/85 text-white rounded-xl p-2.5 text-xs font-semibold focus:border-rose-500 outline-none transition cursor-pointer"
              >
                {TEAMS.map(t => (
                  <option key={t.shortName} value={t.shortName} disabled={t.shortName === team1}>{t.name} ({t.shortName})</option>
                ))}
              </select>
            </div>

            {/* Venue Ground selector */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Selected Stadium Arena</label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/85 text-white rounded-xl p-2.5 text-xs font-semibold focus:border-rose-500 outline-none transition cursor-pointer"
              >
                {VENUES.map(v => (
                  <option key={v.id} value={v.name}>{v.name} ({v.city})</option>
                ))}
              </select>
            </div>

            {/* Toss Winner Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Toss Selection Winner</label>
                <select
                  value={tossWinner}
                  onChange={(e) => setTossWinner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/85 text-white rounded-xl p-2.5 text-xs font-semibold focus:border-rose-500 outline-none transition cursor-pointer"
                >
                  <option value={team1}>{team1}</option>
                  <option value={team2}>{team2}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Decided Move</label>
                <select
                  value={tossDecision}
                  onChange={(e: any) => setTossDecision(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800/85 text-white rounded-xl p-2.5 text-xs font-semibold focus:border-rose-500 outline-none transition cursor-pointer"
                >
                  <option value="field">Bowl First (Field)</option>
                  <option value="bat">Bat First (Defend)</option>
                </select>
              </div>
            </div>

          </div>

          <button
            onClick={handlePredict}
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg shadow-rose-950 cursor-pointer"
          >
            <Cpu className="w-4 h-4 fill-current" /> Compute Win Logits
          </button>
        </div>

        {/* Prediction Outputs Panel */}
        <div className="xl:col-span-7 space-y-6">
          
          {!isCalculated ? (
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8 text-center flex flex-col items-center justify-center h-80 space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-full border border-slate-800">
                <Activity className="w-8 h-8 text-slate-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-350">Pending Classifier Inputs</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">Populate desired teams and decision vectors, then hit Compute to run Random Forest ensembles.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Win probabilities percentages display */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-6 text-center">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Estimated Match Results</h4>
                
                <div className="flex justify-center items-center gap-6 py-4">
                  <div>
                    <p className="text-3xl font-black text-white font-mono">{predictionResult.team1Prob}%</p>
                    <span className="text-[10px] text-yellow-400 font-mono tracking-widest uppercase font-bold">{team1}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono uppercase bg-slate-950 p-2 rounded-full border border-slate-900">VS</div>
                  <div>
                    <p className="text-3xl font-black text-white font-mono">{predictionResult.team2Prob}%</p>
                    <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase font-bold">{team2}</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-xs rounded-xl flex items-center justify-center gap-1.5 text-slate-300">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>RF Confidence Index Score: <span className="font-bold text-white font-mono">{predictionResult.confidenceScore}%</span></span>
                </div>

                {/* Key Factors list */}
                <div className="space-y-2 text-left pt-2 border-t border-slate-850">
                  <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">Ensemble Weight Indicators</p>
                  <ul className="space-y-1.5 text-xs">
                    {predictionResult.keyFactors.map((f: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start text-slate-300 font-sans leading-relaxed">
                        <span className="text-rose-500 font-bold mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature Importance charts */}
              <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Hyper-factor Importance weights</h4>
                <p className="text-[11px] text-slate-500">Weight coefficients scored by Scikit-learn random tree forests</p>
                
                <div className="h-56 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={predictionResult.featureImportance}>
                      <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 0.4]} />
                      <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={9} width={90} tickFormatter={(t) => t.split(' ')[1] || t} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Relational Data Pipeline Console Section */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-rose-500" />
              Automated Data Science & Training Pipeline Terminal
            </h3>
            <p className="text-xs text-slate-400">Trigger standard cleaning configurations and compute classification weights.</p>
          </div>

          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 text-rose-400 ${isTraining ? 'animate-spin' : ''}`} />
            Fit Random Forest Classifier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Real-time terminal log viewer */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-900 p-4 rounded-xl flex flex-col h-48 overflow-y-auto">
            {trainingLogs.length === 0 ? (
              <div className="text-xs font-mono text-slate-500 italic my-auto text-center">
                Terminal idle. Hit "Fit Random Forest Classifier" to review console metrics.
              </div>
            ) : (
              <div className="space-y-1 font-mono text-[11px] leading-relaxed">
                {trainingLogs.map((log, i) => log && (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-600">[{log.timestamp}]</span>
                    <span className={log.level === 'success' ? 'text-emerald-400' : log.level === 'warn' ? 'text-yellow-400' : 'text-slate-300'}>
                      {log.message}
                    </span>
                  </div>
                ))}
                {isTraining && (
                  <div className="text-xs text-rose-400 font-bold animate-pulse mt-2">
                    Evaluating decision tree matrices...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Model Evaluation Metrics cards */}
          <div className="lg:col-span-4 bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Validation Scores</h4>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Accuracy</span>
                <p className="text-base font-extrabold text-white font-mono mt-0.5">{(modelMetrics.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Precision</span>
                <p className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">{(modelMetrics.precision * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Recall</span>
                <p className="text-base font-extrabold text-indigo-400 font-mono mt-0.5">{(modelMetrics.recall * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase">F1-Score</span>
                <p className="text-base font-extrabold text-rose-400 font-mono mt-0.5">{(modelMetrics.f1Score * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 font-mono leading-relaxed text-center">
              Fitted over {modelMetrics.totalSamples} match splits ({modelMetrics.testSizePct}% validation test hold-out configuration)
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
