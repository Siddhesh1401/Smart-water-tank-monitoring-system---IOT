import { useEffect, useState } from 'react'
import { getReports } from '../services/api'

function Reports() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    async function loadReports() {
      const data = await getReports()
      setRows(data)
    }

    loadReports()
  }, [])

  // Mock analytics data
  const analytics = {
    avgLevel: 62,
    maxLevel: 95,
    minLevel: 15,
    timesMotorOn: 18,
    avgFillTime: 18,
  }

  const levelTrends = [35, 42, 48, 55, 62, 68, 75, 80, 78, 72, 65, 58, 52, 48]
  const motorStats = { onDays: 18, offDays: 12 }
  const fillTimeTrend = [16, 19, 17, 21, 18, 20, 17]

  return (
    <main className="reports-page">
      <section className="dashboard-heading">
        <h1>Smart Tank Analysis Dashboard</h1>
        <p>Real-time water level trends and comprehensive tank monitoring analytics</p>
      </section>

      <section className="analytics-stats">
        <article className="stat-card primary-card">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-label">Average Level</span>
          </div>
          <p className="stat-big-value">{analytics.avgLevel}%</p>
          <p className="stat-status">Good Condition</p>
          <div className="stat-bar" style={{ '--fill': analytics.avgLevel }}></div>
        </article>

        <article className="stat-card success-card">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
            <span className="stat-label">Peak Level</span>
          </div>
          <p className="stat-big-value">{analytics.maxLevel}%</p>
          <p className="stat-status">Maximum</p>
          <div className="stat-bar" style={{ '--fill': analytics.maxLevel }}></div>
        </article>

        <article className="stat-card warning-card">
          <div className="stat-header">
            <span className="stat-icon">⚠️</span>
            <span className="stat-label">Minimum Level</span>
          </div>
          <p className="stat-big-value">{analytics.minLevel}%</p>
          <p className="stat-status">Low Alert</p>
          <div className="stat-bar" style={{ '--fill': analytics.minLevel }}></div>
        </article>

        <article className="stat-card info-card">
          <div className="stat-header">
            <span className="stat-icon">⚙️</span>
            <span className="stat-label">Motor ON Days</span>
          </div>
          <p className="stat-big-value">{analytics.timesMotorOn}</p>
          <p className="stat-status">Last 30 days</p>
          <div className="stat-bar" style={{ '--fill': 60 }}></div>
        </article>

        <article className="stat-card filltime-card">
          <div className="stat-header">
            <span className="stat-icon">⏱️</span>
            <span className="stat-label">Average Fill Time</span>
          </div>
          <p className="stat-big-value">{analytics.avgFillTime} min</p>
          <p className="stat-status">Tank refill duration</p>
          <div className="stat-bar" style={{ '--fill': 72 }}></div>
        </article>
      </section>

      <section className="charts-grid">
        <article className="chart-panel">
          <div className="chart-header blue-header">
            <span>📈</span>
            <h3>Recent Level Trend</h3>
          </div>
          <div className="history-chart reports-history-chart" aria-label="Recent level trend chart">
            {levelTrends.slice(-7).map((point, index) => {
              const label = ['-30m', '-25m', '-20m', '-15m', '-10m', '-5m', 'Now'][index]
              return (
                <div key={`${point}-${index}`} className="history-col">
                  <div className="history-track">
                    <div className="history-fill" style={{ height: `${point}%` }} />
                  </div>
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
          <div className="chart-legend">
            <span>Min: 0%</span>
            <span>Max: 100%</span>
          </div>
        </article>

        <article className="chart-panel">
          <div className="chart-header purple-header">
            <span>🔄</span>
            <h3>Motor Usage Pattern</h3>
          </div>
          <div className="pie-chart-container">
            <svg viewBox="0 0 100 100" className="pie-chart">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="25" 
                strokeDasharray={`${(motorStats.onDays / 30) * 251.3} 251.3`} strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="25" 
                strokeDasharray={`${(motorStats.offDays / 30) * 251.3} 251.3`}
                strokeDashoffset={-((motorStats.onDays / 30) * 251.3)} strokeLinecap="round" />
            </svg>
            <div className="pie-legend">
              <div><span className="legend-dot on"></span> Motor ON: {motorStats.onDays} days</div>
              <div><span className="legend-dot off"></span> Motor OFF: {motorStats.offDays} days</div>
            </div>
          </div>
        </article>

        <article className="chart-panel">
          <div className="chart-header green-header">
            <span>📊</span>
            <h3>Daily Average Levels</h3>
          </div>
          <div className="bar-chart">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const value = [65, 72, 68, 75, 70, 78, 62][idx]
              return (
                <div key={day} className="bar-item">
                  <div className="bar-fill" style={{ height: `${(value / 100) * 200}px` }}></div>
                  <span className="bar-label">{day}</span>
                  <span className="bar-value">{value}%</span>
                </div>
              )
            })}
          </div>
        </article>

        <article className="chart-panel">
          <div className="chart-header orange-header">
            <span>⌛</span>
            <h3>Tank Fill Time Trend (Minutes)</h3>
          </div>
          <div className="bar-chart filltime-chart">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const value = fillTimeTrend[idx]
              return (
                <div key={day} className="bar-item">
                  <div className="bar-fill filltime-bar" style={{ height: `${(value / 25) * 200}px` }}></div>
                  <span className="bar-label">{day}</span>
                  <span className="bar-value">{value}m</span>
                </div>
              )
            })}
          </div>
        </article>

        <article className="chart-panel">
          <div className="chart-header red-header">
            <span>⏱️</span>
            <h3>System Health Score</h3>
          </div>
          <div className="health-container">
            <div className="health-gauge">
              <svg viewBox="0 0 200 120">
                <path d="M 50 100 A 50 50 0 0 1 150 100" stroke="#e5e7eb" strokeWidth="15" fill="none" />
                <path d="M 50 100 A 50 50 0 0 1 144 100" stroke="#10b981" strokeWidth="15" fill="none" />
              </svg>
              <p className="health-value">94%</p>
            </div>
            <div className="health-status">
              <p><strong>Excellent</strong></p>
              <p>All systems operational</p>
            </div>
          </div>
        </article>
      </section>

      <section className="panel">
        <h2>Daily Reports</h2>
        <p className="table-intro">Recent tank and motor activity log.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Water Level (%)</th>
              <th>Motor</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>{row.level}</td>
                <td>{row.motor}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default Reports
