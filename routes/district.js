const express = require('express')
const router = express.Router();
const { isLoggedIn } = require('../middlewares')
const District = require('../models/district')
const State = require('../models/state')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

router.get('/', catchAsync(async (req, res, next) => {
    const districts = await District.find({}).populate({
        path: "state",
        select: "name"
    })
    if (!districts) {
        return next(new AppError('Data does not exist', 500))
    } else {
        res.send(districts)
    }

}))

router.post('/', catchAsync(async (req, res, next) => {

    const { state } = req.body
    const stateFound = await State.find({ "name": state })
    const district = new District(req.body)
    district.state = stateFound[0]._id
    await district.save();
    res.send('District Added')


}))


module.exports = router