
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
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/childSurvey', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo Connected')
    })
    .catch((err) => {
        console.log('Connection Error')
        console.log(err)
    })
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}



const app = express();
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json())
app.use(cors(corsOptions))
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

app.get('/', catchAsync(async (req, res, next) => {
    const surveyor = await Surveyor.find({ username: 'vishu ji' })
    if (!surveyor) {
        return next(new AppError('Data does not exist', 204))
    } else {
        res.send(surveyor)
    }
}))

app.all('*', (req, res, next) => {
    next(new AppError('Page does not exist Sir', 404))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send({ error: message })


})


app.listen(8080, () => {
    console.log('Server listening on Port 8080')
})






