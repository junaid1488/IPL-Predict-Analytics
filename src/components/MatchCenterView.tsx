import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Play, RotateCcw, AlertCircle, TrendingUp, Sparkles, Sliders, PlayCircle, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { MATCHES } from '../data/iplData';
import { exportMatchesToCSV, downloadMatchesStatsPDF, downloadLiveSimPDF } from '../utils/exportUtils';

interface BallByBallState {
  score: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
  target: number;
  batsman1: string;
  batsman1Runs: number;
  batsman2: string;
  batsman2Runs: number;
  bowler: string;
  bowlerWickets: number;
  bowlerRuns: number;
  history: { over: number; runs: number; wickets: number }[];
  lastBallDesc: string;
}

const initialMatchState: BallByBallState = {
  score: 142,
  wickets: 3,
  overs: 15,
  ballsInOver: 0,
  target: 195,
  batsman1: 'Virat Kohli',
  batsman1Runs: 64,
  batsman2: 'Glenn Maxwell',
  batsman2Runs: 22,
  bowler: 'Jasprit Bumrah',
  bowlerWickets: 2,
  bowlerRuns: 18,
  history: [
    { over: 1, runs: 8, wickets: 0 },
    { over: 2, runs: 15, wickets: 1 },
    { over: 3, runs: 28, wickets: 1 },
    { over: 4, runs: 34, wickets: 1 },
    { over: 5, runs: 42, wickets: 2 },
    { over: 6, runs: 53, wickets: 2 },
    { over: 7, runs: 65, wickets: 2 },
    { over: 8, runs: 71, wickets: 2 },
    { over: 9, runs: 80, wickets: 3 },
    { over: 10, runs: 89, wickets: 3 },
    { over: 11, runs: 101, wickets: 3 },
    { over: 12, runs: 115, wickets: 3 },
    { over: 13, runs: 122, wickets: 3 },
    { over: 14, runs: 132, wickets: 3 },
    { over: 15, runs: 142, wickets: 3 },
  ],
  lastBallDesc: 'Innings break completed. RCB requires 53 runs in 30 balls.'
};

