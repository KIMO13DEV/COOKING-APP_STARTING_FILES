const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

mongoose.connect("mongodb+srv://admin:KIMO13@cluster0.nmtis.mongodb.net/cooking?retryWrites=true&w=majority&appName=Cluster0")
//EJS
app.set("view engine","ejs");
//public folder
app.use(express.static("public"));
//BodyParser
app.use(bodyParser.urlencoded({extended:false}));

//Models
const User = require("./models/user")


const methodeOverride = require('method-override');
const flash = require('connect-flash');


app.get('/',(req,res)=>{
    res.render("index");
});

app.get('/signup',(req,res)=>{
    res.render("signup");
});

app.post('/signup',async(req,res)=>{
    try{
        const saltRounds = 10;
        bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
        const user = new User({
        username: req.body.username,
        password: hash
        })
        await user.save();
        res.render("index");
        });
    }

    catch(err){
        console.error("Erreur lors de l'inscription :", err);
    } 
        
    });

app.get("/login",(req,res)=>{
res.render("login");
});

app.post('/login',async (req,res)=>{
    try{
        foundUser = await User.findOne({username:req.body.username});
            if(foundUser){
                bcrypt.compare(req.body.password,foundUser.password,(err,result)=>{
                    if (result){
                        console.log(foundUser.username+' connecté !');
                        res.render("index");
                    }
                    else{
                        console.log('passeword incorrect');
                    }
                }); 
            }   
            else{
               res.send("User dose'nt exit")
            }
        }
        catch(err){
            console.log(err);
        }
});



app.listen(port,(req,res)=>{
console.log(`Serveur en écoute sur http://localhost:${port}`);
});