/* 
npm init -y 
npm install express --save
npm install nodemon
*/

//require express
const express = require("express");
const exphbs = require("express-handlebars");

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bodyParser = require('body-parser')

var app = express();

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "layout",    
    partialsDir: __dirname + "/views/partials/"
  })
);


app.set("view engine", ".hbs");
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost/imdb', {useNewUrlParser: true}, (err)=> {
    if(!err)console.log("connected to database")
    else console.log("ERROR: Can't connect to database", err)
})

const moviesSchema = new Schema({
    title: { type: String },
    year: { type: String },
    director: {type: String },
    duration: {type: String},
    genre: {type: Array},
    rate: {type: String},
    celebrities: [{type: mongoose.Schema.Types.ObjectId, ref:"celebrities"}]
  }, { versionKey: false })

  const MoviesDB = mongoose.model('movies', moviesSchema);

//celebrities

const celebritiesSchema = new Schema({
  name: { type: String },
  age: { type: String },
  movies: [{type: mongoose.Schema.Types.ObjectId,ref:"movies"}],
}, { versionKey: false })

const CelebDB = mongoose.model('celebrities', celebritiesSchema);



app.get("/", (req, res) => {
  res.render("index");
});



app.get("/detail-movie",  async (req, res) => {
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

app.get("/delete-movie",  async (req, res) => {
  let objectId = mongoose.Types.ObjectId(req.query.id);

  try {
    await MoviesDB.deleteOne({ _id: objectId })

    res.status(200).send("ok")

  } catch (err) {
    res.status(500).send(err)
  }
    
});

app.post("/update-movie", async (req,res)=> {
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

app.post("/add-movie", async (req,res)=> {
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


app.get("/moviesList", (req, res) => {
  MoviesDB.find({})
  .populate("celebrities")
  .then((result)=>{
    console.log(result[0].celebrities[0].name)
    res.render("moviesList",{movies: result,helpers: {
      inc: function (value) {  return parseInt(value) + 1; }
    }});
  })
  
});


//Celebrities

app.post("/add-celebrities", async (req, res)=> {

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

app.get("/delete-celebrity", async (req,res) => {
  
  let celebID = mongoose.Types.ObjectId(req.query.id);

  try {
    await CelebDB.deleteOne({ _id: celebID })
    res.status(200).send("ok")

  } catch (err) {
    res.status(500).send(err)
  }


})


app.post("/celeb-movies", async (req, res)=> {

  
  if(!Array.isArray(req.body.movies) ){
    req.body.movies = [req.body.movies];
  }
  if(!Array.isArray(req.body.oldMovies) ){
    req.body.oldMovies = [req.body.oldMovies];
  }
  
  //Get intersection BEFORE / AFTER
  let removedMovies = req.body.oldMovies.filter(x => !req.body.movies.includes(x));

  let moviesIds = req.body.movies.map( (id)=> {
      return mongoose.Types.ObjectId(id)
  })

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
      for (let i = 0; i < removedMovies.length; i++) {
        let movieID = removedMovies[i];
        MoviesDB.findOneAndUpdate({ _id: movieID }, { $pull: { celebrities: celebID } }, { new: true, useFindAndModify: false }, (err, res) => {
          if(err){
            return next(err)
          }
        })
      }
      
      res.status(200).json(result)

      
    })
  } catch (err) {
    res.status(500).send(err)
  } 

})

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
app.listen(3000, () => {
  console.log("listening");
});
