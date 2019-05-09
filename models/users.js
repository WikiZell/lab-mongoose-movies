const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema({
    fullName: { type: String },
    email: { type: String },
    password: {type: String }
  }, { versionKey: false })

module.exports = mongoose.model('user', usersSchema);