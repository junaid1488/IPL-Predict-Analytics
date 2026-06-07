import React, { useState } from 'react';
import { VENUES } from '../data/iplData';
import { Venue } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Landmark, Compass, Award, Percent, ThermometerSnowflake, Sparkles, Target, Flame, Activity } from 'lucide-react';

// Historical batting out-field scoring distribution (8 sectors)
const BATTING_ZONES = [
  {
    id: 'straight',
    label: 'Straight Sightscreen',
    desc: 'Straight drives, lofts, and straight-batted front-foot drives along the sightscreen line.',
    angles: [337.5, 382.5],
    percentage: { v1: 12, v2: 17, v3: 13, v4: 10, v5: 11 },
    runs: { v1: 240, v2: 290, v3: 310, v4: 180, v5: 220 },
    sixes: { v1: 14, v2: 8, v3: 18, v4: 12, v5: 10 },
    avgSpeed: { v1: 141, v2: 132, v3: 145, v4: 139, v5: 138 },
    type: 'V-Straight'
  },
  {
    id: 'mid-on',
    label: 'Mid-On / Long-On',
    desc: 'Power lofting over the inner ring, flick-ons, and front-foot drives on the leg side.',
    angles: [22.5, 67.5],
    percentage: { v1: 13, v2: 11, v3: 13, v4: 11, v5: 15 },
    runs: { v1: 260, v2: 190, v3: 310, v4: 200, v5: 300 },
    sixes: { v1: 14, v2: 5, v3: 21, v4: 12, v5: 18 },
    avgSpeed: { v1: 136, v2: 131, v3: 141, v4: 138, v5: 139 },
    type: 'On-Side'
  },
  {
    id: 'mid-wicket',
    label: 'Mid-Wicket / Cow Corner',
    desc: 'Premium deep power-hitting sector for slog sweeps, pulls, and heave boundary clearers.',
    angles: [67.5, 112.5],
    percentage: { v1: 22, v2: 18, v3: 24, v4: 21, v5: 19 },
    runs: { v1: 440, v2: 310, v3: 565, v4: 380, v5: 380 },
    sixes: { v1: 35, v2: 16, v3: 42, v4: 28, v5: 24 },
    avgSpeed: { v1: 144, v2: 134, v3: 147, v4: 141, v5: 140 },
    type: 'On-Side'
  },
  {
    id: 'square-leg',
    label: 'Square Leg / Pull Sweep',
    desc: 'Behind-square flicks, sweep shots against spin, and hook-pull boundaries.',
    angles: [112.5, 157.5],
    percentage: { v1: 11, v2: 15, v3: 10, v4: 12, v5: 12 },
    runs: { v1: 220, v2: 260, v3: 240, v4: 220, v5: 240 },
    sixes: { v1: 11, v2: 12, v3: 15, v4: 14, v5: 11 },
    avgSpeed: { v1: 133, v2: 131, v3: 136, v4: 133, v5: 134 },
    type: 'Behind Square'
  },
  {
    id: 'fine-leg',
    label: 'Fine Leg / Glance',
    desc: 'Fine paddle scoops, glances, defensive depletions, and leg-side runs.',
    angles: [157.5, 202.5],
    percentage: { v1: 6, v2: 8, v3: 5, v4: 6, v5: 6 },
    runs: { v1: 120, v2: 140, v3: 120, v4: 110, v5: 120 },
    sixes: { v1: 5, v2: 4, v3: 8, v4: 6, v5: 5 },
    avgSpeed: { v1: 128, v2: 125, v3: 131, v4: 128, v5: 128 },
    type: 'Behind Square'
  },
  {
    id: 'third-man',
    label: 'Third Man / Upper Cut',
    desc: 'Late cuts, third man guiding flicks, and upper cuts against high-pace bouncers.',
    angles: [202.5, 247.5],
    percentage: { v1: 11, v2: 9, v3: 12, v4: 10, v5: 10 },
    runs: { v1: 210, v2: 150, v3: 280, v4: 185, v5: 200 },
    sixes: { v1: 8, v2: 3, v3: 11, v4: 5, v5: 6 },
    avgSpeed: { v1: 131, v2: 126, v3: 134, v4: 129, v5: 130 },
    type: 'Behind Square'
  },
  {
    id: 'deep-cover',
    label: 'Deep Cover / Square Cut',
    desc: 'Off-side square-cuts, cover boundary drives, and lofts over backward point.',
    angles: [247.5, 292.5],
    percentage: { v1: 17, v2: 12, v3: 19, v4: 20, v5: 16 },
    runs: { v1: 340, v2: 210, v3: 450, v4: 360, v5: 320 },
    sixes: { v1: 18, v2: 6, v3: 26, v4: 21, v5: 12 },
    avgSpeed: { v1: 138, v2: 129, v3: 142, v4: 140, v5: 136 },
    type: 'Off-Side'
  },
  {
    id: 'mid-off',
    label: 'Mid-Off / Extra Cover',
    desc: 'Direct front-foot drives over cover rating, off-side punches, and straight clears.',
    angles: [292.5, 337.5],
    percentage: { v1: 12, v2: 10, v3: 14, v4: 12, v5: 14 },
    runs: { v1: 235, v2: 170, v3: 325, v4: 215, v5: 280 },
    sixes: { v1: 12, v2: 4, v3: 19, v4: 11, v5: 15 },
    avgSpeed: { v1: 135, v2: 130, v3: 140, v4: 137, v5: 138 },
    type: 'Off-Side'
  },
];

