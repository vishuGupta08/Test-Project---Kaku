const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const passport = require('passport')
const Surveyor = require('../models/surveyor')

router.post('/register', async (req, res) => {
    const { email, username, password, name, designation, organization } = req.body;
    const s = new Surveyor({ email, username, name, designation, organization })
    const newSurveyor = await Surveyor.register(s, password)
    res.send(newSurveyor)
})


router.post('/login', passport.authenticate('local'), async (req, res, next) => {
    res.send('Logged In')
    // res.redirect('http://localhost:3000/')
})



router.get('/logout', (req, res) => {
    req.logout();
    res.send('You are logged Out Successfully!')
})

module.exports = router