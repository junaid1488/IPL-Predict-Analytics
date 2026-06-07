import React from 'react';
import { TEAMS, MATCHES, PLAYERS } from '../data/iplData';
import { Match, Team } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid } from 'recharts';
import { Trophy, TrendingUp, Users, Calendar, Sparkles, CheckCircle, ShieldAlert, Zap, ArrowUpRight, Bell, Clock, X, Info } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (page: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  // Live Tracked Squad Notifications State
  const [trackedTeams, setTrackedTeams] = React.useState<string[]>(['RCB', 'MI', 'CSK']);
  const [notifications, setNotifications] = React.useState([
    {
      id: 'n1',
      type: 'match_time',
      title: 'Match Start Advisory',
      message: 'Royal Challengers Bengaluru (RCB) takes on Chennai Super Kings (CSK) in 45 minutes.',
      team: 'RCB',
      timestamp: 'In 45m',
      isNew: true,
      isCritical: true,
    },
    {
      id: 'n2',
      type: 'lineup',
      title: 'Key Lineup Configuration',
      message: 'MS Dhoni confirmed in the playing XI for CSK, serving as middle-order anchor.',
      team: 'CSK',
      timestamp: '10m ago',
      isNew: true,
      isCritical: false,
    },
    {
      id: 'n3',
      type: 'lineup',
      title: 'New Opener Confirmation',
      message: 'Suryakumar Yadav declared fully fit and slated in 1st batting down for MI.',
      team: 'MI',
      timestamp: '30m ago',
      isNew: false,
      isCritical: false,
    },
    {
      id: 'n4',
      type: 'weather',
      title: 'Pitch & Dew Index',
      message: 'No rain forecasted at Wankhede. Speed coefficient of outfield elevated due to humidity.',
      team: 'MI',
      timestamp: '1h ago',
      isNew: false,
      isCritical: false,
    }
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const simulateNotification = () => {
    const templates = [
      {
        type: 'lineup',
        title: 'Playing XI Rotation',
        message: 'Virat Kohli announced to anchor the opening stand for RCB with improved bat weight settings.',
        team: 'RCB',
      },
      {
        type: 'match_time',
        title: 'Toss Outcome Decided',
        message: 'CSK wins toss at Chepauk and elects to field first. Tactical spinners roster deployed.',
        team: 'CSK',
      },
      {
        type: 'lineup',
        title: 'Squad Balance Bulletins',
        message: 'Jasprit Bumrah confirmed loaded as primary closing spearhead for Mumbai Indians (MI).',
        team: 'MI',
      },
      {
        type: 'lineup',
        title: 'Spin Strategy Shift',
        message: 'Sunil Narine scheduled to execute early overs spin strangle for KKR in Powerplay.',
        team: 'KKR',
      },
      {
        type: 'weather',
        title: 'Atmospheric Warning',
        message: 'Slight winds over Chinnaswamy. Air density favors high-arcing sixes to short legs.',
        team: 'RCB',
      }
    ];

    const random = templates[Math.floor(Math.random() * templates.length)];
    const newAlert = {
      id: `sim-${Date.now()}`,
      type: random.type,
      title: random.title,
      message: random.message,
      team: random.team,
      timestamp: 'Just now',
      isNew: true,
      isCritical: Math.random() > 0.5,
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  // KPI stats
  const totalMatches = 74; // IPL 2026 Season total games
  const totalTeams = TEAMS.length;
  const totalPlayers = PLAYERS.length;
  const seasonsCovered = 19; // 2008 - 2026
  const predictionAccuracy = "75.8%";

  // Top Teams Chart data
  const topTeamsData = [...TEAMS]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map(t => ({
      name: t.shortName,
      Points: t.points,
      WinRate: t.winPct,
      NRR: t.netRunRate,
    }));

  // Historical accuracy line chart
  const historyAccuracyData = [
    { season: '2020', base: 64.2, rf: 68.5 },
    { season: '2021', base: 65.8, rf: 70.1 },
    { season: '2022', base: 66.4, rf: 71.8 },
    { season: '2023', base: 67.5, rf: 72.9 },
    { season: '2024', base: 68.1, rf: 74.2 },
    { season: '2025', base: 69.4, rf: 75.8 },
  ];

  const recentMatches = MATCHES.filter(m => m.status === 'Completed').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-rose-950 border border-slate-800/80 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono text-xs uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            IPL 2026 Prediction Model Active
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Indian Premier League <br />
            <span className="bg-gradient-to-r from-yellow-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
              SaaS Analytics & Predictions
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Harness real-time over-by-over live dynamics, advanced wagon wheel metrics, batsman clustering profiles, and Random Forest classifier simulations on historical matches.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate('ml')}
              className="px-6 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 active:scale-95 transition flex items-center gap-2 shadow-lg shadow-rose-500/20 text-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" /> Run Predictor Engine
            </button>
            <button 
              onClick={() => onNavigate('matches')}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-medium border border-slate-700/60 active:scale-95 transition text-sm cursor-pointer"
            >
              Live Match Center
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-2 hover:border-slate-700/60 transition">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Matches</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">74</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <span>IPL 2026 Season Games</span>
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-2 hover:border-slate-700/60 transition">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">FRANCHISES</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalTeams}</p>
          <p className="text-[10px] text-slate-400 font-mono">Active IPL Contenders</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-2 hover:border-slate-700/60 transition">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">PLAYERS</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalPlayers}</p>
          <p className="text-[10px] text-indigo-400 font-mono">Scouted Deliveries Tracked</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-2 hover:border-slate-700/60 transition">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">SEASONS</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{seasonsCovered}</p>
          <p className="text-[10px] text-slate-400 font-mono">2008 - 2026 Historical</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-rose-500/10 via-slate-900/40 to-indigo-500/10 backdrop-blur-md rounded-2xl border border-rose-500/20 p-5 space-y-2 hover:border-rose-500/30 transition">
          <div className="flex justify-between items-center text-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-rose-400">ACCURACY</span>
            <Sparkles className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-300">{predictionAccuracy}</p>
          <p className="text-[10px] text-slate-300 font-mono">Averaged RF Validation F1</p>
        </div>
      </div>

      {/* Live Tracked Squad Notification Center & Live Sim Feed */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/15 rounded-xl border border-rose-500/20 text-rose-400 relative">
              <Bell className="w-5 h-5 animate-bounce" />
              {notifications.some(n => n.isNew) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Live Squad Match Alerts
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                  Real-time Feed
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Track franchises for upcoming start times & critical lineup disclosures</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Squad filter selector */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950/40 p-1.5 rounded-xl border border-slate-850">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase px-1.5">Track Squads:</span>
              {['RCB', 'MI', 'CSK', 'KKR', 'GT'].map(teamCode => {
                const isTracked = trackedTeams.includes(teamCode);
                return (
                  <button
                    key={teamCode}
                    onClick={() => {
                      if (isTracked) {
                        setTrackedTeams(prev => prev.filter(t => t !== teamCode));
                      } else {
                        setTrackedTeams(prev => [...prev, teamCode]);
                      }
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold uppercase transition flex items-center gap-1 cursor-pointer ${
                      isTracked 
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                        : 'bg-slate-900 text-slate-500 border border-slate-850 hover:text-slate-300'
                    }`}
                  >
                    {teamCode}
                    {isTracked ? '✓' : '+'}
                  </button>
                );
              })}
            </div>

            {/* Simulated trigger button */}
            <button
              onClick={simulateNotification}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/35 text-indigo-400 transition text-[10px] font-mono leading-none flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Zap className="w-3 h-3 text-indigo-400 shrink-0" /> Inject Simulation Advisory
            </button>
          </div>
        </div>

        {/* Floating/List Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications.filter(n => !n.team || trackedTeams.includes(n.team)).length > 0 ? (
            notifications
              .filter(n => !n.team || trackedTeams.includes(n.team))
              .map((notif) => {
                const isTrackedMatching = notif.team && trackedTeams.includes(notif.team);
                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border transition flex items-start gap-3 relative overflow-hidden group ${
                      notif.isNew 
                        ? 'bg-slate-950/80 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.03)]' 
                        : 'bg-slate-950/30 border-slate-900'
                    }`}
                  >
                    {/* Left Icon decoration based on type */}
                    <div className="pt-0.5 shrink-0">
                      {notif.type === 'match_time' ? (
                        <div className="p-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      ) : notif.type === 'lineup' ? (
                        <div className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Notification content text */}
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white tracking-tight">{notif.title}</span>
                        {isTrackedMatching && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 font-extrabold animate-pulse">
                            Tracked ({notif.team})
                          </span>
                        )}
                        {notif.isNew && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{notif.message}</p>
                      <span className="text-[9px] text-slate-500 font-mono block pt-0.5">{notif.timestamp}</span>
                    </div>

                    {/* Action button to dismiss */}
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="absolute right-2.5 top-2.5 text-slate-600 hover:text-slate-300 transition duration-150 p-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
          ) : (
            <div className="col-span-2 py-8 text-center text-xs text-slate-500 font-mono bg-slate-950/20 border border-dashed border-slate-900 rounded-xl space-y-1">
              <p>🔕 No notifications matching your tracked teams.</p>
              <p className="text-[10px] text-slate-600 font-normal">Toggle tracked teams above to filter squad feeds</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Data Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Charts and Overview */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Teams Points */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white tracking-tight">Top Championship Contenders</h3>
                <span className="text-xs font-mono text-slate-400">Points Summary</span>
              </div>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topTeamsData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="Points" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Model Performance History */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white tracking-tight">Predictive Model Upgrades</h3>
                <span className="text-xs font-mono text-rose-400 font-semibold">% Validation</span>
              </div>
              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyAccuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="season" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[60, 80]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="base" name="Standard Logistic" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="rf" name="Ensemble Predictor" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Recent Matches Table */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Recent Historical Matches</h3>
                <p className="text-xs text-slate-400">Archived outputs evaluated by classifiers</p>
              </div>
              <button 
                onClick={() => onNavigate('matches')} 
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                View Live Arena <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Teams</th>
                    <th className="py-2.5 px-3">Venue</th>
                    <th className="py-2.5 px-3">Scores</th>
                    <th className="py-2.5 px-3 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs">
                  {recentMatches.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        <span className="text-slate-300">{m.team1}</span>
                        <span className="text-slate-500 mx-1.5">vs</span>
                        <span className="text-slate-300">{m.team2}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-[150px]">{m.venue.split('(')[0]}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                        <div>{m.team1}: <span className="font-semibold text-slate-100">{m.team1Score?.split('(')[0]}</span></div>
                        <div>{m.team2}: <span className="font-semibold text-slate-100">{m.team2Score?.split('(')[0]}</span></div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {m.resultDetails.split('won')[0] + 'Won'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Points Table and League Raters */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* League Standings Points Table */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">IPL Points Table</h3>
                <p className="text-xs text-slate-400">Current season franchise standings</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                2026 Phase
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {TEAMS.map((team, idx) => (
                <div 
                  key={team.shortName} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-mono text-xs text-slate-500 text-center font-bold">
                      {idx + 1}
                    </span>
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${team.logoColor}`}></div>
                    <span className="font-semibold text-white tracking-tight">{team.name}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono font-bold">
                    <div className="text-slate-400 text-[11px]">
                      {team.won}W - {team.lost}L
                    </div>
                    <div className="text-rose-400 text-right w-8">
                      {team.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('teams')}
              className="w-full py-2 bg-slate-950 border border-slate-850 hover:border-slate-700/60 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Examine Full Team Analytics
            </button>
          </div>

          {/* Model Status Log Widget */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">Engine Security & Specs</h4>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between items-start border-b border-slate-850 pb-2">
                <span className="text-slate-400">Database Layer</span>
                <span className="text-white font-semibold font-mono text-right">In-Memory Store</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-850 pb-2">
                <span className="text-slate-400">Inference Core Router</span>
                <span className="text-emerald-400 font-bold font-mono">READY (LOCAL)</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-850 pb-2">
                <span className="text-slate-400">Scikit Pipeline Engine</span>
                <span className="text-white font-mono">RandomForest v1.4.1</span>
              </div>
              <div className="flex justify-between items-start pb-1">
                <span className="text-slate-400">Model Deployment State</span>
                <span className="text-indigo-400 font-semibold font-mono">Client Runtime v1.2</span>
              </div>
            </div>
            
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-300">
              <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>Configure Random Forest parameters, testing split options and feature-importance models directly inside the ML Engine tab.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
