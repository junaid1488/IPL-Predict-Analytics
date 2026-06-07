import React, { useState } from 'react';
import MentorSection from './MentorSection';
import { Settings, Shield, Server, Database, Key, HelpCircle } from 'lucide-react';

export default function SettingsView() {
  const [modelEstimators, setModelEstimators] = useState<number>(200);
  const [learningRate, setLearningRate] = useState<number>(0.05);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
          ⚙ Systems Control
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Platform Configurations & Architecture</h2>
        <p className="text-slate-400 text-sm">Tune hyperparameters, review API connection strings, and inspect database mapping structures.</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ML Tuning config */}
        <div className="xl:col-span-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-5">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-white tracking-tight">Hyperparameter Tuning Playground</h3>
          </div>

          <div className="space-y-4">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Random Forest Estimators</span>
                <span className="font-bold text-rose-300">{modelEstimators} trees</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="500" 
                step="50"
                value={modelEstimators} 
                onChange={(e) => setModelEstimators(parseInt(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-slate-950 rounded pointer-events-auto cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 leading-none">Sets total decision trees compiled inside the bagging ensemble model.</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Regularization Learning Penalty</span>
                <span className="font-bold text-rose-300">{learningRate}</span>
              </div>
              <input 
                type="range" 
                min="0.01" 
                max="0.2" 
                step="0.01"
                value={learningRate} 
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-slate-950 rounded pointer-events-auto cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 leading-none">Controls weight shrinkage adjustments on individual base trees.</p>
            </div>

          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-xs rounded-xl text-slate-350">
            <strong>Protip:</strong> Higher learning weights decrease compilation duration but introduce marginal testing error fluctuations.
          </div>
        </div>

        {/* Server environment credentials status */}
        <div className="xl:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Server className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Environmental Integration Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-xs leading-relaxed space-y-1.5">
              <p className="font-bold text-white font-mono uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL Node
              </p>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-550">Connection:</span>
                <span className="text-slate-300 font-semibold">Ready (ssl=required)</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-550">Pooled Sockets:</span>
                <span className="text-slate-300">Active (12 / 20 MAX)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-xs leading-relaxed space-y-1.5">
              <p className="font-bold text-white font-mono uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-400" /> JWT Authorization
              </p>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-550">Provider Token:</span>
                <span className="text-slate-300 font-semibold">Clerk Active Core</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-550">Token Expire:</span>
                <span className="text-slate-300">Re-verify (1 hr TTL)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mentor Section Embed */}
      <MentorSection />

    </div>
  );
}
