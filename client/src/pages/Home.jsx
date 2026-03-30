import { useState } from 'react'

export default function Home({ user, onLogout, onStartInterview, onHistory, onDashboard }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium')

  const roles = [
    { id: 'frontend', label: 'Frontend Developer', icon: '🎨', desc: 'React, CSS, JS, HTML', color: '#6366f1' },
    { id: 'backend', label: 'Backend Developer', icon: '⚙️', desc: 'Node.js, APIs, Databases', color: '#22c55e' },
    { id: 'dsa', label: 'DSA & Problem Solving', icon: '🧠', desc: 'Arrays, Trees, DP, Graphs', color: '#f59e0b' },
    { id: 'fullstack', label: 'Full Stack Developer', icon: '🚀', desc: 'End-to-end development', color: '#ec4899' },
  ]

  const difficulties = [
    { label: 'Easy', color: '#22c55e' },
    { label: 'Medium', color: '#f59e0b' },
    { label: 'Hard', color: '#ef4444' },
  ]

  return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>

        {/* Navbar */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', background: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #1f2937'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span style={{fontSize: '1.5rem'}}>🎯</span>
            <span style={{color: 'white', fontSize: '1.3rem', fontWeight: 'bold'}}>MockMate</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
            <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>Hi, {user.name}!</span>
            <button onClick={onDashboard} style={{padding: '0.5rem 1rem', background: '#1f2937', color: '#a5b4fc', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'}}>Dashboard</button>
            <button onClick={onHistory} style={{padding: '0.5rem 1rem', background: '#1f2937', color: '#a5b4fc', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'}}>History</button>
            <button onClick={onLogout} style={{padding: '0.5rem 1rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'}}>Logout</button>
          </div>
        </div>

        {/* Hero */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{display: 'inline-block', background: 'linear-gradient(135deg, #6366f1, #ec4899)', padding: '0.4rem 1.2rem', borderRadius: '999px', marginBottom: '1rem'}}>
            <span style={{color: 'white', fontSize: '0.85rem', fontWeight: '600'}}>AI Powered Interview Prep</span>
          </div>
          <h2 style={{color: 'white', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: '1.2'}}>
            Ace Your Next<br/>
            <span style={{background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Tech Interview
            </span>
          </h2>
          <p style={{color: '#64748b', fontSize: '1rem', maxWidth: '400px', margin: '0 auto'}}>
            Practice with AI-generated questions and get instant feedback
          </p>
        </div>

        {/* Difficulty selector */}
        <div style={{marginBottom: '2rem', textAlign: 'center'}}>
          <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.75rem'}}>Select Difficulty</p>
          <div style={{display: 'inline-flex', gap: '0.75rem', background: '#111827', padding: '0.5rem', borderRadius: '12px', border: '1px solid #1f2937'}}>
            {difficulties.map(d => (
              <button
                key={d.label}
                onClick={() => setSelectedDifficulty(d.label)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: selectedDifficulty === d.label ? d.color : 'transparent',
                  color: selectedDifficulty === d.label ? 'white' : '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role cards */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem'}}>
          {roles.map(role => (
            <div
              key={role.id}
              onClick={() => onStartInterview({...role, difficulty: selectedDifficulty})}
              style={{background: '#111827', padding: '1.75rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid #1f2937', position: 'relative', overflow: 'hidden'}}
              onMouseOver={e => {
                e.currentTarget.style.border = `1px solid ${role.color}`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.border = '1px solid #1f2937'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: role.color, opacity: 0.05, borderRadius: '0 16px 0 80px'}}/>
              <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{role.icon}</div>
              <h3 style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.4rem'}}>{role.label}</h3>
              <p style={{color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem'}}>{role.desc}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'inline-flex', alignItems: 'center', background: role.color + '22', padding: '0.3rem 0.75rem', borderRadius: '999px'}}>
                  <span style={{color: role.color, fontSize: '0.8rem', fontWeight: '600'}}>Start →</span>
                </div>
                <span style={{color: '#64748b', fontSize: '0.75rem'}}>{selectedDifficulty}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer stats */}
        <div style={{display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem', padding: '1.5rem', background: '#111827', borderRadius: '16px', border: '1px solid #1f2937'}}>
          {[
            { value: '4', label: 'Interview Tracks' },
            { value: 'AI', label: 'Powered Feedback' },
            { value: '5', label: 'Questions per Session' },
          ].map((stat, i) => (
            <div key={i} style={{textAlign: 'center'}}>
              <p style={{color: '#6366f1', fontSize: '1.5rem', fontWeight: 'bold'}}>{stat.value}</p>
              <p style={{color: '#64748b', fontSize: '0.8rem'}}>{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}