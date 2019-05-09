const express = require("express")
const app = express()
const mongoose = require("mongoose")

const bcrypt = require('bcrypt');
const UsersDB = require("../models/users")

app.get("/user/sign-up", (req, res) => {
    
    res.render("sign-up",{ title:'IronHack Cinema - SignUp',layout: 'authentication-layout' });
    
       
  });

app.post("/user/sign-up", (req, res) => {

    let newUser = new UsersDB ({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
        })
    
    UsersDB.find({ email: req.body.email })
        .then((user) => {
            if (user.length > 0) {
                res.status(200).send({status:"error",message:"User Already Exists"})            
            } else {
                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    // Store hash in your password DB.
                    if (err) throw new Error("hashing error")
                    else {
                        newUser.password = hash
                        UsersDB.create(newUser)
                            .then((user) => {
                                res.status(200).send({status:"success",message:"User Created"})                                
                            })
                    }
                });
            }
        })
        .catch((err) => {
            res.status(500).send({status:"error",message:"An error occured"})
        })

})

app.get("/user/login", (req, res) => {
    res.cookie("loggedIn", "true")
    res.render("login",{ title:'IronHack Cinema - Login',layout: 'authentication-layout' });
       
  });

app.post("/user/login", (req, res) => {

    console.log(req.body);
    
    UsersDB.find({ email: req.body.email })
        .then((user) => {
            if (user.length == 0) {
                //No user in database
                res.status(200).send({status:"error",message:"User not registerd"})            
            } else {
                //User found proceed with authentication
                bcrypt.compare(req.body.password, user[0].password, function(err, equal) {
                    if(equal) {
                        //Password match
                        delete user[0].password
                        req.session.currentUser = user[0];
                        res.redirect("/movie/moviesList")
                    }else{
                        res.status(200).send({status:"error",message:"Invalid credentials"}) 
                    }
                })
                
            }
        })
        .catch((err) => {
            res.status(500).send({status:"error",message:"An error occured"})
        })

})

app.get("/user/logout", (req, res) => {
    req.session.destroy((err)=> {
        res.clearCookie("loggedIn")
        if(err) res.redirect("/")
        else res.redirect("/")
    })
  });

  module.exports = app