export default function MatchCenterView() {
  const [matchState, setMatchState] = useState<BallByBallState>(initialMatchState);
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-play ball sim helper
  useEffect(() => {
    let timer: any;
    if (isSimulating) {
      timer = setInterval(() => {
        simulateNextBall();
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isSimulating, matchState]);

  const simulateNextBall = () => {
    setMatchState(prev => {
      // If target reached or game over, stop
      const ballsRemaining = (20 - prev.overs) * 6 - prev.ballsInOver;
      const runsNeeded = prev.target - prev.score;

      if (runsNeeded <= 0) {
        setIsSimulating(false);
        return { ...prev, lastBallDesc: 'MATCH ENDED! RCB won by wickets!' };
      }
      if (prev.wickets >= 10 || ballsRemaining <= 0) {
        setIsSimulating(false);
        return { ...prev, lastBallDesc: `MATCH ENDED! MI won by ${runsNeeded} runs!` };
      }

      // Ball outcomes probabilities
      const rand = Math.random();
      let runsScored = 0;
      let wicketFell = false;
      let desc = '';

      if (rand < 0.08) {
        wicketFell = true;
        desc = 'WICKET! Caught in the deep!';
      } else if (rand < 0.15) {
        runsScored = 4;
        desc = 'FOUR! Executed beautifully over extra cover!';
      } else if (rand < 0.22) {
        runsScored = 6;
        desc = 'SIX! Dispatched deep into the Wankhede crowd!';
      } else if (rand < 0.55) {
        runsScored = 1;
        desc = '1 Run, punched lightly down to long-on.';
      } else if (rand < 0.70) {
        runsScored = 2;
        desc = '2 Runs, driven into deep square-leg. Energetic running!';
      } else {
        runsScored = 0;
        desc = 'Dot ball, solid defensive forward stride.';
      }

      // Switch striker if odd runs
      let b1Runs = prev.batsman1Runs;
      let b2Runs = prev.batsman2Runs;
      if (runsScored === 1 || runsScored === 3) {
        b1Runs += runsScored;
        // switch striker text
      } else {
        b1Runs += runsScored;
      }

      let newBalls = prev.ballsInOver + 1;
      let newOvers = prev.overs;
      let newHistory = [...prev.history];

      if (newBalls >= 6) {
        newOvers += 1;
        newBalls = 0;
        // tally over history
        const lastOverRuns = prev.score + runsScored - (prev.history[prev.history.length-1]?.score || 0);
        newHistory.push({ over: newOvers, runs: prev.score + runsScored, wickets: prev.wickets + (wicketFell ? 1 : 0) });
      }

      return {
        ...prev,
        score: prev.score + runsScored,
        wickets: prev.wickets + (wicketFell ? 1 : 0),
        ballsInOver: newBalls,
        overs: newOvers,
        batsman1Runs: b1Runs,
        lastBallDesc: desc,
        history: newHistory
      };
    });
  };

  const resetSimulation = () => {
    setMatchState(initialMatchState);
    setIsSimulating(false);
  };

  // Derivative metrics
  const runsNeeded = Math.max(0, matchState.target - matchState.score);
  const totalOversPlayed = matchState.overs + (matchState.ballsInOver / 6);
  const ballsRemaining = Math.max(0, 120 - Math.round(totalOversPlayed * 6));
  const currentRunRate = totalOversPlayed > 0 ? (matchState.score / totalOversPlayed).toFixed(2) : '0';
  const requiredRunRate = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0';

  // Live win probability based on mathematical odds
  const winProbRCB = Math.round(
    Math.max(2, Math.min(98, 100 - (requiredRunRate > '0' ? parseFloat(requiredRunRate) * 7.5 : 50)))
  );
  const winProbMI = 100 - winProbRCB;

  // Re-adjust over history for graph rendering
  const graphData = matchState.history.map(h => ({
    over: `Over ${h.over}`,
    Runs: h.runs,
    Wickets: h.wickets * 10, // scale up for visual representation
  }));

  return (
    <div className="space-y-6">
      {/* Upper header with Match details & quick actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
            <Sparkles className="inline-block w-3.5 h-3.5 mr-1" /> Live Match Simulation
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Match Center Arena</h2>
          <p className="text-slate-400 text-sm mt-1">Monitor simulated over-by-over runs and wickets tracker.</p>
        </div>

        {/* Global Match Export Tools */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => exportMatchesToCSV(MATCHES)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Export full historical match dataset to CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV History</span>
          </button>
          <button
            onClick={() => downloadMatchesStatsPDF(MATCHES)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Download full tournament fixtures and match archival report PDF"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Schedule PDF</span>
          </button>
        </div>
      </div>

      {/* Simulation Controls Panel */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Simulation Control Console</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
              isSimulating 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isSimulating ? 'Pause Engine' : 'Auto Play Match'}
          </button>
          <button
            onClick={simulateNextBall}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 border border-slate-700/60 text-slate-300 disabled:opacity-50 hover:text-white transition active:scale-95 cursor-pointer"
          >
            Simulate Ball
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Reset Scorecard"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => downloadLiveSimPDF(matchState, runsNeeded, ballsRemaining, currentRunRate, requiredRunRate, winProbRCB, winProbMI)}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Export current simulation scorecard report PDF"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>Export Scorecard PDF</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Widget */}
      <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Target and runs information */}
          <div className="text-center md:text-left space-y-1">
            <span className="text-[10px] font-bold font-mono text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-full">Chasing Target: {matchState.target}</span>
            <p className="text-4xl font-extrabold text-white mt-1.5 font-mono">
              RCB: <span className="text-white">{matchState.score}</span> / <span className="text-slate-400">{matchState.wickets}</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Overs: <span className="text-slate-200 font-semibold">{matchState.overs}.{matchState.ballsInOver}</span> / <span className="text-slate-500">20.0</span>
            </p>
          </div>

          {/* Running metrics (CRR, RRR, Rem) */}
          <div className="flex justify-around bg-slate-950/60 border border-slate-850 p-4 rounded-xl text-center font-mono">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">CRR</p>
              <p className="text-base font-bold text-slate-200">{currentRunRate}</p>
            </div>
            <div className="border-r border-slate-850 h-8 self-center"></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">RRR</p>
              <p className="text-base font-bold text-rose-400">{requiredRunRate}</p>
            </div>
            <div className="border-r border-slate-850 h-8 self-center"></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Needed</p>
              <p className="text-base font-bold text-white">
                {runsNeeded} <span className="text-[9px] text-slate-500">runs</span>
              </p>
            </div>
          </div>

          {/* Winning Odds Gauge */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white text-center md:text-right font-sans">Live Win Probability</h4>
            <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden flex border border-slate-850">
              <div style={{ width: `${winProbRCB}%` }} className="bg-yellow-400 h-full"></div>
              <div style={{ width: `${winProbMI}%` }} className="bg-blue-500 h-full"></div>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>RCB: {winProbRCB}%</span>
              <span>MI: {winProbMI}%</span>
            </div>
          </div>

        </div>

        {/* Live event ticking banner */}
        <div className="mt-5 p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex items-start gap-3.5 text-xs">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mt-1"></div>
          <div>
            <span className="font-bold text-rose-400 font-mono uppercase tracking-wider text-[10px] mr-1">TICKER:</span>
            <span className="text-slate-300 italic">{matchState.lastBallDesc}</span>
          </div>
        </div>

      </div>

      {/* Under scorecard details: Batting, Bowling, Live Graph */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Batting and bowling cards */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Batting Card */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Batting Summary (RCB)</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-950/40 border border-slate-900">
                <div>
                  <p className="font-bold text-white">{matchState.batsman1} *</p>
                  <span className="text-[10px] text-slate-500">Striker</span>
                </div>
                <div className="font-mono text-right">
                  <span className="font-bold text-yellow-400 text-sm">{matchState.batsman1Runs}</span>
                  <span className="text-[10px] text-slate-500"> runs</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-950/40 border border-slate-900">
                <div>
                  <p className="font-bold text-white">{matchState.batsman2}</p>
                  <span className="text-[10px] text-slate-500 font-mono">Non-Striker</span>
                </div>
                <div className="font-mono text-right">
                  <span className="font-bold text-slate-300 text-sm">{matchState.batsman2Runs}</span>
                  <span className="text-[10px] text-slate-500"> runs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bowling Card */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Bowling Summary (MI)</h3>
            <div className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-950/40 border border-slate-900">
              <div>
                <p className="font-bold text-white">{matchState.bowler}</p>
                <span className="text-[10px] text-slate-500 font-mono">Pace Specialist</span>
              </div>
              <div className="font-mono text-right text-xs">
                <span className="font-bold text-rose-400">{matchState.bowlerWickets} wkts</span>
                <span className="text-slate-500"> • </span>
                <span className="text-slate-300">{matchState.bowlerRuns} runs conceded</span>
              </div>
            </div>
          </div>

        </div>

        {/* Over-by-over charts */}
        <div className="xl:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight leading-none">Innings Timeline Aggregation</h3>
          <p className="text-xs text-slate-400">Total runs scored and wickets fell trajectory over-by-over</p>

          <div className="h-64 mt-1">
            {graphData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                Initiate match simulation to populate graphs.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="over" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="Runs" stroke="#f43f5e" fillOpacity={1} fill="url(#colorRuns)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
