const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);
const User = require('./models/user');
const {auth} = require('./middlewares/auth');
const NewsAPI = require('newsapi');
const apiKey = require('./credentials/api');
const newsapi = new NewsAPI(apiKey.newsApiKey);
const axios = require("axios");
const app = express();


// app use
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(cookieParser());

// database connection
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE,{ useNewUrlParser: true, useUnifiedTopology:true },function(err){
    if(err) console.log(err);
    else{console.log("Database is connected")};
});

//main path
app.get('/',function(req,res){
    res.status(200).send(`Welcome to login , sign-up api`);
});

//signup
app.post('/signup',function(req,res){
    // taking a user
    const newuser=new User(req.body);

    User.findOne({email:newuser.email},function(err,user){
        if(user) return res.status(400).json({ auth : false, message :"email exists"});
 
        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({ success : false});}
            res.status(200).json({
                succes:true,
                user : doc
            });
        });
    });
 });

 //login
app.post('/login', function(req,res){
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : 'Auth failed ,email not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false, message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id
                        ,email : user.email
                    });
                });    
            });
          });
        }
    });
});

// get news for logged in user
app.get('/news',auth,function(req,res){

    if(Object.keys(req.query).length !== 0){
        try{
            newsapi.v2.topHeadlines({
                category: req.query.search,
                language: 'en'
              }).then(response => {
                var data = [];
                var count = 0;
                response['articles'].forEach(element => {
                    var q = {
                       "headline" : element['title'],
                       "link" : element['url']
                    };
                    data.push(q);
                    count+=1;
                });
                const result = {
                    "count" : count,
                    "data" : data
                }
                res.json(result);
              });
        }catch(err){
            res.status(400).send(err);
        }
    }else {

    newsapi.v2.topHeadlines({
        language: 'en'
      }).then(response => {
        var data = [];
        var count = 0;
        response['articles'].forEach(element => {
            var q = {
               "headline" : element['title'],
               "link" : element['url']
            };
            data.push(q);
            count+=1;
        });
        const result = {
            "count" : count,
            "data" : data
        }
        res.json(result);
      });
    }
});

//logout user
app.get('/logout',auth,function(req,res){
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200);
    });

}); 

//get 5 days weather data of Bengaluru for any user
app.get('/weather', async(req, res)=>{
    var path;
    var location;
    if(Object.keys(req.query).length !== 0){
        path=`http://api.openweathermap.org/data/2.5/forecast?id=524901&q=${req.query.location}&cnt=5&appid=${apiKey.weatherApiKey}`;
        location=req.query.location;
    }
    else{
        path=`http://api.openweathermap.org/data/2.5/forecast?id=524901&q=bengaluru&cnt=5&appid=${apiKey.weatherApiKey}`;
        location="Bengaluru"
    }
    axios.get(path).then(
        (response) => {
            var result = response.data;
            var data = [];
            const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ];
        
            result['list'].forEach(element => {
                var myDate = new Date(element['dt'] *1000);
                var q = {
                "date" :  weekday[myDate.getDay()] + " " + monthNames[myDate.getMonth()] + " " + myDate.getDate() + " " + myDate.getFullYear(),
                "main" : element.weather[0].main,
                "temp": element.main.temp
                };
                data.push(q);
            });
            res.json({"count": 5 ,"unit": "metric", "location": location, "data": data});
        },
        (error) => {
            console.log(error);
        }
    );

});

// export app
module.exports = app