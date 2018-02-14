const mongoose = require('../config/database')
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose

const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('profiles', profileSchema)
