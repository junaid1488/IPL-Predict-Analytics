import React, { useState } from 'react';
import { 
  Trophy, 
  BarChart3, 
  Activity, 
  MapPin, 
  CalendarCheck, 
  Cpu, 
  LineChart, 
  Settings, 
  Menu, 
  X, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import TeamAnalyticsView from './components/TeamAnalyticsView';
import PlayerAnalyticsView from './components/PlayerAnalyticsView';
import VenueAnalyticsView from './components/VenueAnalyticsView';
import MatchCenterView from './components/MatchCenterView';
import MlEngineView from './components/MlEngineView';
import InteractiveVisualizationsView from './components/InteractiveVisualizationsView';
import SettingsView from './components/SettingsView';

type Page = 'dashboard' | 'teams' | 'players' | 'venues' | 'matches' | 'ml' | 'visuals' | 'settings';

interface SidebarItem {
  id: Page;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: Trophy },
    { id: 'teams', name: 'Team Analytics', icon: BarChart3 },
    { id: 'players', name: 'Player Analytics', icon: Activity },
    { id: 'venues', name: 'Venue Analytics', icon: MapPin },
    { id: 'matches', name: 'Match Center', icon: CalendarCheck },
    { id: 'ml', name: 'ML Prediction Engine', icon: Cpu },
    { id: 'visuals', name: 'Interactive Visuals', icon: LineChart },
    { id: 'settings', name: 'Settings & Repo Info', icon: Settings },
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView onNavigate={(p: any) => setActivePage(p)} />;
      case 'teams':
        return <TeamAnalyticsView />;
      case 'players':
        return <PlayerAnalyticsView />;
      case 'venues':
        return <VenueAnalyticsView />;
      case 'matches':
        return <MatchCenterView />;
      case 'ml':
        return <MlEngineView />;
      case 'visuals':
        return <InteractiveVisualizationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={(p: any) => setActivePage(p)} />;
    }
  };

  const getPageTitle = () => {
    const activeItem = sidebarItems.find(item => item.id === activePage);
    return activeItem ? activeItem.name : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#030611] flex text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* BACKGROUND PREMIUM GRID ACCENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-emerald-500/[0.02] rounded-full blur-[100px]"></div>
      </div>

      {/* DESKTOP SIDEBAR (Static Left Column) */}
      <aside className="hidden lg:flex flex-col w-68 bg-slate-950/80 backdrop-blur-md border-r border-slate-900 z-30 fixed h-full">
        {/* Brand Banner */}
        <div className="h-20 flex items-center gap-2.5 px-6 border-b border-slate-900">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold font-mono tracking-widest text-rose-400 uppercase leading-none block">SPORTS HUB</span>
            <span className="text-sm font-extrabold text-white tracking-tight leading-none block mt-0.5">IPL Analytics</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto w-full">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-md shadow-rose-950/20' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE INTERFACE OVERLAYS */}
      <div className="lg:hidden">
        {/* Top Floating bar */}
        <div className="fixed top-0 inset-x-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">IPL Predict SaaS</span>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 active:scale-95 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sliding Full screen menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-md z-30 flex flex-col pt-20 px-6">
            <div className="space-y-2 py-6">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTAINER LAYOUT */}
      <main className="flex-1 lg:pl-68 pt-16 lg:pt-0 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Top Info Header Grid (Desktop only) */}
          <header className="hidden lg:flex justify-between items-center pb-4 border-b border-slate-900/60">
            <div>
              <span className="text-[10px] font-bold font-mono tracking-widest text-slate-500 uppercase">PLATFORM VIEWPORT</span>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE CORE FEED
              </span>
            </div>
          </header>

          {/* PAGE INNER ROUTER */}
          <div className="transition-all duration-300">
            {renderContent()}
          </div>

        </div>
      </main>

    </div>
  );
}
