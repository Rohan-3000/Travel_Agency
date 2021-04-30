//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const {check,validatorResult}= require('express-validator');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
// mongoose.connect("mongodb://localhost:27017/travelDatabase", { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true });
mongoose.connect("mongodb+srv://admin-rohan:rohan123@cluster0.ikstt.mongodb.net/travelDB", { useNewUrlParser: true, useUnifiedTopology: true });
app.get("/", function(req, res){
  res.render("home", {
    
    });
});
app.get("/login", function(req, res){
  
  res.render("login", {alert:""});
});
app.post("/login",function(req,res){
  const email1 = req.body.email;
  const pwrd1 = req.body.pwrds;
 
  Signup.findOne({email:email1},function(err,found){
    if(err){
      console.log(err);
    }
    else{
      if(found){
        if(found.password===pwrd1){
          res.redirect("/package");
        }
        else{
          res.render("login", {alert:"Invalid details"});
        }
      }
      else{
        res.render("login", {alert:"Looks like you haven't registered yet with this detail!"});
      }
    }
  });
  
  
});
let bid=0;
const secret ="Thisisoursecret.";
app.get("/signup", function(req, res){
  res.render("signup", {alert1:""});
});
app.post("/signup",function(req,res){
  // const errors = validatorResult(req);
  // if(!errors.isEmpty()){
  //   const alert =errors.array()
  //   res.render("signup",alert)
  // }

  const name = req.body.fname;
  const email2 = req.body.email;
  const pwrd1 = req.body.pwrd1;
  const pwrd2 = req.body.pwrd2;
  const add = req.body.add;
  const city = req.body.city;
  const mnum = req.body.mnum;
  Signup.findOne({email:email2},function(err,found){
    if(err){
      console.log(err);
    }
    else{
      if(found){
         res.render("signup", {alert1:"This Email is already taken!"});
      }
      else{
        if(pwrd1===pwrd2){
          const signup1= new Signup({ 
            name: name,
            email:email2,
            password:pwrd1,
            cpassword:pwrd2,
            address:add,
            city:city,
            mobNum:mnum
          });
          signup1.save();
          res.redirect("/package");
        }
        else{
          res.render("signup", {alert1:"Passwords are not matching!"});
        }
      }
    }
  });
 
});
app.get("/package", function(req, res){
  res.render("package", {
    
    });
});
app.get("/success", function(req, res){
  res.render("success", {
    
    });
});
app.post("/success", function(req, res){
  res.redirect("/package");
});
app.get("/contact", function(req, res){
  res.render("contact", {
    
    });
});
app.get("/rishikesh", function(req, res){
  res.render("rishikesh", {
    
    });
});
app.get("/packageRegistration", function(req, res){
  res.render("packageRegistration", {
    
    });
});
app.post("/packageRegistration",function(req,res){
  const fname =req.body.first_name;
  const lname =req.body.last_name;
  const email =req.body.email;
  const area_code =req.body.area_code;
  const mobNum =req.body.phone;
  const numofpass =req.body.subject;
  const info =req.body.tourinfo;
  const aadhar =req.body.aadhar_num;
  let tourID,startdate,hotelname,enddate;
  if(info==="Rishikesh"){
    tourID=1;
    hotelname="Sayaji Hotel";
    startdate="25-10-2021";
    enddate="1-11-2021";
  }
  else if(info==="Kerela"){
    tourID=2;
    hotelname="Mantra Hotel";
    startdate="25-9-2021";
    enddate="1-9-2021";
  }
  else if(info==="Jammu"){
    hotelname="Alisons Hotel";
    tourID=3;
    startdate="2-2-2021";
    enddate="1-3-2021";
  }
  else if(info==="Hyderabad"){
    hotelname="Jayanta Hotel";
    tourID=4;
    startdate="16-10-2021";
    enddate="18-11-2021";
  }
  else if(info==="Jaipur"){
    hotelname="Radisson Hotel";
    tourID=5;
    startdate="5-12-2021";
    enddate="10-12-2021";
  }
  else if(info==="Manali"){
    hotelname="Temple Hotel";
    tourID=6;
    startdate="2-10-2021";
    enddate="15-11-2021";
  }else{
    tourID=0;
  }
  bid=bid+1;
  res.render("success",{Name:fname,MNum:mobNum,tp:numofpass,tourname:info,bid:bid,hn:hotelname,sd:startdate,ed:enddate});
  const tour1= new Tour({ 
    fname: fname,
    lname: lname,
    email:email,
    code: area_code,
    mobNum:mobNum,
    adharNum:aadhar,
    numofpass:numofpass,
    Tourinfo:info,
    TourID:tourID,
    booking_id:bid
  });
  tour1.save();
  Package.findOne({tourName:info},function(err,found){
    if(!err){
      if(found){
        found.passengers.push(tour1);
        found.save();
      }
      else{
        const newPackage = new Package({
          tourName:info,
          passengers:[tour1]
        });
        newPackage.save();
      }
    }
  });
  
  res.redirect("/success");
});
const tourRegSchema = new mongoose.Schema({
  TourID:{
    type:String
  },
  fname:{
    type:String,
    required:true
  },
  lname:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  code:{
    type:Number,
    required:true
  },
  mobNum:{
    type:Number,
    required:true
  },
  adharNum:{
    type:Number,
    required:true
  },
  numofpass:{
    type:Number,
    required:true
  },
  Tourinfo:{
    type:String,
    required:true
  },
  booking_id:{
    type:Number,
    required:true
  }
});
const signupSchema =new mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },  
  address:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  mobNum:{
    type:Number,
    required:true
  }   
});
const packageSchema = new mongoose.Schema({
  tourName: String,
  passengers:[tourRegSchema]
});

signupSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const Signup = mongoose.model("Signup",signupSchema);
const Tour = mongoose.model("Tour",tourRegSchema);
const Package = mongoose.model("Package",packageSchema);
let port =process.env.PORT;
if(port==null || port==""){
  port=3000;
}
app.listen(port, function () {
  console.log("Server started on port successfully");
});
