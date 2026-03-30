const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
  question:  String,
  answer:    String,
  score:     Number,
  feedback:  String,
})

const SessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role:      String,
  questions: [QuestionSchema],
  avgScore:  Number,
}, { timestamps: true })

module.exports = mongoose.model('Session', SessionSchema)