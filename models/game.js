const mongoose = require('../config/database')
const { Schema } = mongoose

const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  symbol: { type: String, required: true },
});

const weightSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  date: { type: Date, required: true },
  weigh: { type: Number, default: 0 },
});

const gameSchema = new Schema({
  players: [playerSchema],
  weights: [weightSchema],
  started: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  starts_at: { type: Date, default: Date.now },
  ends_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  prize1:  { type: Number, default: 0 },
  prize2:  { type: Number, default: 0 }
});

module.exports = mongoose.model('games', gameSchema)
