import { useEffect, useMemo, useState } from 'react'
import { getLatestWaterLevel, getMotorStatus } from '../services/api'
import TankDisplay from '../components/TankDisplay'
import MotorControl from '../components/MotorControl'

function Dashboard() {
  const [level, setLevel] = useState(0)
  const [motorOn, setMotorOn] = useState(false)
  const [history, setHistory] = useState([35, 42, 47, 55, 60, 58, 62])
  const [events, setEvents] = useState([
    generateTimestamp(-1) + ' - Motor turned ON',
    generateTimestamp(-3) + ' - Level reached 55%',
    generateTimestamp(-4) + ' - Motor turned OFF',
  ])

  function generateTimestamp(minutesAgo = 0) {
    const now = new Date()
    now.setMinutes(now.getMinutes() + minutesAgo)
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }

  useEffect(() => {
    async function loadInitialState() {
      const [water, motor] = await Promise.all([
        getLatestWaterLevel(),
        getMotorStatus(),
      ])
      setLevel(water.level)
      setMotorOn(motor.isOn)
    }

    loadInitialState()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setLevel((prev) => {
        const next = Math.max(10, Math.min(100, prev + (Math.random() > 0.5 ? 3 : -2)))
        setHistory((old) => [...old.slice(-6), next])
        return next
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const levelLabel = useMemo(() => {
    if (level < 30) return 'Low'
    if (level < 70) return 'Medium'
    return 'High'
  }, [level])

  const averageLevel = useMemo(() => {
    if (!history.length) return 0
    const total = history.reduce((sum, value) => sum + value, 0)
    return Math.round(total / history.length)
  }, [history])

  const statusTone = level < 30 ? 'danger' : level < 70 ? 'warn' : 'safe'

  function toggleMotor() {
    const next = !motorOn
    const event = next ? 'Motor turned ON manually' : 'Motor turned OFF manually'
    setMotorOn(next)
    setEvents((old) => [`${generateTimestamp()} - ${event}`, ...old.slice(0, 4)])
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-heading">
        <h1>Operations Dashboard</h1>
        <p>Live tank status, motor control, and system health in one place.</p>
      </section>

      <section className="dashboard-overview">
        <article className="overview-card">
          <p>Current Level</p>
          <strong>{level}%</strong>
        </article>
        <article className="overview-card">
          <p>Motor Status</p>
          <strong>{motorOn ? 'Running' : 'Stopped'}</strong>
        </article>
        <article className="overview-card">
          <p>Average Level</p>
          <strong>{averageLevel}%</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <TankDisplay level={level} levelLabel={levelLabel} statusTone={statusTone} />
        <MotorControl isOn={motorOn} onToggle={toggleMotor} />

        <article className="panel wqi-metrics-panel">
          <h2>Water Quality Index</h2>
          <div className="wqi-metrics-grid">
            <div className="wqi-metric-item">
              <span className="wqi-metric-label">pH Level</span>
              <span className="wqi-metric-value">7.2</span>
            </div>
            <div className="wqi-metric-item">
              <span className="wqi-metric-label">Quality</span>
              <span className="wqi-metric-value">85%</span>
            </div>
            <div className="wqi-metric-item">
              <span className="wqi-metric-label">Turbidity</span>
              <span className="wqi-metric-value">0.8</span>
            </div>
            <div className="wqi-metric-item">
              <span className="wqi-metric-label">Dissolved O₂</span>
              <span className="wqi-metric-value">8.2</span>
            </div>
          </div>
        </article>

        <article className="panel metrics-panel">
          <h2>System Health</h2>
          <div className="metric-items">
            <div>
              <span>Sensor Status</span>
              <strong>Online</strong>
            </div>
            <div>
              <span>Controller</span>
              <strong>Connected</strong>
            </div>
            <div>
              <span>Alert State</span>
              <strong>{level < 25 ? 'Low-Level Alert' : 'Normal'}</strong>
            </div>
          </div>
        </article>

        <article className="panel events-panel">
          <h2>Recent Events</h2>
          <ul className="event-list">
            {events.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}

export default Dashboard