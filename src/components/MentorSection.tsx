import React, { useState } from 'react';
import { BookOpen, FolderOpen, Database, Cpu, Layout, Play, Code, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function MentorSection() {
  const [activeTab, setActiveTab] = useState<'folders' | 'schema' | 'api' | 'ml' | 'frontend' | 'plan'>('folders');

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl text-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-sm uppercase tracking-widest font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            Mentor Insights
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Engineering Architecture & Portfolio Guide</h2>
          <p className="text-slate-400 text-sm">Review production blueprint guidelines, schemas, and pipeline structures curated by your Senior Coding Mentor.</p>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800/60">
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'folders' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FolderOpen className="inline w-3.5 h-3.5 mr-1" /> Folder Structure
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'schema' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="inline w-3.5 h-3.5 mr-1" /> Database Schema
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'api' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code className="inline w-3.5 h-3.5 mr-1" /> API Specs
          </button>
          <button
            onClick={() => setActiveTab('ml')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'ml' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="inline w-3.5 h-3.5 mr-1" /> ML Pipeline
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'frontend' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layout className="inline w-3.5 h-3.5 mr-1" /> SPA Architecture
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'plan' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Play className="inline w-3.5 h-3.5 mr-1" /> Deploy Steps
          </button>
        </div>
      </div>

      {activeTab === 'folders' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="p-1 rounded bg-slate-800 text-rose-400 font-mono text-xs">/</span>
            Production Full-Stack Repository Tree
          </h3>
          <p className="text-sm text-slate-300">
            A modular multi-service monorepo structure guarantees independent scaling of backend API computation from the frontend SPA.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs leading-relaxed overflow-x-auto text-emerald-400">
{`ipl-analytics-platform/
├── backend/                  # FastAPI Performance Microservice (Python)
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/    # matches.py, players.py, predictions.py
│   │   │   └── deps.py       # DB Dependency Injection, Auth Guard middleware
│   │   ├── core/             # config.py, security.py, ml_model_loader.py
│   │   ├── db/               # base.py, session.py, models.py (SQLAlchemy)
│   │   ├── schemas/          # pydantic schemas matching SQL entities
│   │   ├── models/           # trained pipeline binary (random_forest.pkl)
│   │   └── main.py           # FastAPI initialization, routing table
│   ├── requirements.txt      # scikit-learn, fastapi, sqlalchemy, psycopg2
│   └── Dockerfile            # Container target for multi-arch deployment
├── frontend/                 # Next.js 15 Client Interface
│   ├── src/
│   │   ├── app/              # App router path layouts, dashboard/
│   │   ├── components/       # UI Elements: cards, charts, sliders
│   │   ├── hooks/            # useSWR for backend dynamic API synchronization
│   │   └── lib/              # api-client.ts, utils.ts
│   ├── tailwind.config.ts    # Design token system
│   └── package.json
└── docker-compose.yml        # Orchestrates Postgres database container`}
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Relational PostgreSQL Schema Layout
          </h3>
          <p className="text-sm text-slate-300">
            Normalizing historical cricket datasets models players, metrics, and deliveries cleanly. Indices on foreign keys ensure sub-millisecond retrieval.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs space-y-2 text-indigo-300">
              <span className="text-emerald-400 font-semibold">// Matches Table</span>
              <p className="text-slate-400">CREATE TABLE matches (</p>
              <p className="pl-4">match_id SERIAL PRIMARY KEY,</p>
              <p className="pl-4">season VARCHAR(4) NOT NULL,</p>
              <p className="pl-4">team1_id INTEGER REFERENCES teams(team_id),</p>
              <p className="pl-4">team2_id INTEGER REFERENCES teams(team_id),</p>
              <p className="pl-4">venue_id INTEGER REFERENCES venues(venue_id),</p>
              <p className="pl-4">toss_winner VARCHAR(100),</p>
              <p className="pl-4">toss_decision VARCHAR(10) CHECK (toss_decision IN ('bat', 'field')),</p>
              <p className="pl-4">winner_id INTEGER REFERENCES teams(team_id),</p>
              <p className="pl-4">win_margin INTEGER,</p>
              <p className="pl-4">win_type VARCHAR(20) -- runs, wickets, tie</p>
              <p className="text-slate-400">);</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs space-y-2 text-indigo-300">
              <span className="text-emerald-400 font-semibold">// Ball-By-Ball Deliveries Table</span>
              <p className="text-slate-400">CREATE TABLE deliveries (</p>
              <p className="pl-4">delivery_id SERIAL PRIMARY KEY,</p>
              <p className="pl-4">match_id INTEGER REFERENCES matches(match_id) ON DELETE CASCADE,</p>
              <p className="pl-4">inning INTEGER CHECK (inning IN (1, 2)),</p>
              <p className="pl-4">over_num INTEGER NOT NULL CHECK (over_num BETWEEN 0 AND 19),</p>
              <p className="pl-4">ball_num INTEGER NOT NULL CHECK (ball_num BETWEEN 1 AND 9),</p>
              <p className="pl-4">batsman_id INTEGER REFERENCES players(player_id),</p>
              <p className="pl-4">bowler_id INTEGER REFERENCES players(player_id),</p>
              <p className="pl-4">batsman_runs INTEGER DEFAULT 0,</p>
              <p className="pl-4">extra_runs INTEGER DEFAULT 0,</p>
              <p className="pl-4">dismissal_kind VARCHAR(30) -- caught, bowled, run out, null</p>
              <p className="text-slate-400">);</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
            <span className="text-rose-400 font-semibold">Pro tip:</span> Indexes are added to <code className="bg-slate-950 px-1 py-0.5 rounded text-rose-300">deliveries(match_id, over_num)</code> and <code className="bg-slate-950 px-1 py-0.5 rounded text-rose-300">matches(season)</code> to speed up dynamic Wagon Wheel and Over-By-Over chart aggregations.
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-sky-400" />
            FastAPI REST Controller Design (RESTful Principles)
          </h3>
          <p className="text-sm text-slate-300">
            Strict HTTP status code management, standard JSON response payload structures, and interactive Swagger OpenAPI spec integration.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div className="border hover:border-slate-700/60 transition p-3 rounded bg-slate-900/40 border-slate-800/80">
              <div className="flex gap-2 items-center mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">POST</span>
                <code className="text-xs font-mono text-white">/api/v1/predict/match</code>
              </div>
              <p className="text-xs text-slate-400 mb-2">Computes team win probabilities using the server-side Random Forest model binary.</p>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded max-h-32 overflow-y-auto">
                <strong>Request Body:</strong><br />
                {`{ "team1": "CSK", "team2": "MI", "venue_id": 4, "toss_winner": "CSK", "toss_decision": "field" }`}<br />
                <strong>Response (200 OK):</strong><br />
                {`{ "success": true, "prediction": { "team1_prob": 58.4, "team2_prob": 41.6, "confidence": 81 }, "factors": [...] }`}
              </div>
            </div>

            <div className="border hover:border-slate-700/60 transition p-3 rounded bg-slate-900/40 border-slate-800/80">
              <div className="flex gap-2 items-center mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">GET</span>
                <code className="text-xs font-mono text-white">/api/v1/players/compare?player_id_1=12&player_id_2=15</code>
              </div>
              <p className="text-xs text-slate-400">Fetches and correlates ball-by-ball performance arrays for two players.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ml' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Random Forest Machine Learning Pipeline
          </h3>
          <p className="text-sm text-slate-300">
            A production Scikit-learn Random Forest consists of an ensemble of randomized Decision Trees. We encode categorical ground details and continuous rolling statistics to produce stable output.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center">
              <div className="w-8 h-8 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-2 font-bold font-mono text-sm leading-none">1</div>
              <h4 className="text-xs font-bold text-white mb-1">Feature Extraction</h4>
              <p className="text-[11px] text-slate-400">Extract pitch avg, team home/away win ratios, head-to-head ratios, and batsman/bowler depth counts.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center">
              <div className="w-8 h-8 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-2 font-bold font-mono text-sm leading-none">2</div>
              <h4 className="text-xs font-bold text-white mb-1">GridSearchCV Tuning</h4>
              <p className="text-[11px] text-slate-400">Grid search folds validate 200 estimators depth and minimum nodes to prevent over-fitting on high-scoring venues.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-center">
              <div className="w-8 h-8 rounded bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-2 font-bold font-mono text-sm leading-none">3</div>
              <h4 className="text-xs font-bold text-white mb-1">Ensemble Prediction</h4>
              <p className="text-[11px] text-slate-400">Individual tree probabilities are averaged to generate the final logits, resulting in maximum binary accuracy.</p>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60 font-mono text-[11px] text-slate-400">
            <strong>Feature Importance Matrix (Calculated):</strong><br />
            - Team H2H (Weight: 28%)<br />
            - Recent Form Score (Weight: 24%)<br />
            - Venue & Pitch Condition (Weight: 18%)
          </div>
        </div>
      )}

      {activeTab === 'frontend' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-purple-400" />
            Frontend Architecture & Responsive Layout State
          </h3>
          <p className="text-sm text-slate-300">
            For rapid interaction, layout structures must map responsively. High-density charts utilize container resize observers to scale fluidly without clipping.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed text-xs space-y-2 text-slate-300">
            <p className="flex items-center gap-2 text-white font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Responsive Breakpoints
            </p>
            <p className="pl-4 text-slate-400">
              Desktop grids are mapped using <code className="font-mono bg-slate-900 px-1 rounded text-rose-300">grid-cols-12 md:gap-6</code>. Sidebars transition to compact sliding drawers on screens <code className="font-mono bg-slate-900 px-1 rounded text-rose-300">&lt;md</code>.
            </p>
            <p className="flex items-center gap-2 text-white font-medium mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Chart Resize Isolation
            </p>
            <p className="pl-4 text-slate-400">
              Charts are isolated inside <code className="font-mono bg-slate-900 px-1 rounded text-rose-300">ResponsiveContainer</code> components with set margins, which helps prevent canvas breaking during element-collapses.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'plan' && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Play className="w-5.5 h-5.5 text-rose-400" />
            Step-by-Step Production Roadmap
          </h3>
          <p className="text-sm text-slate-300 font-mono text-emerald-400">Steps to export this monorepo configuration to Vercel + Render:</p>
          
          <div className="space-y-2.5">
            <div className="flex gap-2 items-start text-xs border border-slate-850 p-2.5 rounded bg-slate-950/40">
              <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>1. Dockerize Database:</strong> Boot an AWS RDS PostgreSQL instance or a Supabase cloud database cluster. Run schemas using Drizzle/Alembic migrations.
              </div>
            </div>
            <div className="flex gap-2 items-start text-xs border border-slate-850 p-2.5 rounded bg-slate-950/40">
              <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>2. Host FastAPI Backend:</strong> Create a web service on Render connected to the database. Set environmental configurations including <code className="font-mono bg-slate-900 px-1 text-slate-300 rounded">DATABASE_URL</code> and <code className="font-mono bg-slate-900 px-1 text-slate-300 rounded">AUTH_SECRET</code>. FastAPI serves schemas via CORS on HTTPS proxies.
              </div>
            </div>
            <div className="flex gap-2 items-start text-xs border border-slate-850 p-2.5 rounded bg-slate-950/40">
              <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>3. Setup Clerk Web Auth:</strong> Provision application tokens within the Clerk Admin dashboard. Setup OAuth configurations for GitHub and Google Authentication, and inject clerk domain keys.
              </div>
            </div>
            <div className="flex gap-2 items-start text-xs border border-slate-850 p-2.5 rounded bg-slate-950/40">
              <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>4. Build Next.js Dashboard:</strong> Define environment variables `<code className="font-mono bg-slate-900 px-1 text-slate-300 rounded">NEXT_PUBLIC_API_URL</code>` to connect. Deploy the project to Vercel, matching edge runtime optimizations.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
