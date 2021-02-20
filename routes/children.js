

const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Child = require('../models/children')
const { isLoggedIn, validateChildData } = require('../middlewares');
const State = require('../models/state');
const District = require('../models/district')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })


router.post('/upload', upload.single('image'), (req, res) => {
    console.log()
    res.send('Image Added')
})

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
        return next(new AppError('Data does not exist', 204))
    } else {
        res.send(children)
    }

}))

router.post('/', upload.single('image'), catchAsync(async (req, res, next) => {
    req.body = JSON.parse(req.body.request);
    const { state } = req.body
    const stateFound = await State.find({ "name": state })
    const { district } = req.body
    const districtFound = await District.find({ "name": district })

    const child = new Child(req.body)

    child.image.url = req.file.path
    child.image.filename = req.file.filename
    child.state = stateFound[0]._id
    child.district = districtFound[0]._id


    let exist = await Child.exists({ name: child.name, district: districtFound[0]._id })
    if (exist) {
        throw new AppError('Child with this name already exist in this District', 400)
    }
    await child.save();
    res.send({
        msg: 'Child Added'
    })
}))

router.patch('/:id', catchAsync(async (req, res, next) => {
    const { state } = req.body
    const stateFound = await State.find({ "name": state })
    const { district } = req.body
    const districtFound = await District.find({ "name": district })
    req.body.state = stateFound[0]._id
    req.body.district = districtFound[0]._id

    child = await Child.findByIdAndUpdate(req.params.id, { ...req.body })

    await child.save();
    res.send('Child Updated Successfully')
}))


router.delete('/:id', catchAsync(async (req, res, next) => {
    const child = await Child.findByIdAndDelete(req.params.id);
    res.send(' Deleted Successfully')
}))



module.exports = router