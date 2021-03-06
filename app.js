const express = require("express");
const exphbs = require("express-handlebars");

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

const bcrypt     = require("bcrypt");
const saltRounds = 10;

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

/* //Ip need to be added in whitelist
mongoose.connect('mongodb+srv://wikizell:ironhack@wikizell-gj6o2.azure.mongodb.net/imdb', {useNewUrlParser: true}, (err)=> {
    if(!err)console.log("connected to database")
    else console.log("ERROR: Can't connect to database", err)
}) */

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 360000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));



app.use("/", userInfo, require("./routes/index"))
app.use("/", userInfo, require("./routes/movie"))
app.use("/", userInfo, require("./routes/celebrities"))
app.use("/", userInfo, require("./routes/user"))

function userInfo(req, res, next) {
  res.locals.currentUser = req.session.currentUser
  next()
}

app.listen(3000, () => {
  console.log("listening");
});
