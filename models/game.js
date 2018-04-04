const mongoose = require('../config/database')
const { Schema } = mongoose

const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' }
});

const weightSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  date: { type: Date, required: true },
  weight: { type: Number, default: 0 },
});

const gameSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  players: [playerSchema],
  weights: [weightSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  starts_at: { type: Date, default: Date.now },
  ends_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  picUrl: { type: String }
});

module.exports = mongoose.model('games', gameSchema)
