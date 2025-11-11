// userRoutes.js
const express = require('express');
const router = express.Router();


const { registerUser,loginUser} = require('../controllers/authcontroller');



router.get('/register', function (req, res) {
    res.render('Register')
})

router.get('/login', function (req, res) {
    res.render('Login')
})

router.post('/register',registerUser)
router.post('/login',loginUser)
module.exports = router