// Historical bowling coordinate landing segments (4 lengths x 3 lines)
const BOWLING_ZONES = [
  // Short length row
  { id: 'short-off', length: 'Short', line: 'Outside Off', intensity: { v1: 45, v2: 30, v3: 50, v4: 40, v5: 42 }, wickets: { v1: 14, v2: 5, v3: 12, v4: 9, v5: 10 }, econ: { v1: 9.8, v2: 8.5, v3: 10.4, v4: 9.1, v5: 9.0 }, dots: { v1: 35, v2: 42, v3: 32, v4: 38, v5: 40 } },
  { id: 'short-stumps', length: 'Short', line: 'On Stumps', intensity: { v1: 65, v2: 40, v3: 75, v4: 55, v5: 60 }, wickets: { v1: 18, v2: 8, v3: 15, v4: 12, v5: 14 }, econ: { v1: 10.5, v2: 9.2, v3: 11.8, v4: 9.9, v5: 9.8 }, dots: { v1: 28, v2: 35, v3: 25, v4: 30, v5: 32 } },
  { id: 'short-leg', length: 'Short', line: 'Down Leg', intensity: { v1: 40, v2: 25, v3: 45, v4: 35, v5: 38 }, wickets: { v1: 9, v2: 3, v3: 8, v4: 6, v5: 7 }, econ: { v1: 11.2, v2: 9.8, v3: 12.3, v4: 10.5, v5: 10.4 }, dots: { v1: 22, v2: 30, v3: 20, v4: 25, v5: 26 } },
  
  // Good length row
  { id: 'good-off', length: 'Good', line: 'Outside Off', intensity: { v1: 85, v2: 70, v3: 80, v4: 82, v5: 85 }, wickets: { v1: 32, v2: 19, v3: 28, v4: 26, v5: 29 }, econ: { v1: 7.2, v2: 6.2, v3: 7.8, v4: 7.1, v5: 7.0 }, dots: { v1: 52, v2: 58, v3: 48, v4: 50, v5: 53 } },
  { id: 'good-stumps', length: 'Good', line: 'On Stumps', intensity: { v1: 90, v2: 95, v3: 85, v4: 90, v5: 92 }, wickets: { v1: 41, v2: 48, v3: 31, v4: 35, v5: 38 }, econ: { v1: 7.5, v2: 5.6, v3: 8.2, v4: 7.4, v5: 7.1 }, dots: { v1: 48, v2: 63, v3: 42, v4: 46, v5: 51 } },
  { id: 'good-leg', length: 'Good', line: 'Down Leg', intensity: { v1: 55, v2: 50, v3: 50, v4: 52, v5: 53 }, wickets: { v1: 15, v2: 14, v3: 11, v4: 12, v5: 13 }, econ: { v1: 8.8, v2: 7.5, v3: 9.4, v4: 8.5, v5: 8.2 }, dots: { v1: 38, v2: 44, v3: 34, v4: 39, v5: 41 } },
  
  // Full length row
  { id: 'full-off', length: 'Full', line: 'Outside Off', intensity: { v1: 70, v2: 60, v3: 75, v4: 68, v5: 70 }, wickets: { v1: 22, v2: 12, v3: 24, v4: 18, v5: 20 }, econ: { v1: 8.5, v2: 7.4, v3: 9.2, v4: 8.3, v5: 8.0 }, dots: { v1: 42, v2: 48, v3: 39, v4: 41, v5: 44 } },
  { id: 'full-stumps', length: 'Full', line: 'On Stumps', intensity: { v1: 75, v2: 80, v3: 70, v4: 72, v5: 74 }, wickets: { v1: 27, v2: 24, v3: 22, v4: 21, v5: 23 }, econ: { v1: 8.9, v2: 7.1, v3: 9.5, v4: 8.6, v5: 8.3 }, dots: { v1: 39, v2: 50, v3: 35, v4: 38, v5: 40 } },
  { id: 'full-leg', length: 'Full', line: 'Down Leg', intensity: { v1: 42, v2: 45, v3: 40, v4: 41, v5: 40 }, wickets: { v1: 10, v2: 9, v3: 8, v4: 8, v5: 9 }, econ: { v1: 10.2, v2: 8.8, v3: 11.0, v4: 9.8, v5: 9.6 }, dots: { v1: 26, v2: 33, v3: 24, v4: 28, v5: 29 } },
  
  // Yorker length row
  { id: 'yorker-off', length: 'Yorker', line: 'Outside Off', intensity: { v1: 58, v2: 45, v3: 62, v4: 55, v5: 58 }, wickets: { v1: 12, v2: 6, v3: 14, v4: 10, v5: 11 }, econ: { v1: 7.0, v2: 6.5, v3: 7.5, v4: 6.8, v5: 6.7 }, dots: { v1: 55, v2: 58, v3: 52, v4: 54, v5: 56 } },
  { id: 'yorker-stumps', length: 'Yorker', line: 'On Stumps', intensity: { v1: 82, v2: 75, v3: 88, v4: 80, v5: 84 }, wickets: { v1: 34, v2: 22, v3: 38, v4: 29, v5: 32 }, econ: { v1: 6.4, v2: 6.0, v3: 6.9, v4: 6.3, v5: 6.2 }, dots: { v1: 62, v2: 65, v3: 58, v4: 60, v5: 61 } },
  { id: 'yorker-leg', length: 'Yorker', line: 'Down Leg', intensity: { v1: 38, v2: 30, v3: 42, v4: 35, v5: 36 }, wickets: { v1: 6, v2: 4, v3: 7, v4: 5, v5: 5 }, econ: { v1: 8.5, v2: 7.8, v3: 9.0, v4: 8.2, v5: 8.0 }, dots: { v1: 38, v2: 44, v3: 35, v4: 38, v5: 40 } },
];

