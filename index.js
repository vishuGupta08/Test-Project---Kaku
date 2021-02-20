if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

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
const auth = require('./routes/auth')

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
app.use('/auth', auth)



app.all('*', (req, res, next) => {
    next(new AppError('Page does not exist Sir', 404))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status)
    res.send({ error: message })


})


app.listen(3000, () => {
    console.log('Server listening on Port 3000')
})






