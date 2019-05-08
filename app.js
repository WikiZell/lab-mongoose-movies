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
const cookieParser = require('cookie-parser')

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

app.use("/", require("./routes/index"))
app.use("/", require("./routes/movie"))
app.use("/", require("./routes/celebrities"))


app.listen(3000, () => {
  console.log("listening");
});
