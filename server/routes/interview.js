const router = require('express').Router()
const auth = require('../middleware/auth')
const { generateQuestion, evaluateAnswer } = require('../services/claudeService')
const Session = require('../models/Session')

// Generate a question
router.post('/question', auth, async (req, res) => {
  try {
    const { role, previousQuestions, difficulty } = req.body
    const question = await generateQuestion(role, previousQuestions, difficulty || 'Medium')
    res.json({ question })
  } catch (err) {
    res.status(500).json({ msg: 'Error generating question' })
  }
})

// Evaluate an answer
router.post('/evaluate', auth, async (req, res) => {
  try {
    const { question, answer, role } = req.body
    const result = await evaluateAnswer(question, answer, role)
    res.json(result)
  } catch (err) {
    res.status(500).json({ msg: 'Error evaluating answer' })
  }
})

// Save session
router.post('/session', auth, async (req, res) => {
  try {
    const { role, questions } = req.body
    const avgScore = questions.reduce((sum, q) => sum + q.score, 0) / questions.length
    const session = await Session.create({
      userId: req.user.id,
      role,
      questions,
      avgScore: Math.round(avgScore)
    })
    res.json(session)
  } catch (err) {
    res.status(500).json({ msg: 'Error saving session' })
  }
})

// Get all sessions for user
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching sessions' })
  }
})

module.exports = router