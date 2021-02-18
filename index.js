const mongoose = require('mongoose')
const express = require("express")
const Child = require('./models/children')
const Surveyor = require('./models/surveyor')
const AppError = require('./utils/AppError')
const catchAsync = require('./utils/catchAsync')
const methodOverride = require('method-override')
const Joi = require('joi')
const { childSchema, surveyorSchema } = require('./joiSchemas')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { isLoggedIn, validateChildData } = require('./middlewares')
const session = require('express-session')
const children = require('./routes/children')
const state = require('./routes/state')
const district = require('./routes/district')

mongoose.connect('mongodb://localhost:27017/childSurvey', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo Connected')
    })
    .catch((err) => {
        console.log('Connection Error')
        console.log(err)
    })

const app = express();
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json())
app.use(session({ secret: 'thisisasecret', resave: false }))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Surveyor.authenticate()))
passport.serializeUser(Surveyor.serializeUser())
passport.deserializeUser(Surveyor.deserializeUser())


app.use('/children', children)
app.use('/state', state)
app.use('/district', district)


app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const s = new Surveyor({ email, username })
    const newSurveyor = await Surveyor.register(s, password)
    res.send(newSurveyor)
})


app.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.send('You Are Logged In')
})

app.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.send('You are logged Out Successfully!')
})

app.all('*', (req, res, next) => {
    next(new AppError('Page does not exist Sir', 404))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.send(message).status(status)


})


app.listen(3000, () => {
    console.log('Connected on Port 3000')
})






