import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Target, HelpCircle, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

interface Sector {
  id: string;
  name: string;
  dx: string;
  dy: string;
  percentage: number;
  runs: number;
  boundaries: number;
}

export default function InteractiveVisualizationsView() {
  const [activeSectorId, setActiveSectorId] = useState<string>('c'); // 'c' for Cover by default

  const sectors: Sector[] = [
    { id: 'tm', name: 'Third Man', dx: '12%', dy: '12%', percentage: 11, runs: 42, boundaries: 6 },
    { id: 'p', name: 'Point', dx: '8%', dy: '45%', percentage: 14, runs: 58, boundaries: 8 },
    { id: 'c', name: 'Cover', dx: '22%', dy: '75%', percentage: 22, runs: 94, boundaries: 14 },
    { id: 'mo', name: 'Mid Off', dx: '50%', dy: '88%', percentage: 18, runs: 73, boundaries: 10 },
    { id: 'mon', name: 'Mid On', dx: '78%', dy: '75%', percentage: 15, runs: 62, boundaries: 8 },
    { id: 'mw', name: 'Mid Wicket', dx: '90%', dy: '45%', percentage: 12, runs: 51, boundaries: 6 },
    { id: 'fl', name: 'Fine Leg', dx: '82%', dy: '12%', percentage: 8, runs: 33, boundaries: 4 },
  ];

  const activeSector = sectors.find(s => s.id === activeSectorId) || sectors[2];

  // Boundary Analysis chart data
  const boundaryData = [
    { source: 'Singles (1s)', Runs: 124, colour: '#6366f1' },
    { source: 'Doubles (2s)', Runs: 48, colour: '#818cf8' },
    { source: 'Fours (4s)', Runs: 184, colour: '#f43f5e' },
    { source: 'Sixes (6s)', Runs: 216, colour: '#fbbf24' },
  ];

  // Strike Rate Matrix: Pitch length vs Bowling speed
  const srMatrix = [
    { length: 'Short', fast: 168, medium: 142, spin: 120 },
    { length: 'Good Length', fast: 135, medium: 128, spin: 138 },
    { length: 'Full / Yorker', fast: 112, medium: 130, spin: 182 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
          📉 Broadcaster Suite
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Interactive Visualizations</h2>
        <p className="text-slate-400 text-sm">Interactive wagon wheels, boundary analysis, and tactical strike rate matrices.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Interactive Wagon Wheel */}
        <div className="xl:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Target className="w-4 h-4 text-rose-500" />
              Dynamic 360° Wagon Wheel
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Select field sector</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual Wagon Wheel Field Segment */}
            <div className="md:col-span-7 relative aspect-square w-full rounded-full border border-slate-700/50 bg-gradient-to-br from-slate-900 to-indigo-950/60 flex items-center justify-center p-4">
              
              {/* Inner ring pitches */}
              <div className="w-1/3 aspect-square rounded-full border border-slate-700/30"></div>
              {/* Pitch rectangle center */}
              <div className="absolute w-6 h-12 bg-slate-950 border border-slate-700 rounded-sm"></div>

              {/* Laser sector rays */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none stroke-rose-500/25" strokeWidth="0.5" strokeDasharray="3 3">
                <line x1="50" y1="50" x2="15" y2="15" />
                <line x1="50" y1="50" x2="10" y2="50" />
                <line x1="50" y1="50" x2="25" y2="80" />
                <line x1="50" y1="50" x2="50" y2="92" />
                <line x1="50" y1="50" x2="75" y2="80" />
                <line x1="50" y1="50" x2="90" y2="50" />
                <line x1="50" y1="50" x2="85" y2="15" />
              </svg>

              {/* Sector Buttons */}
              {sectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setActiveSectorId(sector.id)}
                  style={{ left: sector.dx, top: sector.dy }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all p-1 rounded-full cursor-pointer ${
                    activeSectorId === sector.id 
                      ? 'scale-125 bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-[9px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 whitespace-nowrap">
                    {sector.name} ({sector.percentage}%)
                  </p>
                </button>
              ))}
            </div>

            {/* Wagon Wheel Metrics Details */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 leading-relaxed text-xs space-y-3">
                <span className="text-[10px] font-bold font-mono text-rose-400 uppercase tracking-widest leading-none block">SELECTED SECTOR</span>
                <h4 className="text-lg font-extrabold text-white leading-none">{activeSector.name} Zone</h4>
                
                <div className="grid grid-cols-2 gap-2 text-center pt-2">
                  <div className="bg-slate-900 border border-slate-850 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500">Sector Runs</span>
                    <p className="text-base font-bold text-white font-mono mt-0.5">{activeSector.runs}</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-850 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500">Boundaries</span>
                    <p className="text-base font-bold text-rose-500 font-mono mt-0.5">{activeSector.boundaries}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Batting profile displays strong scoring potential inside the <span className="text-rose-300 font-semibold">{activeSector.name}</span> sector zone. This demonstrates elegant lofted driving abilities.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Boundary Analysis & Matrices */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Runs boundary metrics Bar Chart */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Run Distribution Channel</h3>
            <p className="text-xs text-slate-400">Comparing boundary scores to singles/doubles runs counts</p>

            <div className="h-44 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={boundaryData}>
                  <XAxis dataKey="source" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Bar dataKey="Runs" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tactical Strike Rate Matrix Table */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight leading-none">Strike Rate Matrix</h3>
            <p className="text-xs text-slate-400">Expected runs scored per 100 balls based on ball delivery length</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold">
                    <th className="pb-2">Length Vector</th>
                    <th className="pb-2 text-right">Vs Fast Pace</th>
                    <th className="pb-2 text-right">Vs Spin Bowlers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {srMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-bold text-white font-sans">{row.length}</td>
                      <td className="py-2.5 text-right font-bold text-slate-300">{row.fast}</td>
                      <td className="py-2.5 text-right font-bold text-rose-400">{row.spin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
