
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const moviesSchema = new Schema({
    title: { type: String },
    year: { type: String },
    director: {type: String },
    duration: {type: String},
    genre: {type: Array},
    rate: {type: String},
    celebrities: [{type: mongoose.Schema.Types.ObjectId, ref:"celebrities"}]
  }, { versionKey: false })

module.exports = mongoose.model('movies', moviesSchema);