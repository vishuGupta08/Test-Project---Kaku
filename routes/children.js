const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Child = require('../models/children')
const { isLoggedIn, validateChildData } = require('../middlewares');
const State = require('../models/state');
const District = require('../models/district')

router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const child = await Child.findById(id);
    if (!child) {
        next(new AppError('Child Data does not exist in our Database', 500))
    } else {
        res.send(child)
    }

}))

router.get('/', catchAsync(async (req, res, next) => {
    const children = await Child.find({})
    if (!children) {
        return next(new AppError('Data does not exist', 500))
    } else {
        res.send(children)
    }

}))

router.post('/', catchAsync(async (req, res, next) => {

    const { state } = req.body
    const stateFound = await State.find({ "name": state })
    const { district } = req.body
    const districtFound = await District.find({ "name": district })
    console.log(districtFound)
    const child = new Child(req.body)
    child.state = stateFound[0]._id
    child.district = districtFound[0]._id
    console.log(child)
    await child.save();
    res.send('Child Added')
    console.log(child)

}))


module.exports = router