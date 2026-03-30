import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login'
      const res = await api.post(url, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{background: '#111827', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #1f2937'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <span style={{fontSize: '2.5rem'}}>🎯</span>
          <h1 style={{color: 'white', fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0'}}>MockMate</h1>
          <p style={{color: '#64748b', fontSize: '0.9rem'}}>{isRegister ? 'Create your account' : 'Welcome back!'}</p>
        </div>

        {isRegister && (
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={{width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #1f2937', background: '#0a0f1e', color: 'white', boxSizing: 'border-box', fontSize: '0.95rem'}}
          />
        )}
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          style={{width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #1f2937', background: '#0a0f1e', color: 'white', boxSizing: 'border-box', fontSize: '0.95rem'}}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          style={{width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #1f2937', background: '#0a0f1e', color: 'white', boxSizing: 'border-box', fontSize: '0.95rem'}}
        />

        {error && <p style={{color: '#f87171', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{width: '100%', padding: '0.875rem', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'}}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>

        <p style={{color: '#64748b', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsRegister(!isRegister)} style={{color: '#6366f1', cursor: 'pointer', marginLeft: '0.5rem'}}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  )
}