const express = require("express")
const app = express()
const mongoose = require("mongoose")
const CelebDB = require("../models/celebrities")
const MoviesDB = require("../models/movies")

app.get("/movie/detail-movie",  async (req, res) => {
    let objectId = mongoose.Types.ObjectId(req.query.id);
  
    try {
      await MoviesDB.find({_id: objectId})
      .populate("celebrities")
      .then((result)=>{
        res.status(200).send(result)
      })
    } catch (err) {
      res.status(500).send(err)
    }    
  });
  
  app.get("/movie/delete-movie",  async (req, res) => {
    let objectId = mongoose.Types.ObjectId(req.query.id);
  
    try {
      await MoviesDB.deleteOne({ _id: objectId })
  
      res.status(200).send("ok")
  
    } catch (err) {
      res.status(500).send(err)
    }
      
  });
  
  app.post("/movie/update-movie", async (req,res)=> {
    let updateValues = {
      title: req.body.title,
      year: req.body.year,
      director: req.body.director,
      duration: req.body.duration,
      genre: req.body.genre,
      rate: req.body.rate || "Unknown"
      },
  
    objectId = mongoose.Types.ObjectId(req.body.id);
  
    try {
      await MoviesDB.findOneAndUpdate({_id: objectId},updateValues,{new:true,useFindAndModify:false}, (err, result) => {
        
        
        res.status(200).json(result)
      })
    } catch (err) {
      res.status(500).send(err)
    }
  })
  
  app.post("/movie/add-movie", async (req,res)=> {
    let addValues = new MoviesDB ({
      title: req.body.title,
      year: req.body.year.toString(),
      director: req.body.director,
      duration: req.body.duration.toString(),
      genre: req.body.genre.split(","),
      rate: req.body.rate.toString() || "Unknown"
      })
  
      try {
        
        await MoviesDB.create(addValues, (err,response) => {
          
        res.status(200).send(response)
          
        })
      } catch (err) {
        res.status(500).send(err)
      }
  })
  
  
  app.get("/movie/moviesList", (req, res) => {
    MoviesDB.find({})
    .populate("celebrities")
    .then((result)=>{
      res.render("moviesList",{movies: result,helpers: {
        inc: function (value) {  return parseInt(value) + 1; }
      }});
    })
    
  });

  module.exports = app