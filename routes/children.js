const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Child = require('../models/children')
const { isLoggedIn, validateChildData } = require('../middlewares')

router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const child = await Child.findById(id);
    if (!child) {
        next(new AppError('Child Data does not exist in our Database', 500))
    } else {
        res.send(child)
    }

}))

router.get('/', isLoggedIn, catchAsync(async (req, res, next) => {
    const children = await Child.find({})
    if (!children) {
        return next(new AppError('Data does not exist', 500))
    } else {
        res.send(children)
    }

}))

router.post('/', isLoggedIn, validateChildData, catchAsync(async (req, res, next) => {
    const child = new Child(req.body)
    await child.save();
}))


module.exports = router;