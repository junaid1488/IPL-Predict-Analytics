import { Player, Team, Match } from '../types';

/**
 * Escapes characters in a string for safe CSV usage
 */
function escapeCSVCell(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Standard trigger to download dynamic CSV files client-side
 */
export function downloadCSV(headers: string[], rows: any[][], filename: string) {
  const csvContent = [
    headers.map(escapeCSVCell).join(','),
    ...rows.map(row => row.map(escapeCSVCell).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export player statistics list to CSV
 */
export function exportPlayersToCSV(players: Player[]) {
  const headers = [
    'Name',
    'Team',
    'Role',
    'Matches',
    'Runs',
    'Wickets',
    'Batting Avg',
    'Strike Rate',
    'Bowling Econ',
    'Highest Score',
    'Best Bowling'
  ];

  const rows = players.map(p => [
    p.name,
    p.team,
    p.role,
    p.matches,
    p.runs,
    p.wickets,
    p.average,
    p.strikeRate,
    p.economy,
    p.highestScore,
    p.bestBowling
  ]);

  downloadCSV(headers, rows, 'IPL_2026_Player_Statistics.csv');
}

/**
 * Export match list to CSV
 */
export function exportMatchesToCSV(matches: Match[]) {
  const headers = [
    'Date',
    'Team 1',
    'Team 2',
    'Venue',
    'Status',
    'Team 1 Score',
    'Team 2 Score',
    'Toss Winner',
    'Toss Decision',
    'Winner',
    'Result Details'
  ];

  const rows = matches.map(m => [
    m.date,
    m.team1,
    m.team2,
    m.venue,
    m.status,
    m.team1Score || 'N/A',
    m.team2Score || 'N/A',
    m.tossWinner,
    m.tossDecision,
    m.winner || 'N/A',
    m.resultDetails
  ]);

  downloadCSV(headers, rows, 'IPL_2026_Matches_Archival.csv');
}

/**
 * Export teams standings list to CSV
 */
export function exportTeamsToCSV(teams: Team[]) {
  const headers = [
    'Rank',
    'Team',
    'Played',
    'Won',
    'Lost',
    'Points',
    'Net Run Rate',
    'Win %',
    'Home Win %',
    'Away Win %',
    'Batting Strength Rating',
    'Bowling Strength Rating'
  ];

  const rows = teams.map(t => [
    t.rank,
    t.name,
    t.played,
    t.won,
    t.lost,
    t.points,
    t.netRunRate,
    t.winPct,
    t.homeWinPct,
    t.awayWinPct,
    t.battingStrength,
    t.bowlingStrength
  ]);

  downloadCSV(headers, rows, 'IPL_2026_Team_Championship_Standings.csv');
}

/**
 * Generates an isolated, beautifully formatted PDF Report by leveraging the browser's
 * hardware vector-printing capabilities via a clean popup preview.
 */
export function generatePDFReport(title: string, sections: { heading: string; markup: string }[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup blocked! Please allow popups to open the export preview.');
    return;
  }

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const contentMarkup = sections.map(sec => `
    <div class="section">
      <h2 class="section-title">${sec.heading}</h2>
      <div class="section-body">
        ${sec.markup}
      </div>
    </div>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            line-height: 1.5;
            padding: 40px;
            background-color: #ffffff;
            margin: 0;
          }
          .header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .header-brand {
            font-size: 24px;
            font-weight: 800;
            color: #e11d48;
            letter-spacing: -0.025em;
          }
          .header-subtitle {
            font-size: 13px;
            color: #475569;
            margin-top: 4px;
          }
          .header-date {
            font-size: 11px;
            color: #64748b;
            font-family: monospace;
          }
          .section {
            margin-bottom: 32px;
            page-break-inside: avoid;
          }
          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
            border-left: 4px solid #f43f5e;
            padding-left: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .section-body {
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 8px;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-align: left;
            padding: 8px 12px;
            border-bottom: 1.5px solid #cbd5e1;
            font-size: 11px;
            text-transform: uppercase;
          }
          td {
            padding: 8px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          tr:nth-child(even) td {
            background-color: #f8fafc;
          }
          .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 600;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
          }
          .badge-rose {
            background-color: #fff1f2;
            color: #be123c;
            border-color: #fecdd3;
          }
          .badge-blue {
            background-color: #eff6ff;
            color: #1d4ed8;
            border-color: #bfdbfe;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
            margin-top: 12px;
            margin-bottom: 12px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 12px;
            margin-bottom: 12px;
          }
          .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px;
          }
          .card-title {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
            letter-spacing: 0.05em;
          }
          .card-value {
            font-size: 20px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 4px;
          }
          .card-desc {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
          }
          .footer {
            margin-top: 40px;
            font-size: 10px;
            color: #94a3b8;
            text-align: center;
            border-top: 1px dashed #cbd5e1;
            padding-top: 12px;
          }
          .highlight {
            font-weight: 700;
            color: #e11d48;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="header-brand">IPL 2026 ANALYTICS SAAS</div>
            <div class="header-subtitle">Official Offline Export Dataset & Reports Pipeline</div>
          </div>
          <div class="header-date">${dateStr}</div>
        </div>

        ${contentMarkup}

        <div class="footer">
          Generated via IPL Predict SaaS Offline Exports, 2026. Data contains certified historical datasets.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Downloads a beautifully structured PDF Report of Selected Player Profile Card
 */
export function downloadPlayerProfilePDF(player: Player) {
  const sections = [
    {
      heading: `${player.name} — Scout Profile Assessment`,
      markup: `
        <div class="grid-2">
          <div class="card" style="border-top: 3px solid #f43f5e">
            <span class="card-title">Franchise & Role</span>
            <div class="card-value" style="font-size: 16px">${player.team}</div>
            <div class="card-desc">${player.role}</div>
          </div>
          <div class="card" style="border-top: 3px solid #e11d48">
            <span class="card-title">League Matches</span>
            <div class="card-value">${player.matches}</div>
            <div class="card-desc">Matches Played in Season</div>
          </div>
        </div>

        <div class="grid-3">
          <div class="card">
            <span class="card-title">Runs Tallied</span>
            <div class="card-value">${player.runs}</div>
            <div class="card-desc">Highest: ${player.highestScore}</div>
          </div>
          <div class="card">
            <span class="card-title">Batting Strike Rate</span>
            <div class="card-value">${player.strikeRate}</div>
            <div class="card-desc">Average: ${player.average || '0.00'}</div>
          </div>
          <div class="card">
            <span class="card-title">Wickets / Economy</span>
            <div class="card-value">${player.wickets}</div>
            <div class="card-desc">Econ: ${player.economy || 'N/A'} (Best: ${player.bestBowling || 'N/A'})</div>
          </div>
        </div>
      `
    },
    {
      heading: `Metric Comparison Profile`,
      markup: `
        <table>
          <thead>
            <tr>
              <th>Performance Vector</th>
              <th>Scout Rating / Value</th>
              <th>Context Check</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Average Runs Scored Per Dismissal</td>
              <td><strong>${player.average || '0.00'}</strong></td>
              <td>Primary score reliability factor</td>
            </tr>
            <tr>
              <td>Pace vs Spin Strike Rate Co-efficient</td>
              <td><strong>${player.strikeRate}</strong></td>
              <td>Runs per 100 balls delivered</td>
            </tr>
            <tr>
              <td>Bowling Economy Restriction Rate</td>
              <td><strong>${player.economy || '0.00'}</strong></td>
              <td>Runs conceded per over</td>
            </tr>
            <tr>
              <td>Season High Achievement</td>
              <td class="highlight">${player.runs > 0 ? `HS: ${player.highestScore}` : `Best Bowled: ${player.bestBowling}`}</td>
              <td>Premium single-game contribution peak</td>
            </tr>
          </tbody>
        </table>
      `
    }
  ];

  generatePDFReport(`${player.name}_Profile_Report`, sections);
}

/**
 * Downloads a beautiful PDF report of All Players
 */
export function downloadAllPlayersPDF(players: Player[]) {
  const rowsMarkup = players.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.team}</td>
      <td><span class="badge">${p.role}</span></td>
      <td>${p.matches}</td>
      <td style="color: #ea580c; font-weight: bold">${p.runs}</td>
      <td style="color: #7c3aed; font-weight: bold">${p.wickets}</td>
      <td>${p.average || '0.00'}</td>
      <td>${p.strikeRate}</td>
      <td>${p.economy || '0.00'}</td>
    </tr>
  `).join('');

  const sections = [
    {
      heading: 'IPL 2026 Orange & Purple Cap Contenders Summary',
      markup: `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Player Name</th>
              <th>Franchise</th>
              <th>Role</th>
              <th>Played</th>
              <th>Runs</th>
              <th>Wkts</th>
              <th>Avg</th>
              <th>S/R</th>
              <th>Econ</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      `
    }
  ];

  generatePDFReport('IPL_2026_All_Player_Statistics', sections);
}

/**
 * Downloads a beautiful PDF report of Teams / Comparative Standings
 */
export function downloadTeamsPDF(teams: Team[], currentH2H?: { t1: string; t2: string; t1Won: number; t2Won: number; total: number }) {
  const rowsMarkup = teams.map((t, idx) => `
    <tr>
      <td>${t.rank}</td>
      <td><strong>${t.name} (${t.shortName})</strong></td>
      <td>${t.played}</td>
      <td>${t.won}</td>
      <td>${t.lost}</td>
      <td><strong>${t.points}</strong></td>
      <td style="color: ${t.netRunRate >= 0 ? '#10b981' : '#ef4444'}">${t.netRunRate >= 0 ? '+' : ''}${t.netRunRate}</td>
      <td>${t.winPct}%</td>
      <td>${t.homeWinPct}%</td>
      <td>${t.awayWinPct}%</td>
    </tr>
  `).join('');

  const sections = [
    {
      heading: 'IPL 2026 Season Franchise Leaderboard Standings',
      markup: `
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Franchise Team</th>
              <th>Pld</th>
              <th>Won</th>
              <th>Lst</th>
              <th>Pts</th>
              <th>NRR</th>
              <th>Win %</th>
              <th>Home %</th>
              <th>Away %</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      `
    }
  ];

  if (currentH2H) {
    sections.push({
      heading: `Mutual Head-to-Head Comparative Overview: ${currentH2H.t1} vs ${currentH2H.t2}`,
      markup: `
        <div class="grid-3" style="margin-top: 16px;">
          <div class="card" style="border-top: 3px solid #fbbf24">
            <span class="card-title">${currentH2H.t1} Wins</span>
            <div class="card-value">${currentH2H.t1Won}</div>
            <div class="card-desc">Mutual win count</div>
          </div>
          <div class="card" style="border-top: 3px solid #3b82f6">
            <span class="card-title">${currentH2H.t2} Wins</span>
            <div class="card-value">${currentH2H.t2Won}</div>
            <div class="card-desc">Mutual win count</div>
          </div>
          <div class="card">
            <span class="card-title">Total Competitive Recorded</span>
            <div class="card-value">${currentH2H.total}</div>
            <div class="card-desc">Aggregated IPL occurrences</div>
          </div>
        </div>
      `
    });
  }

  generatePDFReport('IPL_2026_Team_Championship_Standings', sections);
}

/**
 * Downloads a beautiful PDF report containing match schedules & summaries
 */
export function downloadMatchesStatsPDF(matches: Match[], title = 'IPL 2026 Competitions Archival') {
  const rowsMarkup = matches.map((m) => `
    <tr>
      <td>${m.date}</td>
      <td><strong>${m.team1}</strong> vs <strong>${m.team2}</strong></td>
      <td>${m.venue}</td>
      <td>
        <span class="badge ${
          m.status === 'Completed' 
            ? 'badge-rose' 
            : m.status === 'Live' 
            ? 'badge-blue' 
            : ''
        }">
          ${m.status}
        </span>
      </td>
      <td>${m.team1Score || 'N/A'} vs ${m.team2Score || 'N/A'}</td>
      <td><strong>${m.winner || 'N/A'}</strong></td>
      <td style="font-size: 11px; color: #475569">${m.resultDetails}</td>
    </tr>
  `).join('');

  const sections = [
    {
      heading: 'IPL 2026 Match Results & Playoff Schedules',
      markup: `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Match-up</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Scoreline Split</th>
              <th>Winner</th>
              <th>Detail Assessment</th>
            </tr>
          </thead>
          <tbody>
            ${rowsMarkup}
          </tbody>
        </table>
      `
    }
  ];

  generatePDFReport('IPL_2026_Matches_Summary', sections);
}

/**
 * Downloads a beautiful PDF report of the active match simulation
 */
export function downloadLiveSimPDF(
  matchState: any,
  runsNeeded: number,
  ballsRemaining: number,
  currentRunRate: string,
  requiredRunRate: string,
  winProbRCB: number,
  winProbMI: number
) {
  const sections = [
    {
      heading: 'Live Match Simulation Scorecard — IPL 2026 Arena',
      markup: `
        <div class="grid-2">
          <div class="card" style="border-top: 3px solid #f43f5e">
            <span class="card-title">Batting Franchise (Royal Challengers Bengaluru)</span>
            <div class="card-value" style="font-size: 24px">${matchState.score} / ${matchState.wickets}</div>
            <div class="card-desc">Overs: ${matchState.overs}.${matchState.ballsInOver} / 20.0</div>
          </div>
          <div class="card" style="border-top: 3px solid #3b82f6">
            <span class="card-title">Target & Runs Required</span>
            <div class="card-value">Target: ${matchState.target}</div>
            <div class="card-desc">Need <strong class="highlight">${runsNeeded}</strong> runs off <strong class="highlight">${ballsRemaining}</strong> deliveries</div>
          </div>
        </div>

        <div class="grid-3" style="margin-top: 16px;">
          <div class="card">
            <span class="card-title">Current Run Rate (CRR)</span>
            <div class="card-value">${currentRunRate}</div>
            <div class="card-desc">Runs scored per over</div>
          </div>
          <div class="card">
            <span class="card-title">Required Run Rate (RRR)</span>
            <div class="card-value">${requiredRunRate}</div>
            <div class="card-desc">Runs per over required</div>
          </div>
          <div class="card">
            <span class="card-title">RCB Win Probability</span>
            <div class="card-value">${winProbRCB}%</div>
            <div class="card-desc">MI Win Probability: ${winProbMI}%</div>
          </div>
        </div>
      `
    },
    {
      heading: 'Active Players State',
      markup: `
        <table>
          <thead>
            <tr>
              <th>Player Role</th>
              <th>Name</th>
              <th>Status / Stats</th>
              <th>Contribution Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Striker Batsman</strong></td>
              <td>${matchState.batsman1}</td>
              <td><span class="highlight">${matchState.batsman1Runs} Runs</span></td>
              <td>Active Batsman</td>
            </tr>
            <tr>
              <td><strong>Non-Striker Batsman</strong></td>
              <td>${matchState.batsman2}</td>
              <td><strong>${matchState.batsman2Runs} Runs</strong></td>
              <td>Supporting Partner</td>
            </tr>
            <tr>
              <td><strong>Active Bowler</strong></td>
              <td>${matchState.bowler}</td>
              <td><strong>${matchState.bowlerWickets} Wickets</strong> (${matchState.bowlerRuns} runs conceded)</td>
              <td>Defense Restriction</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      heading: 'Last Played Delivery Event Description',
      markup: `
        <div class="card" style="border-left: 4px solid #e11d48; background: #fff1f2; margin-top: 10px;">
          <p style="margin: 0; font-style: italic; font-size: 13px; color: #9f1239; padding: 2px;">"${matchState.lastBallDesc}"</p>
        </div>
      `
    }
  ];

  generatePDFReport('IPL_2026_Live_Simulation_Scorecard', sections);
}
