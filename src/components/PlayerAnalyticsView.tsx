import React, { useState } from 'react';
import { PLAYERS, TEAMS } from '../data/iplData';
import { Player } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Search, Trophy, CircleUser, Activity, Sparkles, Sliders, Download, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { exportPlayersToCSV, downloadPlayerProfilePDF, downloadAllPlayersPDF } from '../utils/exportUtils';

export default function PlayerAnalyticsView() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('p1'); // Virat Kohli by default
  const [compPlayerId1, setCompPlayerId1] = useState<string>('p1');
  const [compPlayerId2, setCompPlayerId2] = useState<string>('p4'); // Sunil Narine

  // Search autocomplete states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);

  // Top run scorers (Orange Cap list)
  const orangeCapPlayers = [...PLAYERS]
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 5);

  // Top wicket takers (Purple Cap list)
  const purpleCapPlayers = [...PLAYERS]
    .filter(p => p.wickets > 0)
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, 5);

  const selectedProfile = PLAYERS.find(p => p.id === selectedProfileId) || PLAYERS[0];
  const comp1 = PLAYERS.find(p => p.id === compPlayerId1) || PLAYERS[0];
  const comp2 = PLAYERS.find(p => p.id === compPlayerId2) || PLAYERS[1];

  // Filter players for real-time autocomplete suggestion list
  const filteredPlayers = searchQuery.trim() === ''
    ? []
    : PLAYERS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Dual compare chart data
  const compareChartData = [
    { metric: 'Avg Scored', [comp1.name]: comp1.average, [comp2.name]: comp2.average },
    { metric: 'Strike Rate', [comp1.name]: Math.round(comp1.strikeRate / 1.5), [comp2.name]: Math.round(comp2.strikeRate / 1.5) }, // Normalized
    { metric: 'Economy Val', [comp1.name]: comp1.economy * 10, [comp2.name]: comp2.economy * 10 }, // Scale up for comparison
    { metric: 'Total Wkts', [comp1.name]: comp1.wickets * 2, [comp2.name]: comp2.wickets * 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
            🏏 Player Metrics
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Player Analytics & Leaderboards</h2>
          <p className="text-slate-400 text-sm mt-1">Review Orange and Purple Cap races, compare batting and bowling statistics, or explore unique player profile cards.</p>
        </div>

        {/* Export Utility Controls */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => exportPlayersToCSV(PLAYERS)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Export all player statistics to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Export</span>
          </button>
          <button
            onClick={() => downloadAllPlayersPDF(PLAYERS)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Download full player leaderboards report PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>All Stats PDF</span>
          </button>
        </div>
      </div>

      {/* Global Athlete Command Finder / Autocomplete Search */}
      <div className="relative bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4">
        {/* Click outside backdrop close layer */}
        {showAutocomplete && searchQuery.trim() !== '' && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowAutocomplete(false)}
          />
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 shrink-0">
              <Search className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Franchise Player Registry</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Filter by name, squad affiliation (e.g. RCB, MI, KKR), or playing group</p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowAutocomplete(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                placeholder="Search athlete e.g. Virat, Bumrah, Narine..."
                className="w-full bg-slate-950 border border-slate-800/80 hover:border-slate-700/60 focus:border-rose-500 outline-none rounded-xl py-2 px-3.5 text-xs text-white placeholder-slate-500 transition-all font-medium pr-8"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowAutocomplete(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition text-[10px] font-mono leading-none cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown autocompletion list */}
            {showAutocomplete && searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-900 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => {
                        setSelectedProfileId(player.id);
                        setSearchQuery('');
                        setShowAutocomplete(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-900/50 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${player.imageColor || 'from-slate-700 to-slate-900'} flex items-center justify-center font-bold text-[9px] text-white shrink-0 border border-slate-800`}>
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-rose-400 transition leading-none">{player.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">{player.team} • {player.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {player.runs > 0 ? (
                          <span className="text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-md">
                            {player.runs} Runs
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-md">
                            {player.wickets} Wkts
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 font-mono">
                    No matching profiles found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Orange Cap (Batsmen) */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              Orange Cap Leaderboard (Most Runs)
            </h3>
            <Trophy className="w-4 h-4 text-orange-400" />
          </div>

          <div className="space-y-2">
            {orangeCapPlayers.map((player, idx) => (
              <div 
                key={player.id} 
                onClick={() => setSelectedProfileId(player.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedProfileId === player.id 
                    ? 'bg-orange-500/15 border-orange-500/40' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-xs text-slate-500 text-center font-bold">{idx + 1}</span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${player.imageColor || 'from-orange-500 to-yellow-500'} flex items-center justify-center font-bold text-[10px] shrink-0 text-white shadow-sm border border-slate-800`}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs leading-none">{player.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{player.team} • {player.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-orange-400 text-sm leading-none">{player.runs} Runs</p>
                  <p className="text-[9px] text-slate-500 font-mono">SR: {player.strikeRate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purple Cap (Bowlers) */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Purple Cap Leaderboard (Most Wickets)
            </h3>
            <Trophy className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-2">
            {purpleCapPlayers.map((player, idx) => (
              <div 
                key={player.id} 
                onClick={() => setSelectedProfileId(player.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedProfileId === player.id 
                    ? 'bg-purple-500/15 border-purple-500/40' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-xs text-slate-500 text-center font-bold">{idx + 1}</span>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${player.imageColor || 'from-purple-500 to-indigo-500'} flex items-center justify-center font-bold text-[10px] shrink-0 text-white shadow-sm border border-slate-800`}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-xs leading-none">{player.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{player.team} • {player.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-purple-400 text-sm leading-none">{player.wickets} Wickets</p>
                  <p className="text-[9px] text-slate-500 font-mono">Econ: {player.economy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom section: Profiles and Dual Comparison tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card details */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/80 to-slate-950 rounded-2xl border border-slate-800/80 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedProfile.imageColor} flex items-center justify-center border border-slate-700/80 shrink-0 font-extrabold text-lg text-white shadow-md shadow-slate-950/40`}>
              {selectedProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-1">
                {selectedProfile.team} Profile
              </div>
              <h3 className="text-lg font-bold text-white leading-none">{selectedProfile.name}</h3>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{selectedProfile.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Matches</span>
              <p className="text-lg font-black text-white mt-1">{selectedProfile.matches}</p>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Runs</span>
              <p className="text-lg font-black text-orange-400 mt-1">{selectedProfile.runs}</p>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-850 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Wickets</span>
              <p className="text-lg font-black text-purple-400 mt-1">{selectedProfile.wickets}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-slate-850 pb-2.5">
              <span className="text-slate-400">Batting Average</span>
              <span className="font-mono font-semibold text-white">{selectedProfile.average || '0.00'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-850 pb-2.5">
              <span className="text-slate-400">Batting Strike Rate</span>
              <span className="font-mono font-semibold text-white">{selectedProfile.strikeRate || '0.0'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-850 pb-2.5">
              <span className="text-slate-400">Bowling Economy</span>
              <span className="font-mono font-semibold text-white">{selectedProfile.economy || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Season High-Watermark</span>
              <span className="font-mono font-semibold text-rose-300">
                {selectedProfile.runs > 0 ? `HS: ${selectedProfile.highestScore}` : `Best: ${selectedProfile.bestBowling}`}
              </span>
            </div>
          </div>

          {/* Quick PDF Print for Selected Player */}
          <button
            onClick={() => downloadPlayerProfilePDF(selectedProfile)}
            className="w-full py-2 bg-gradient-to-r from-rose-500/10 to-rose-600/10 hover:from-rose-500/20 hover:to-rose-600/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>Export Profile Card PDF</span>
          </button>
        </div>

        {/* Player Comparison Tool */}
        <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-500" />
              Dynamic Player Co-relation Comparisons
            </h3>
            <span className="text-xs font-mono text-slate-400 font-semibold">Analytical Split</span>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Player One</label>
              <select
                value={compPlayerId1}
                onChange={(e) => setCompPlayerId1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 text-white rounded-lg p-2 text-xs font-medium focus:border-rose-500 outline-none transition cursor-pointer"
              >
                {PLAYERS.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === compPlayerId2}>{p.name} ({p.team})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Player Two</label>
              <select
                value={compPlayerId2}
                onChange={(e) => setCompPlayerId2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/80 text-white rounded-lg p-2 text-xs font-medium focus:border-rose-500 outline-none transition cursor-pointer"
              >
                {PLAYERS.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === compPlayerId1}>{p.name} ({p.team})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compare Chart */}
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Bar dataKey={comp1.name} fill="#fbbf24" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey={comp2.name} fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
