import { useRef } from 'react'

export default function Results({ questions, role, onHome }) {
  const resultRef = useRef(null)
  const avgScore = Math.round(questions.reduce((sum, q) => sum + q.score, 0) / questions.length)

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e'
    if (score >= 5) return '#f59e0b'
    return '#ef4444'
  }

  const getMessage = () => {
    if (avgScore >= 8) return { text: 'Excellent work! You are well prepared!', icon: '🌟' }
    if (avgScore >= 5) return { text: 'Good effort! Keep practicing!', icon: '💪' }
    return { text: 'Keep going! Practice makes perfect!', icon: '🔥' }
  }

  const msg = getMessage()

  const handleShare = async () => {
    try {
      const element = resultRef.current
      const canvas = document.createElement('canvas')
      const scale = 2
      canvas.width = element.offsetWidth * scale
      canvas.height = element.offsetHeight * scale
      const ctx = canvas.getContext('2d')
      ctx.scale(scale, scale)
      ctx.fillStyle = '#0a0f1e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const data = `MockMate Interview Results\n\nRole: ${role.label}\nDifficulty: ${role.difficulty || 'Medium'}\nAverage Score: ${avgScore}/10\n${msg.icon} ${msg.text}\n\nQuestions:\n${questions.map((q, i) => `Q${i+1}: ${q.score}/10 - ${q.question.substring(0, 50)}...`).join('\n')}`

      const blob = new Blob([data], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `MockMate_Results_${role.label.replace(' ', '_')}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Results saved!')
    }
  }

  return (
    <div style={{backgroundColor: '#0a0f1e', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{maxWidth: '700px', margin: '0 auto'}}>

        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#111827', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #1f2937'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span style={{fontSize: '1.5rem'}}>🎯</span>
            <span style={{color: 'white', fontSize: '1.3rem', fontWeight: 'bold'}}>MockMate</span>
          </div>
          <div style={{display: 'flex', gap: '0.75rem'}}>
            <button onClick={handleShare} style={{padding: '0.5rem 1rem', background: '#1f2937', color: '#a5b4fc', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'}}>
              📤 Export Results
            </button>
            <button onClick={onHome} style={{padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'}}>
              🏠 Home
            </button>
          </div>
        </div>

        <div ref={resultRef}>
          {/* Score card */}
          <div style={{background: '#111827', borderRadius: '16px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid #1f2937', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${getScoreColor(avgScore)}, #6366f1)`}}/>
            <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Interview Complete {msg.icon}</p>
            <p style={{color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>{role.icon} {role.label}</p>
            <div style={{display: 'inline-block', background: getScoreColor(avgScore) + '22', borderRadius: '50%', padding: '1.5rem', marginBottom: '1rem', border: `2px solid ${getScoreColor(avgScore)}44`}}>
              <p style={{color: getScoreColor(avgScore), fontSize: '3.5rem', fontWeight: 'bold', lineHeight: 1}}>{avgScore}</p>
              <p style={{color: '#64748b', fontSize: '0.8rem'}}>out of 10</p>
            </div>
            <p style={{color: 'white', fontSize: '1.1rem', fontWeight: '600'}}>{msg.text}</p>

            {/* Mini score bars */}
            <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem'}}>
              {questions.map((q, i) => (
                <div key={i} style={{textAlign: 'center'}}>
                  <div style={{width: '32px', height: '60px', background: '#1f2937', borderRadius: '6px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden'}}>
                    <div style={{width: '100%', height: `${q.score * 10}%`, background: getScoreColor(q.score), borderRadius: '4px', transition: 'height 0.5s'}}/>
                  </div>
                  <p style={{color: '#64748b', fontSize: '0.7rem', marginTop: '0.25rem'}}>Q{i+1}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Question review */}
          <h2 style={{color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem'}}>Question Review</h2>
          {questions.map((q, i) => (
            <div key={i} style={{background: '#111827', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', borderLeft: `4px solid ${getScoreColor(q.score)}`, border: `1px solid #1f2937`, borderLeftWidth: '4px', borderLeftColor: getScoreColor(q.score)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
                <span style={{background: '#1f2937', color: '#94a3b8', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem'}}>Question {i + 1}</span>
                <span style={{color: getScoreColor(q.score), fontWeight: 'bold', fontSize: '1rem'}}>{q.score}/10</span>
              </div>
              <p style={{color: 'white', marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: '1.5'}}>{q.question}</p>
              <p style={{color: '#475569', fontSize: '0.85rem', marginBottom: '0.5rem', fontStyle: 'italic'}}>Your answer: {q.answer}</p>
              <p style={{color: '#64748b', fontSize: '0.85rem', lineHeight: '1.6'}}>{q.feedback}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onHome}
          style={{width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem'}}
        >
          Start New Interview 🚀
        </button>

      </div>
    </div>
  )
}