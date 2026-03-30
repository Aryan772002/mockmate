import { useState, useEffect } from 'react'
import api from '../api'

export default function History({ onHome }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

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
      console.log('Error fetching sessions:', err)
    }
    setLoading(false)
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e'
    if (score >= 5) return '#f59e0b'
    return '#ef4444'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  if (loading) return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <p style={{color: '#6366f1', fontSize: '1.2rem'}}>Loading sessions...</p>
    </div>
  )

  return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{maxWidth: '700px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #1f2937'}}>
          <h1 style={{color: 'white', fontSize: '1.3rem', fontWeight: 'bold'}}>📋 Session History</h1>
          <button onClick={onHome} style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
            Back to Home
          </button>
        </div>

        {sessions.length === 0 ? (
          <div style={{background: '#111827', borderRadius: '12px', padding: '3rem', textAlign: 'center', border: '1px solid #1f2937'}}>
            <p style={{color: '#94a3b8', fontSize: '1.1rem'}}>No sessions yet! Start your first interview 🎯</p>
          </div>
        ) : (
          sessions.map((session, i) => (
            <div key={i} style={{background: '#111827', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem', cursor: 'pointer', border: selected === i ? '1px solid #6366f1' : '1px solid #1f2937'}}
              onClick={() => setSelected(selected === i ? null : i)}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <p style={{color: 'white', fontWeight: 'bold', fontSize: '1rem'}}>{session.role}</p>
                  <p style={{color: '#94a3b8', fontSize: '0.85rem'}}>{formatDate(session.createdAt)} · {session.questions.length} questions</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{color: getScoreColor(session.avgScore), fontSize: '1.5rem', fontWeight: 'bold'}}>{session.avgScore}/10</p>
                  <p style={{color: '#94a3b8', fontSize: '0.75rem'}}>avg score</p>
                </div>
              </div>
              {selected === i && (
                <div style={{marginTop: '1rem', borderTop: '1px solid #1f2937', paddingTop: '1rem'}}>
                  {session.questions.map((q, j) => (
                    <div key={j} style={{marginBottom: '0.75rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p style={{color: '#94a3b8', fontSize: '0.8rem'}}>Q{j+1}</p>
                        <span style={{color: getScoreColor(q.score), fontSize: '0.85rem', fontWeight: 'bold'}}>{q.score}/10</span>
                      </div>
                      <p style={{color: 'white', fontSize: '0.9rem', marginBottom: '0.25rem'}}>{q.question}</p>
                      <p style={{color: '#64748b', fontSize: '0.8rem'}}>{q.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}