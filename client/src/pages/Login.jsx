import { useState } from 'react'
import axios from 'axios'

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
      const res = await axios.post(url, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      onLogin(res.data.user)
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px'}}>
        <h1 style={{color: 'white', fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem'}}>MockMate 🎯</h1>
        <p style={{color: '#94a3b8', textAlign: 'center', marginBottom: '1.5rem'}}>{isRegister ? 'Create an account' : 'Welcome back'}</p>

        {isRegister && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={{width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box'}}
          />
        )}
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          style={{width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box'}}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          style={{width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', boxSizing: 'border-box'}}
        />

        {error && <p style={{color: '#f87171', marginBottom: '1rem'}}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'}}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>

        <p style={{color: '#94a3b8', textAlign: 'center', marginTop: '1rem'}}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsRegister(!isRegister)} style={{color: '#6366f1', cursor: 'pointer', marginLeft: '0.5rem'}}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  )
}