import { useState, useEffect, useRef } from 'react'
import api from '../api'

export default function Interview({ role, onFinish }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [questionNum, setQuestionNum] = useState(1)
  const [phase, setPhase] = useState('answering')
  const [timeLeft, setTimeLeft] = useState(120)
  const timerRef = useRef(null)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const getTimerColor = () => {
    if (timeLeft > 60) return '#22c55e'
    if (timeLeft > 30) return '#f59e0b'
    return '#ef4444'
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    fetchQuestion()
  }, [])

  useEffect(() => {
    if (phase === 'answering') {
      setTimeLeft(120)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [phase, question])

  const fetchQuestion = async () => {
    setLoading(true)
    setAnswer('')
    setFeedback(null)
    setPhase('answering')
    try {
      const prev = questions.map(q => q.question)
      const res = await api.post('/api/interview/question', {
        role: role.label,
        difficulty: role.difficulty,
        previousQuestions: prev
      }, { headers })
      setQuestion(res.data.question)
    } catch (err) {
      setQuestion('Error loading question. Please try again.')
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    clearInterval(timerRef.current)
    if (!answer.trim()) return
    setLoading(true)
    setPhase('feedback')
    try {
      const res = await api.post('/api/interview/evaluate', {
        question, answer, role: role.label
      }, { headers })
      setFeedback(res.data)
      setQuestions(prev => [...prev, { question, answer, score: res.data.score, feedback: res.data.feedback }])
    } catch (err) {
      setFeedback({ score: 0, feedback: 'Error evaluating answer.', improvements: '' })
    }
    setLoading(false)
  }

  const handleNext = () => {
    if (questionNum >= 5) {
      onFinish(questions)
    } else {
      setQuestionNum(questionNum + 1)
      fetchQuestion()
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e'
    if (score >= 5) return '#f59e0b'
    return '#ef4444'
  }

  const difficultyColor = {
    Easy: '#22c55e',
    Medium: '#f59e0b',
    Hard: '#ef4444'
  }

  return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{maxWidth: '700px', margin: '0 auto'}}>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #1f2937'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span style={{fontSize: '1.3rem'}}>🎯</span>
            <span style={{color: 'white', fontWeight: 'bold'}}>MockMate</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>{role.icon} {role.label}</span>
            <span style={{background: difficultyColor[role.difficulty] + '22', color: difficultyColor[role.difficulty], padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600'}}>
              {role.difficulty}
            </span>
            <span style={{color: '#6366f1', fontWeight: 'bold'}}>Q{questionNum}/5</span>
          </div>
        </div>

        <div style={{background: '#1f2937', borderRadius: '999px', height: '6px', marginBottom: '1.5rem'}}>
          <div style={{background: 'linear-gradient(90deg, #6366f1, #ec4899)', height: '6px', borderRadius: '999px', width: `${(questionNum / 5) * 100}%`, transition: 'width 0.3s'}}/>
        </div>

        {phase === 'answering' && (
          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#111827', padding: '0.5rem 1rem', borderRadius: '999px', border: `1px solid ${getTimerColor()}`}}>
              <span style={{fontSize: '1rem'}}>⏱️</span>
              <span style={{color: getTimerColor(), fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'monospace'}}>{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

        <div style={{background: '#111827', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid #1f2937'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
            <span style={{background: '#6366f133', color: '#a5b4fc', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600'}}>Question {questionNum}</span>
          </div>
          {loading && phase === 'answering' ? (
            <p style={{color: '#6366f1'}}>Generating question...</p>
          ) : (
            <p style={{color: 'white', fontSize: '1.1rem', lineHeight: '1.7'}}>{question}</p>
          )}
        </div>

        {phase === 'answering' && (
          <>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be specific and use examples where possible."
              rows={6}
              style={{width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #1f2937', background: '#111827', color: 'white', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6'}}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              style={{width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', opacity: !answer.trim() ? 0.5 : 1}}
            >
              {loading ? 'Evaluating...' : 'Submit Answer ✓'}
            </button>
          </>
        )}

        {phase === 'feedback' && feedback && (
          <div style={{background: '#111827', borderRadius: '16px', padding: '1.75rem', border: '1px solid #1f2937'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: getScoreColor(feedback.score) + '11', borderRadius: '12px', border: `1px solid ${getScoreColor(feedback.score)}33`}}>
              <div style={{textAlign: 'center'}}>
                <p style={{color: getScoreColor(feedback.score), fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1}}>{feedback.score}</p>
                <p style={{color: '#64748b', fontSize: '0.75rem'}}>out of 10</p>
              </div>
              <div>
                <p style={{color: 'white', fontWeight: '600', marginBottom: '0.25rem'}}>
                  {feedback.score >= 8 ? '🌟 Excellent!' : feedback.score >= 5 ? '👍 Good effort!' : '💪 Keep practicing!'}
                </p>
                <p style={{color: '#64748b', fontSize: '0.85rem'}}>Your answer has been evaluated</p>
              </div>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <p style={{color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem'}}>📝 FEEDBACK</p>
              <p style={{color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem'}}>{feedback.feedback}</p>
            </div>

            <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#f59e0b11', borderRadius: '12px', border: '1px solid #f59e0b22'}}>
              <p style={{color: '#fbbf24', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem'}}>💡 IMPROVEMENTS</p>
              <p style={{color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem'}}>{feedback.improvements}</p>
            </div>

            <button
              onClick={handleNext}
              style={{width: '100%', padding: '0.875rem', background: questionNum >= 5 ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'}}
            >
              {questionNum >= 5 ? '🎉 See Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}