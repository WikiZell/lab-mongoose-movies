const mongoose = require("mongoose")
const Schema = mongoose.Schema

const celebritiesSchema = new Schema({
    name: { type: String },
    age: { type: String },
    movies: [{type: mongoose.Schema.Types.ObjectId,ref:"movies"}],
  }, { versionKey: false })
  
  

module.exports = mongoose.model('celebrities', celebritiesSchema);