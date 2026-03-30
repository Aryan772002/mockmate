import { useState } from 'react'
import api from './api'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Interview from './pages/Interview.jsx'
import Results from './pages/Results.jsx'
import History from './pages/History.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [page, setPage] = useState('home')
  const [selectedRole, setSelectedRole] = useState(null)
  const [results, setResults] = useState([])

  const handleLogin = (userData) => {
    setUser(userData)
    setPage('home')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setPage('home')
  }

  const handleStartInterview = (role) => {
    setSelectedRole(role)
    setPage('interview')
  }

  const handleFinish = async (questions) => {
    try {
      const token = localStorage.getItem('token')
      await api.post('/api/interview/session', {
        role: selectedRole.label,
        questions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.log('Session save error:', err)
    }
    setResults(questions)
    setPage('results')
  }

  const handleHome = () => {
    setPage('home')
    setSelectedRole(null)
    setResults([])
  }

  if (!user) return <Login onLogin={handleLogin} />
  if (page === 'interview') return <Interview role={selectedRole} onFinish={handleFinish} />
  if (page === 'results') return <Results questions={results} role={selectedRole} onHome={handleHome} />
  if (page === 'history') return <History onHome={handleHome} />
  if (page === 'dashboard') return <Dashboard onHome={handleHome} />

  return (
    <Home
      user={user}
      onLogout={handleLogout}
      onStartInterview={handleStartInterview}
      onHistory={() => setPage('history')}
      onDashboard={() => setPage('dashboard')}
    />
  )
}
