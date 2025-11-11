const express = require('express')
const app = express()
const db = require('./config/mongoose-connection')
const userRoutes = require('./routes/userRoutes')
const connectdb = require('./config/mongoose-connection')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const index = require("./routes/index")
const session = require("express-session")
const flash = require("connect-flash")
const fs = require('fs')
const multer = require('multer')
const ImageRoutes = require('./routes/Imageroutes')
const path = require('path')

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

// flash middleware
app.use(flash());



app.get('/',function(req,res){
     res.render('index')

})

app.use("/users",userRoutes)
app.use("/",index)
app.use("/images",ImageRoutes)




   


app.listen(3000)