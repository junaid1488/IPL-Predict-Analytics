export interface Team {
  name: string;
  shortName: string;
  rank: number;
  points: number;
  played: number;
  won: number;
  lost: number;
  noResult: number;
  netRunRate: number;
  logoColor: string; // Tailwind class
  winPct: number;
  homeWinPct: number;
  awayWinPct: number;
  recentForm: ('W' | 'L')[];
  battingStrength: number; // 0-100 rating
  bowlingStrength: number; // 0-100 rating
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
  economy: number;
  matches: number;
  highestScore: number;
  bestBowling: string;
  imageColor: string; // for avatar style
  imageUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  matches: number;
  avgFirstInnings: number;
  highestScore: string;
  lowestScore: string;
  chaseSuccessPct: number;
  tossToWinPct: number;
  pitchType: 'Batting Friendly' | 'Bowling Friendly' | 'Balanced';
  spinVsPace: string; // e.g. "Spin 45% - Pace 55%"
  imageUrl?: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  venue: string;
  status: 'Completed' | 'Live' | 'Upcoming';
  winner?: string;
  resultDetails: string;
  tossWinner: string;
  tossDecision: 'bat' | 'field';
  team1Score?: string;
  team2Score?: string;
}

export interface PredictorInput {
  team1: string;
  team2: string;
  venue: string;
  tossWinner: string;
  tossDecision: 'bat' | 'field';
}

export interface PredictionOutput {
  team1Prob: number;
  team2Prob: number;
  confidenceScore: number;
  keyFactors: string[];
  featureImportance: { name: string; value: number }[];
}

export interface MLPipelineMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalSamples: number;
  testSizePct: number;
}
