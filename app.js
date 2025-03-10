const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//Models
const User = require("./models/user")

//session
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false
}));

//passport
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb+srv://admin:KIMO13@cluster0.nmtis.mongodb.net/cooking?retryWrites=true&w=majority&appName=Cluster0")

//passport-local-mongoose
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//EJS
app.set("view engine","ejs");
//public folder
app.use(express.static("public"));
//BodyParser
app.use(bodyParser.urlencoded({extended:false}));




const methodeOverride = require('method-override');
const flash = require('connect-flash');


app.get('/',(req,res)=>{
    res.render("index");
});

app.get('/signup',(req,res)=>{
    res.render("signup");
});

app.post('/signup',(req,res)=>{
     const newUser= new User({
        username: req.body.username
    });
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/signup");
            });
        }
    });
});

app.get("/login",(req,res)=>{
res.render("login");
});

app.post('/login',(req,res)=>{
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });
    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/dashboard");
            })
        }
    });

});

app.get('/dashboard',(req,res)=>{
    res.render('dashboard');
});

app.get("/logout",(req,res)=>{
   req.logout((err)=>{
    if(err){
        console.log(err);
    }else{
        res.redirect("/login");
    }
    });
});

app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


app.listen(port,(req,res)=>{
console.log(`Serveur en écoute sur http://localhost:${port}`);
});