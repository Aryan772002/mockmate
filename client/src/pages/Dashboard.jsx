import { useState, useEffect } from 'react'
import api from '../api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function Dashboard({ onHome }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await api.get('/api/interview/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessions(res.data)
    } catch (err) {
      console.log('Error:', err)
    }
    setLoading(false)
  }

  if (loading) return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <p style={{color: '#6366f1', fontSize: '1.2rem'}}>Loading dashboard...</p>
    </div>
  )

  const chartData = sessions.slice().reverse().map((s, i) => ({
    name: `#${i + 1}`,
    score: s.avgScore,
    role: s.role
  }))

  const roleMap = {}
  sessions.forEach(s => {
    if (!roleMap[s.role]) roleMap[s.role] = { total: 0, count: 0 }
    roleMap[s.role].total += s.avgScore
    roleMap[s.role].count += 1
  })
  const roleData = Object.keys(roleMap).map(role => ({
    role: role.replace(' Developer', '').replace(' & Problem Solving', ''),
    avg: Math.round(roleMap[role].total / roleMap[role].count)
  }))

  const totalSessions = sessions.length
  const avgScore = totalSessions > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.avgScore, 0) / totalSessions)
    : 0
  const bestScore = totalSessions > 0
    ? Math.max(...sessions.map(s => s.avgScore))
    : 0

  return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{maxWidth: '800px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #1f2937'}}>
          <h1 style={{color: 'white', fontSize: '1.3rem', fontWeight: 'bold'}}>📊 Dashboard</h1>
          <button onClick={onHome} style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            Back to Home
          </button>
        </div>

        {totalSessions === 0 ? (
          <div style={{background: '#111827', borderRadius: '12px', padding: '3rem', textAlign: 'center', border: '1px solid #1f2937'}}>
            <p style={{color: '#94a3b8', fontSize: '1.1rem'}}>No data yet! Complete an interview to see your stats 🎯</p>
          </div>
        ) : (
          <>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
              {[
                { label: 'Total Sessions', value: totalSessions, color: '#6366f1' },
                { label: 'Avg Score', value: `${avgScore}/10`, color: '#f59e0b' },
                { label: 'Best Score', value: `${bestScore}/10`, color: '#22c55e' },
                { label: 'Interviews', value: `${totalSessions} 🔥`, color: '#ef4444' },
              ].map((stat, i) => (
                <div key={i} style={{background: '#111827', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${stat.color}`, border: '1px solid #1f2937'}}>
                  <p style={{color: stat.color, fontSize: '1.5rem', fontWeight: 'bold'}}>{stat.value}</p>
                  <p style={{color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem'}}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{background: '#111827', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #1f2937'}}>
              <h2 style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem'}}>Score Trend 📈</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12}/>
                  <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12}/>
                  <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155', color: 'white'}}/>
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{fill: '#6366f1'}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{background: '#111827', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1f2937'}}>
              <h2 style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem'}}>Performance by Role 🎯</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                  <XAxis dataKey="role" stroke="#94a3b8" fontSize={12}/>
                  <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12}/>
                  <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155', color: 'white'}}/>
                  <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  )
}