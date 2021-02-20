const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const passport = require('passport')

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const s = new Surveyor({ email, username })
    const newSurveyor = await Surveyor.register(s, password)
    res.send(newSurveyor)
})


router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.send('You Are Logged In')
})

router.get('/logout', (req, res) => {
    req.logout();
    res.send('You are logged Out Successfully!')
})

module.exports = router