const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const passport = require('passport')
const Surveyor = require('../models/surveyor')
const jwt = require('jsonwebtoken');

router.post('/register', catchAsync(async (req, res) => {
    const { email, username, password, name, designation, organization } = req.body;
    const s = new Surveyor({ email, username, name, designation, organization })
    const newSurveyor = await Surveyor.register(s, password)
    return res.send(newSurveyor)
}))




router.post('/login', catchAsync(async (req, res, next) => {
    jwt.sign(req.body, 'privatekey', { expiresIn: '1h' }, (err, token) => {
        if (err) { console.log(err) }
        res.send(token);

    });
    // res.redirect('http://localhost:3000/')
}))



router.get('/logout', (req, res) => {
    req.logout();
    res.send('You are logged Out Successfully!')
})

module.exports = router