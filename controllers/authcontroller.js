const jwt = require('jsonwebtoken'); // For token generation
const UserModel = require('../models/userModel'); // Your Mongoose User model
const bcrypt = require('bcrypt')
const cookie = require('cookie-parser');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/generatetoken');

 module.exports.registerUser = async function (req, res) {
    try {
        let { fullname, email, password } = req.body;

        let existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            req.flash("error","Email already registered,please Login")
            return res.redirect("/register")
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message)
                else {
                    let user = await UserModel.create({
                        fullname,
                        email,
                        password: hash
                    })
                    let token = generateToken(user)
                    res.cookie("token", token)
                    req.flash("success","Registered Successfully Please Login")
                    res.redirect("/login")
                }



            });
        });

    } catch (err) {
        console.log(err.message)
        req.flash("error","something went wrong")
        return res.redirect("/register")
    }
}


module.exports.loginUser = async function(req,res){
    let {email,password} = req.body
    try{
         let user = await userModel.findOne({email})
    if(!user){
        req.flash("error","Invalid email or password")

     return res.redirect("/login")
    }
    else{
        bcrypt.compare(password,user.password,function(err,result){
            if(err){
                req.flash("error","something went wrong")
                res.redirect("/login")
            }
            if(result){
                let token = generateToken(user)
            res.cookie("token",token)
            req.flash("success","You are logged in successfully!")
            res.redirect("/login")

            }else{
                req.flash("error","Invalid email or password")
                return res.redirect("/login")
                
            }
            
        })

    }

    }catch(err){
        req.flash("error","something went Wrong")
        res.redirect("/login")
    }
   
}