export default function VenueAnalyticsView() {
  const [selectedVenueId, setSelectedVenueId] = useState<string>('v1'); // default Wankhede
  const [imageError, setImageError] = useState<boolean>(false);
  
  // Reactively clear image error states on stadium switch
  React.useEffect(() => {
    setImageError(false);
  }, [selectedVenueId]);
  
  // Interactive heatmap control states
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling'>('batting');
  const [selectedBattingId, setSelectedBattingId] = useState<string>('mid-wicket');
  const [selectedBowlingId, setSelectedBowlingId] = useState<string>('good-stumps');

  const selectedVenue = VENUES.find(v => v.id === selectedVenueId) || VENUES[0];

  // Selected details
  const activeBattingZone = BATTING_ZONES.find(b => b.id === selectedBattingId) || BATTING_ZONES[2];
  const activeBowlingZone = BOWLING_ZONES.find(b => b.id === selectedBowlingId) || BOWLING_ZONES[4];

  // Helper to compute SVG Wagon Wheel paths dynamically
  const getSectorPath = (startAngle: number, endAngle: number, radius: number) => {
    const cx = 120;
    const cy = 120;
    const rad = (deg: number) => (deg - 90) * Math.PI / 180;
    
    const x1 = cx + radius * Math.cos(rad(startAngle));
    const y1 = cy + radius * Math.sin(rad(startAngle));
    const x2 = cx + radius * Math.cos(rad(endAngle));
    const y2 = cy + radius * Math.sin(rad(endAngle));
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // Compare avg first innings score
  const barChartData = VENUES.map(v => ({
    name: v.name.split(' ')[0], // short name
    'Avg 1st Innings': v.avgFirstInnings,
    'Chase Success %': v.chaseSuccessPct,
  }));

  // Geographic mapping nodes (stadium coordinates mapped nicely inside the satellite map of India)
  const mapStadiums = [
    { id: 'v5', name: 'Narendra Modi', city: 'Ahmedabad', x: 28, y: 46, capacity: '132,000' },
    { id: 'v1', name: 'Wankhede', city: 'Mumbai', x: 31, y: 59, capacity: '33,000' },
    { id: 'v3', name: 'Chinnaswamy', city: 'Bengaluru', x: 41, y: 79, capacity: '40,000' },
    { id: 'v2', name: 'Chepauk', city: 'Chennai', x: 48, y: 81, capacity: '50,000' },
    { id: 'v4', name: 'Eden Gardens', city: 'Kolkata', x: 73, y: 43, capacity: '66,000' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
          🏟 Stadium Intel
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans">Venue & Arena Intelligence</h2>
        <p className="text-slate-400 text-sm">Review stadium specifications, average innings limits, and pitch spin/pace weightings.</p>
      </div>

      {/* Main Grid: Map & Venue comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Geographic Maps / Node Highlighters */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Compass className="w-4 h-4 text-rose-500 animate-[spin_8s_linear_infinite]" />
              Geographic Arena Map
            </h3>
            <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider font-mono">India Hubs</span>
          </div>
          
          {/* Custom coordinate visual map with Satellite imagery */}
          <div className="relative aspect-square w-full rounded-xl bg-slate-950 border border-slate-800/60 flex items-center justify-center overflow-hidden p-0 shadow-2xl group/map">
            <div className="absolute inset-0 bg-grid-slate-900/60 pointer-events-none z-10 opacity-40"></div>
            
            {/* Real Satellite Map of India provided by user */}
            <img 
              src="https://img.freepik.com/premium-photo/blank-isolated-physical-satellite-map-india_509477-2357.jpg?w=1480" 
              alt="India Satellite Geography Map" 
              className="absolute inset-0 w-full h-full object-cover opacity-70 filter brightness-[0.8] contrast-125 saturate-100 group-hover/map:opacity-85 group-hover/map:scale-105 transition-all duration-[1200ms] ease-out select-none"
              referrerPolicy="no-referrer"
            />
            
            {/* Dark Vignette Overlay for premium visual blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none z-10" />
            <div className="absolute inset-0 shadow-[inset_0_0_35px_rgba(2,6,23,0.85)] pointer-events-none z-10" />
            
            {/* SVG Annotations & Environmental Cues */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10" strokeWidth="0.5">
              {/* Surrounding Seas Labels */}
              <text x="14" y="86" className="fill-slate-400/70 font-mono text-[4.5px] tracking-[0.2em] uppercase font-extrabold" textAnchor="middle">Arabian Sea</text>
              <text x="86" y="86" className="fill-slate-400/70 font-mono text-[4.5px] tracking-[0.2em] uppercase font-extrabold" textAnchor="middle">Bay of Bengal</text>
              <text x="50" y="97" className="fill-slate-400/50 font-mono text-[4px] tracking-[0.15em] uppercase font-bold" textAnchor="middle">Indian Ocean</text>
              
              {/* Regional helper indicators/text */}
              <text x="50" y="15" className="fill-slate-400/40 font-mono text-[3.2px] tracking-wider uppercase" textAnchor="middle">North Region</text>
              <text x="50" y="76" className="fill-slate-400/40 font-mono text-[3.2px] tracking-wider uppercase" textAnchor="middle">South Region</text>
              
              {/* Subtle map coordinate grid lines */}
              <line x1="50" y1="0" x2="50" y2="100" className="stroke-slate-700/20" strokeWidth="0.25" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="100" y2="50" className="stroke-slate-700/20" strokeWidth="0.25" strokeDasharray="3 3" />
            </svg>

            {/* Stadium interactive nodes */}
            {mapStadiums.map((stad) => (
              <button
                key={stad.id}
                onClick={() => setSelectedVenueId(stad.id)}
                style={{ left: `${stad.x}%`, top: `${stad.y}%` }}
                className={`absolute p-1.5 -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer ${
                  selectedVenueId === stad.id ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                }`}
              >
                <span className="relative flex h-3 w-3">
                  {selectedVenueId === stad.id && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    selectedVenueId === stad.id ? 'bg-rose-500' : 'bg-slate-700 hover:bg-rose-400'
                  }`}></span>
                </span>
                <span className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900/95 border border-slate-800/80 text-[9px] px-1.5 py-0.5 pointer-events-none transition-all font-semibold ${
                  selectedVenueId === stad.id ? 'text-rose-400 font-bold border-rose-500/35' : 'text-slate-400'
                }`}>
                  {stad.name.split(' ')[0]}
                </span>
              </button>
            ))}

            <div className="absolute bottom-2.5 right-2.5 text-[9px] text-slate-400 font-mono z-20 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/40">
              Click pins to audit metadata
            </div>
          </div>
        </div>

        {/* Detailed Venue Profile Card */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-6 bg-gradient-to-b from-slate-900/60 to-slate-950 rounded-2xl border border-slate-800/80 p-5 space-y-5 overflow-hidden">
            
            {/* Robust Fallback-Capable Image Container */}
            <div className="h-36 -mx-5 -mt-5 mb-4 relative overflow-hidden group border-b border-slate-800/60 bg-slate-950">
              {!imageError && selectedVenue.imageUrl ? (
                <img 
                  src={selectedVenue.imageUrl} 
                  alt={selectedVenue.name} 
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                /* Styled Procedural Cricket Pitch Vector Backup for broken links */
                <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-950 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />
                  
                  {/* Outer Field Ground Oval */}
                  <div className="w-44 h-24 rounded-full border border-rose-500/10 flex items-center justify-center relative">
                    {/* Popping loop */}
                    <div className="w-28 h-12 rounded-full border border-dashed border-slate-800 flex items-center justify-center">
                      {/* Center 22-Yard Pitch Rect */}
                      <div className="w-6 h-10 bg-emerald-950/40 border border-emerald-500/20 rounded-sm flex flex-col justify-between py-0.5 px-1">
                        <div className="h-[1.5px] bg-white/30 w-full" />
                        <div className="h-[1.5px] bg-white/30 w-full" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Styled Neon Search Beam */}
                  <div className="absolute top-0 left-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 right-6 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-0.5 bg-slate-950/85 border border-slate-800 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">{selectedVenue.city} Intelligence</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">{selectedVenue.city} Venue</span>
                <h3 className="text-base font-bold text-white tracking-tight leading-none mt-0.5">{selectedVenue.name}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60 text-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Avg 1st Innings</p>
                <p className="text-xl font-extrabold text-white mt-1">{selectedVenue.avgFirstInnings} runs</p>
              </div>
              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60 text-center">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Chase Success Rate</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-1">{selectedVenue.chaseSuccessPct}%</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  Highest Score Total
                </span>
                <span className="font-mono text-white font-semibold">{selectedVenue.highestScore}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-slate-400" />
                  Lowest Defended Score
                </span>
                <span className="font-mono text-white font-semibold">{selectedVenue.lowestScore}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-400">Pitch Characteristic</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                  {selectedVenue.pitchType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
                  Spin / Pace Balance
                </span>
                <span className="font-mono text-slate-300 font-semibold">{selectedVenue.spinVsPace}</span>
              </div>
            </div>
          </div>

          {/* First Innings Score Comparative Graph */}
          <div className="md:col-span-6 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Average First Innings Score</h3>
            <p className="text-xs text-slate-400">Mapping runs threshold across major stadiums</p>

            <div className="h-60 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[150, 190]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Bar dataKey="Avg 1st Innings" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Pitch & Outfield Heatmaps Panel */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 space-y-6">
        
        {/* Header containing Toggle and Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-rose-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Impact Zone Analysis
            </div>
            <h3 className="text-xl font-bold text-white font-sans">Interactive Stadium Hot-Zones</h3>
            <p className="text-slate-400 text-xs mt-1">
              Audit granular batting shot directions and length coordinates computed through {selectedVenue.name} games historical datasets.
            </p>
          </div>

          {/* Interactive Mode Swapper Buttons */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850 self-stretch md:self-auto">
            <button
              onClick={() => {
                setActiveTab('batting');
                setSelectedBattingId('mid-wicket');
              }}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'batting'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Batting Outfield Heat
            </button>
            <button
              onClick={() => {
                setActiveTab('bowling');
                setSelectedBowlingId('good-stumps');
              }}
              className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'bowling'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              Bowling Length Heat
            </button>
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* Heatmap Visual Canvas */}
          <div className="xl:col-span-5 bg-slate-950 rounded-2xl border border-slate-800/60 p-6 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-at-t from-slate-900 via-slate-950 to-slate-950 opacity-40 pointer-events-none"></div>
            
            {activeTab === 'batting' ? (
              /* BATTING WAGON WHEEL HEATMAP */
              <div className="w-full flex flex-col items-center space-y-4">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest font-semibold">Wagon Wheel Offense Map</span>
                
                <svg viewBox="0 0 240 240" className="w-full max-w-[240px] h-auto drop-shadow-xl select-none">
                  {/* Outer boundary circle of cricket field */}
                  <circle cx="120" cy="120" r="95" className="fill-none stroke-rose-500/10" strokeWidth="1" />
                  <circle cx="120" cy="120" r="85" className="fill-none stroke-slate-800" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Central Pitch Marker representing shot origin */}
                  <rect x="116" y="95" width="8" height="50" rx="1.5" className="fill-emerald-950 stroke-emerald-500/20" />
                  <line x1="112" y1="105" x2="128" y2="105" className="stroke-slate-700" strokeWidth="1" />
                  <line x1="112" y1="135" x2="128" y2="135" className="stroke-slate-700" strokeWidth="1.5" />
                  
                  {/* Dynamic Sector Slices Rendering */}
                  {BATTING_ZONES.map((sec) => {
                    const pct = sec.percentage[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5'] || 10;
                    // Max percentage in dataset is ~24. Calculate relative opacity
                    const relativeOpacity = 0.15 + 0.75 * (pct / 24);
                    const isSelected = selectedBattingId === sec.id;
                    const fillStyle = isSelected 
                      ? 'rgba(244, 63, 94, 0.9)' 
                      : `rgba(244, 63, 94, ${relativeOpacity})`;

                    return (
                      <path
                        key={sec.id}
                        d={getSectorPath(sec.angles[0], sec.angles[1], 83)}
                        fill={fillStyle}
                        className={`transition-colors duration-150 cursor-pointer ${
                          isSelected 
                            ? 'stroke-white stroke-2 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]' 
                            : 'stroke-slate-900/65 stroke-[1.5] hover:stroke-rose-400 hover:fill-rose-500/80'
                        }`}
                        onClick={() => setSelectedBattingId(sec.id)}
                      >
                        <title>{sec.label} ({pct}%)</title>
                      </path>
                    );
                  })}

                  {/* Ground compass directions */}
                  <text x="120" y="24" className="fill-slate-600 font-mono text-[9px] font-bold text-center" textAnchor="middle">Straight</text>
                  <text x="120" y="222" className="fill-slate-600 font-mono text-[9px] font-bold text-center" textAnchor="middle">Wicketkeeper</text>
                  <text x="18" y="123" className="fill-slate-600 font-mono text-[9px] font-bold text-center" textAnchor="start">Off Side</text>
                  <text x="222" y="123" className="fill-slate-600 font-mono text-[9px] font-bold text-center" textAnchor="end">On Side</text>
                </svg>
              </div>
            ) : (
              /* BOWLING DELIVERY PITCH HEATMAP */
              <div className="w-full flex flex-col items-center space-y-4">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest font-semibold">22-Yard Seam Dispersion pitch grid</span>
                
                <svg viewBox="0 0 240 240" className="w-full max-w-[240px] h-auto drop-shadow-xl select-none">
                  {/* Field Background outer boundaries */}
                  <rect x="25" y="15" width="190" height="210" rx="4" className="fill-slate-950 stroke-slate-800" strokeWidth="1" />
                  
                  {/* Delivery crease / popping crease */}
                  <line x1="25" y1="210" x2="215" y2="210" className="stroke-slate-700/60" strokeWidth="1.5" />
                  <text x="25" y="220" className="fill-slate-500 font-mono text-[8px]">Popping Crease</text>
                  
                  {/* Dynamic Heat Cells (3 lines outside-off, on-stumps, down-leg x 4 lengths short, good, full, yorker) */}
                  {BOWLING_ZONES.map((cell) => {
                    const intensityVal = cell.intensity[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5'] || 40;
                    // Max intensity in data is 95. Calculate relative opacity
                    const relativeOpacity = 0.15 + 0.75 * (intensityVal / 95);
                    const isSelected = selectedBowlingId === cell.id;
                    const fillStyle = isSelected
                      ? 'rgba(245, 158, 11, 0.9)'
                      : `rgba(245, 158, 11, ${relativeOpacity})`;

                    // Determine landing coordinate box
                    let x = 30;
                    if (cell.line === 'On Stumps') x = 90;
                    if (cell.line === 'Down Leg') x = 150;

                    let y = 20;
                    if (cell.length === 'Good') y = 65;
                    if (cell.length === 'Full') y = 110;
                    if (cell.length === 'Yorker') y = 155;

                    return (
                      <rect
                        key={cell.id}
                        x={x}
                        y={y}
                        width="55"
                        height="40"
                        rx="3"
                        fill={fillStyle}
                        className={`transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? 'stroke-white stroke-2 drop-shadow-[0_0_12px_rgba(245,158,11,0.55)]'
                            : 'stroke-slate-950 stroke-[1.5] hover:stroke-amber-400 hover:fill-amber-500/80'
                        }`}
                        onClick={() => setSelectedBowlingId(cell.id)}
                      >
                        <title>{cell.length} length - {cell.line} ({intensityVal}% landing frequency)</title>
                      </rect>
                    );
                  })}

                  {/* Draw the Wickets at the bottom crease line (x=120) */}
                  <g className="opacity-90">
                    <line x1="116" y1="205" x2="116" y2="210" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="120" y1="205" x2="120" y2="210" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="124" y1="205" x2="124" y2="210" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1="114" y1="205" x2="126" y2="205" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>

                  {/* Row length labels */}
                  <text x="210" y="42" className="fill-slate-500 font-mono text-[8px] text-right" textAnchor="end">Short</text>
                  <text x="210" y="87" className="fill-slate-500 font-mono text-[8px] text-right" textAnchor="end">Good</text>
                  <text x="210" y="132" className="fill-slate-500 font-mono text-[8px] text-right" textAnchor="end">Full</text>
                  <text x="210" y="177" className="fill-slate-500 font-mono text-[8px] text-right" textAnchor="end">Yorker</text>

                  {/* Line labels at bottom */}
                  <text x="57" y="234" className="fill-slate-600 font-mono text-[8px]" textAnchor="middle">Outside Off</text>
                  <text x="117" y="234" className="fill-slate-600 font-mono text-[8px]" textAnchor="middle">On Stumps</text>
                  <text x="177" y="234" className="fill-slate-600 font-mono text-[8px]" textAnchor="middle">Down Leg</text>
                </svg>
              </div>
            )}

            {/* Continuous Legend index at bottom */}
            <div className="mt-4 flex items-center justify-between w-full border-t border-slate-900 pt-3 text-[10px] text-slate-500 font-mono">
              <span>Low Performance Impact</span>
              <div className="w-24 h-2 bg-gradient-to-r from-rose-500/10 to-rose-500 rounded-sm"></div>
              <span>High Intensity</span>
            </div>
          </div>

          {/* Granular Detailed Performance Sidebar */}
          <div className="xl:col-span-7 flex flex-col justify-between space-y-6">
            
            {activeTab === 'batting' ? (
              /* BATTING TARGET ZONE AUDIT DATA */
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {activeBattingZone.type}
                  </span>
                  <h4 className="text-base font-bold text-white tracking-tight">{activeBattingZone.label}</h4>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeBattingZone.desc}
                </p>

                {/* Statistics Bento Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Boundary Ratio</span>
                    <span className="text-lg font-black text-rose-400 block mt-1">
                      {activeBattingZone.percentage[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">Runs distribution</span>
                  </div>
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Cumulative Runs</span>
                    <span className="text-lg font-black text-white block mt-1">
                      {activeBattingZone.runs[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Recorded tally</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Cleared Sixes</span>
                    <span className="text-lg font-black text-white block mt-1">
                      {activeBattingZone.sixes[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Cleared over bounds</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Avg Ball Exit Speed</span>
                    <span className="text-lg font-black text-emerald-400 block mt-1">
                      {activeBattingZone.avgSpeed[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']} <span className="text-[10px] font-normal text-slate-400">km/h</span>
                    </span>
                    <span className="text-[9px] text-slate-500 block">Exit velocity peak</span>
                  </div>
                </div>

                {/* Strategic Advice based on Sector and Venue */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-mono text-xs uppercase font-semibold">
                    <Activity className="w-3.5 h-3.5" />
                    Wagon Wheel Tactical Intelligence
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    At <span className="text-white font-semibold">{selectedVenue.name}</span>, scoring in the <span className="text-white font-semibold">{activeBattingZone.label}</span> is highly affected by {selectedVenue.pitchType.toLowerCase()} settings. 
                    {selectedVenueId === 'v3' && " The short boundary thresholds here encourage high lofts. Bowlers frequently resort to wider lines to cut off this high exit speed."}
                    {selectedVenueId === 'v2' && " With Chepauk's spinning dust, front foot slog-sweeps into Mid-wicket are high risk, with key wickets landing in the deep field."}
                    {selectedVenueId === 'v1' && " Fast outfields here yield rapid boundary runs for clean drives. Fielders must stay exceptionally deep to contain limits."}
                    {selectedVenueId === 'v4' && " Slow turn requires batsman to utilize timing rather than raw force to bypass active inner ring blocks."}
                    {selectedVenueId === 'v5' && " Large ground boundaries demand heavy reliance on double runs. Straight lines are safer to clear than corner flags."}
                  </p>
                </div>
              </div>
            ) : (
              /* BOWLING TARGET ZONE AUDIT DATA */
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    {activeBowlingZone.length} & {activeBowlingZone.line}
                  </span>
                  <h4 className="text-base font-bold text-white tracking-tight">Pitch Spot Assessment</h4>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  Historical statistics of balls landing at <span className="text-rose-400 font-semibold">{activeBowlingZone.length} length</span> attacking the <span className="text-rose-400 font-semibold">{activeBowlingZone.line} line</span> corridor.
                </p>

                {/* Statistics Bento Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Landing Dispersion</span>
                    <span className="text-lg font-black text-amber-400 block mt-1 animate-pulse">
                      {activeBowlingZone.intensity[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">Landing frequency ratio</span>
                  </div>
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Captured Wickets</span>
                    <span className="text-lg font-black text-white block mt-1">
                      {activeBowlingZone.wickets[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Registered dismissals</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Economy Rate</span>
                    <span className="text-lg font-black text-white block mt-1">
                      {activeBowlingZone.econ[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}
                    </span>
                    <span className="text-[9px] text-slate-500 block">Runs conceded / over</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Scout Dot %</span>
                    <span className="text-lg font-black text-emerald-400 block mt-1">
                      {activeBowlingZone.dots[selectedVenueId as 'v1' | 'v2' | 'v3' | 'v4' | 'v5']}%
                    </span>
                    <span className="text-[9px] text-slate-500 block">No-run delivery ratio</span>
                  </div>
                </div>

                {/* Strategic Advice based on Delivery Spot and Venue */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs uppercase font-semibold">
                    <Target className="w-3.5 h-3.5" />
                    Delivery Spot Seam Intelligence
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Landing a <span className="text-white font-semibold">{activeBowlingZone.length}</span> delivery targeting the <span className="text-white font-semibold">{activeBowlingZone.line}</span> at <span className="text-white font-semibold">{selectedVenue.name}</span>:
                    {activeBowlingZone.length === 'Short' && " generates substantial bounce. However, small boundaries make pullling highly viable. Use bouncers selectively."}
                    {activeBowlingZone.length === 'Good' && " is the prime channel. Defending batters struggle due to seam deviation. Highly recommended length to build pressure."}
                    {activeBowlingZone.length === 'Full' && " invites front-foot drives. Outfield speeds might punish loose lengths with swift cover boundaries unless swinging strongly."}
                    {activeBowlingZone.length === 'Yorker' && " remains the most defensive option in death overs. Pin-point accuracy On Stumps yields substantial bowled/LBW counts."}
                  </p>
                </div>
              </div>
            )}

            {/* Quick interactive note */}
            <div className="text-[10px] text-slate-500 font-mono italic text-right bg-slate-900/40 p-2.5 rounded-lg border border-slate-850">
              💡 Hint: Direct interactive visual click controls are fully live. Click on any wheel segment or pitch zone to retrieve metric updates.
            </div>
            
          </div>

        </div>

      </div>
    </div>
  );
}

