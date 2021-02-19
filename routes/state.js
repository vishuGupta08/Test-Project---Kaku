const express = require('express')
const router = express.Router();
const { isLoggedIn } = require('../middlewares')
const State = require('../models/state')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const { validateStateData } = require('../middlewares')

router.get('/', catchAsync(async (req, res, next) => {
    const states = await State.find({})
    if (!states) {
        return next(new AppError('Data does not exist', 500))
    } else {
        res.send(states)
    }

}))

router.post('/', validateStateData, isLoggedIn, catchAsync(async (req, res, next) => {
    const state = new State(req.body)
    await state.save();
    res.send('State Added')
}))


module.exports = router