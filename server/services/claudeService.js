const fetch = require('node-fetch')

const generateQuestion = async (role, previousQuestions = [], difficulty = 'Medium') => {
  const prev = previousQuestions.length > 0
    ? `Previous questions asked: ${previousQuestions.join(', ')}. Ask a different question.`
    : ''

  const difficultyGuide = {
    Easy: 'basic and fundamental concepts suitable for freshers',
    Medium: 'intermediate concepts requiring 1-2 years experience',
    Hard: 'advanced concepts requiring deep expertise and system design knowledge'
  }

  const prompt = `You are a technical interviewer. Generate ONE ${difficulty} difficulty interview question for a ${role} position. 
Difficulty level: ${difficultyGuide[difficulty]}
${prev} 
Return only the question, nothing else.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200
    })
  })

  const data = await response.json()
  console.log('Groq response:', JSON.stringify(data))
  return data.choices[0].message.content
}

const evaluateAnswer = async (question, answer, role) => {
  const prompt = `You are a technical interviewer evaluating a ${role} developer interview answer.

Question: ${question}
Answer: ${answer}

Evaluate the answer and respond in this exact JSON format:
{
  "score": <number from 1 to 10>,
  "feedback": "<2-3 sentences of constructive feedback>",
  "improvements": "<1-2 key things to improve>"
}

Return only the JSON, nothing else.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    })
  })

  const data = await response.json()
  console.log('Groq eval:', JSON.stringify(data))
  const text = data.choices[0].message.content
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

module.exports = { generateQuestion, evaluateAnswer }