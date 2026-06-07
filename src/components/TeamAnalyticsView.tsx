import React, { useState } from 'react';
import { TEAMS } from '../data/iplData';
import { Team } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Shuffle, TrendingUp, Sparkles, Building, Play, Compass, ArrowRight, FileSpreadsheet, FileText } from 'lucide-react';
import { exportTeamsToCSV, downloadTeamsPDF } from '../utils/exportUtils';

export default function TeamAnalyticsView() {
  const [selectedTeam1, setSelectedTeam1] = useState<string>('CSK');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('MI');

  const team1 = TEAMS.find(t => t.shortName === selectedTeam1) || TEAMS[0];
  const team2 = TEAMS.find(t => t.shortName === selectedTeam2) || TEAMS[1];

  // Radar compare data
  const comparisonRadarData = [
    { subject: 'Batting Strength', A: team1.battingStrength, B: team2.battingStrength, fullMark: 100 },
    { subject: 'Bowling Strength', A: team1.bowlingStrength, B: team2.bowlingStrength, fullMark: 100 },
    { subject: 'Win % (Overall)', A: Math.round(team1.winPct), B: Math.round(team2.winPct), fullMark: 100 },
    { subject: 'Home Win %', A: Math.round(team1.homeWinPct), B: Math.round(team2.homeWinPct), fullMark: 100 },
    { subject: 'Away Win %', A: Math.round(team1.awayWinPct), B: Math.round(team2.awayWinPct), fullMark: 100 },
  ];

  // Win stats comparison data (Home vs Away)
  const homeAwayCompareData = [
    { name: 'Home Win Rate', [selectedTeam1]: team1.homeWinPct, [selectedTeam2]: team2.homeWinPct },
    { name: 'Away Win Rate', [selectedTeam1]: team1.awayWinPct, [selectedTeam2]: team2.awayWinPct },
    { name: 'Overall Win Rate', [selectedTeam1]: team1.winPct, [selectedTeam2]: team2.winPct },
  ];

  // Head-to-head simulated statistics
  const getSimulatedH2H = (t1: string, t2: string) => {
    if (t1 === 'CSK' && t2 === 'MI') return { t1Won: 17, t2Won: 21, total: 38 };
    if (t1 === 'MI' && t2 === 'CSK') return { t1Won: 21, t2Won: 17, total: 38 };
    if (t1 === 'CSK' && t2 === 'RCB') return { t1Won: 22, t2Won: 10, total: 32 };
    if (t1 === 'RCB' && t2 === 'CSK') return { t1Won: 10, t2Won: 22, total: 32 };
    // fallback generic simulator based on won stats ratios
    const weight1 = t1 === t2 ? 10 : (TEAMS.find(t=>t.shortName===t1)?.winPct || 50);
    const weight2 = t1 === t2 ? 10 : (TEAMS.find(t=>t.shortName===t2)?.winPct || 50);
    const total = 28;
    const t1Won = Math.round((weight1 / (weight1 + weight2)) * total);
    const t2Won = total - t1Won;
    return { t1Won, t2Won, total };
  };

  const h2h = getSimulatedH2H(selectedTeam1, selectedTeam2);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
            📊 Comparative Analysis
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Team Analytics & Inter-Franchise Metrics</h2>
          <p className="text-slate-400 text-sm mt-1">Contrast rosters, stadium biases, seasonal metrics, and mutual head-to-head distributions.</p>
        </div>

        {/* Team Exports Menu */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => exportTeamsToCSV(TEAMS)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Download full franchise standings table as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Standings</span>
          </button>
          <button
            onClick={() => downloadTeamsPDF(TEAMS, { t1: selectedTeam1, t2: selectedTeam2, t1Won: h2h.t1Won, t2Won: h2h.t2Won, total: h2h.total })}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Download team ratings & H2H overview PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Ratings PDF</span>
          </button>
        </div>
      </div>

      {/* Selectors Panel */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Team 1 Selection */}
        <div className="w-full sm:w-2/5 space-y-1">
          <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Primary franchise (Team A)</label>
          <select
            value={selectedTeam1}
            onChange={(e) => setSelectedTeam1(e.target.value)}
            className="w-full bg-slate-950 text-white rounded-xl border border-slate-800/80 p-2.5 text-sm font-semibold outline-none focus:border-rose-500 transition cursor-pointer"
          >
            {TEAMS.map(t => (
              <option 
                key={t.shortName} 
                value={t.shortName} 
                disabled={t.shortName === selectedTeam2}
              >
                {t.name} ({t.shortName})
              </option>
            ))}
          </select>
        </div>

        {/* Shuffle/versus Indicator */}
        <div className="p-3 rounded-full bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs font-black">
          VS
        </div>

        {/* Team 2 Selection */}
        <div className="w-full sm:w-2/5 space-y-1">
          <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">Secondary franchise (Team B)</label>
          <select
            value={selectedTeam2}
            onChange={(e) => setSelectedTeam2(e.target.value)}
            className="w-full bg-slate-950 text-white rounded-xl border border-slate-800/80 p-2.5 text-sm font-semibold outline-none focus:border-rose-500 transition cursor-pointer"
          >
            {TEAMS.map(t => (
              <option 
                key={t.shortName} 
                value={t.shortName} 
                disabled={t.shortName === selectedTeam1}
              >
                {t.name} ({t.shortName})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Analytics Main Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Head-To-Head & Performance Metrics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Head to Head Card */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-rose-500" />
              Head-to-Head (H2H) Archival
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{selectedTeam1} wins ({h2h.t1Won})</span>
                <span>{selectedTeam2} wins ({h2h.t2Won})</span>
              </div>
              <div className="h-3.5 w-full rounded-full bg-slate-950 overflow-hidden flex border border-slate-850">
                <div 
                  style={{ width: `${(h2h.t1Won / h2h.total) * 100}%` }}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full"
                ></div>
                <div 
                  style={{ width: `${(h2h.t2Won / h2h.total) * 100}%` }}
                  className="bg-gradient-to-l from-blue-500 to-indigo-600 h-full"
                ></div>
              </div>
              <p className="text-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">{h2h.total} total competitive matches recorded</p>
            </div>

            {/* Quick Stats Compare */}
            <div className="space-y-3.5 pt-2">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900/60 text-xs flex justify-between items-center">
                <span className="text-slate-400">Squad Standings Rank</span>
                <span className="font-mono font-bold text-white text-right">
                  {team1.rank} <span className="text-slate-500 text-[10px]">vs</span> {team2.rank}
                </span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900/60 text-xs flex justify-between items-center">
                <span className="text-slate-400">Overall Win Pct</span>
                <span className="font-mono font-bold text-white text-right">
                  {team1.winPct}% <span className="text-slate-500 text-[10px]">vs</span> {team2.winPct}%
                </span>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-900/60 text-xs flex justify-between items-center">
                <span className="text-slate-400">Current NRR Factor</span>
                <span className="font-mono font-bold text-white text-right">
                  +{team1.netRunRate} <span className="text-slate-500 text-[10px]">vs</span> +{team2.netRunRate}
                </span>
              </div>
            </div>
          </div>

          {/* Form Factor Cards */}
          <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Recent Running Form Profile</h3>
            
            {/* Team 1 Form */}
            <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-3">
              <div>
                <p className="font-bold text-white">{team1.name}</p>
                <span className="text-[10px] text-slate-500 font-mono">Last 5 outcomes</span>
              </div>
              <div className="flex gap-1.5">
                {team1.recentForm.map((f, i) => (
                  <span 
                    key={i} 
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] border ${
                      f === 'W' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Team 2 Form */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <p className="font-bold text-white">{team2.name}</p>
                <span className="text-[10px] text-slate-500 font-mono">Last 5 outcomes</span>
              </div>
              <div className="flex gap-1.5">
                {team2.recentForm.map((f, i) => (
                  <span 
                    key={i} 
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] border ${
                      f === 'W' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Radar comparative and Home/Away chart */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Comparison Radar Strength Chart */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white tracking-tight">Roster Attributes Overview</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">Radar Map</span>
            </div>
            <p className="text-xs text-slate-400">Comparing technical skill ratings from simulated matches</p>

            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonRadarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} fontSize={8} />
                  <Radar name={selectedTeam1} dataKey="A" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.25} />
                  <Radar name={selectedTeam2} dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar comparison mapping: Home vs Away */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white tracking-tight">Home Arena vs Away Venues</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">Win Rates</span>
            </div>
            <p className="text-xs text-slate-400">Comparative splits describing stadium familiarity bias</p>

            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={homeAwayCompareData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey={selectedTeam1} fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey={selectedTeam2} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
