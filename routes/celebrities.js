const express = require("express")
const app = express()
const mongoose = require("mongoose")
const CelebDB = require("../models/celebrities")
const MoviesDB = require("../models/movies")



app.get("/celebrities", (req, res) => {  
    MoviesDB.find({}, (err, movie)=> {
      if(err){
        return next(err)
      }
      CelebDB.find({}, (err, celeb)=> {
        if(err){
          return next(err)
        }
        
        res.send({movie,celeb});
      });
    });  
  });

//Celebrities

app.post("/celebrities/add-celebrities", async (req, res)=> {

    let newCeleb = {
        name: req.body.name,
        age: req.body.age        
    }
  
    try {          
      await CelebDB.create(newCeleb, (err,response) => {      
      res.status(200).send(response)        
      })
    } catch (err) {
      res.status(500).send(err)
    }  
  })
  
  app.get("/celebrities/delete-celebrity", async (req,res) => {    
    let celebID = mongoose.Types.ObjectId(req.query.id);  
    try {
      await CelebDB.deleteOne({ _id: celebID })
      res.status(200).send("ok")
  
    } catch (err) {
      res.status(500).send(err)
    }  
  
  })
  
  
  app.post("/celebrities/celeb-movies", async (req, res, next)=> {
    
    if(!req.body.oldMovies){
        req.body.oldMovies = [];
    }

    if(!Array.isArray(req.body.oldMovies) ){
        req.body.oldMovies = [req.body.oldMovies];
    }
    
    if(!Array.isArray(req.body.movies) ){
        req.body.movies = [req.body.movies];
      }

    
    
    //Get intersection BEFORE / AFTER
    var removedMovies = req.body.oldMovies.filter(x => !req.body.movies.includes(x));    
    console.log("intersection",removedMovies)
    
    
  
    let moviesIds = req.body.movies.map( (id)=> {
        return mongoose.Types.ObjectId(id)
    })

    
    if(removedMovies.length != 0){
    var removedMovies = removedMovies.map( (id)=> {
        return mongoose.Types.ObjectId(id)
    })
    }
  
    let celebID = mongoose.Types.ObjectId(req.body.celebrity);
  
    try {
      await CelebDB.findOneAndUpdate({ _id: celebID }, {movies: moviesIds}, { new: true, useFindAndModify: false }, (err, result) => {
  
        if(err){
          return next(err)
        }
        
        for (let i = 0; i < moviesIds.length; i++) {
          let movieID = moviesIds[i];
          MoviesDB.findOneAndUpdate({ _id: movieID }, {$addToSet: { celebrities: celebID } }, { new: true, useFindAndModify: false }, (err, res) => {
            if(err){
              return next(err)
            }
          })
        }
  
        //Remove celebrity from movie not more linked
        
        if(removedMovies.length  != 0){
        for (let i = 0; i < removedMovies.length; i++) {
          let movieID = removedMovies[i];
          MoviesDB.findOneAndUpdate({ _id: movieID }, { $pull: { celebrities: celebID } }, { new: true, useFindAndModify: false }, (err, res) => {
            if(err){
              return next(err)
            }
          })
        }
        }
        
        res.status(200).json(result)
  
        
      })
    } catch (err) {
      res.status(500).send(err)
    } 
  
  })

  module.exports = app