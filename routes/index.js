const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.render("index",{layout: false});
  });

module.exports = app