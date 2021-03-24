

const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Child = require('../models/children')
const { isLoggedIn, validateChildData, checkToken } = require('../middlewares');
const State = require('../models/state');
const District = require('../models/district')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId;


router.post('/upload', upload.single('image'), (req, res) => {
    console.log()
    res.send('Image Added')
})

router.get('/try', catchAsync(async (req, res, next) => {

    const aggregate = await District.aggregate([{ $lookup: { from: "states", localField: "state", foreignField: "_id", as: "state" } }, { $unwind: "$state" }, { $lookup: { from: "children", localField: "state._id", foreignField: "state", as: "children" } }, { $unwind: "$children" }, { $group: { _id: "$state._id", name: { $addToSet: "$state.name" }, district: { $addToSet: "$name" }, children: { $addToSet: "$children._id" } } }, { $unwind: "$name" }, { $project: { _id: 1, name: "$name", number_of_district: { $size: "$district" }, number_of_children: { $size: "$children" } } }]);
    // Child.aggregate();
    // const aggregate = await Child.aggregate.count("state");

    res.send(aggregate)

}))

router.get('/try2/:id', catchAsync(async (req, res, next) => {

    // const aggregate = await District.aggregate([{ $lookup: { from: "states", localField: "state", foreignField: "_id", as: "state" } }, { $unwind: "$state" }, { $lookup: { from: "children", localField: "state._id", foreignField: "state", as: "children" } }, { $unwind: "$children" }, { $group: { _id: "$state.name", district: { $addToSet: "$name" }, children: { $addToSet: "$children._id" } } }, { $project: { number_of_district: { $size: "$district" }, number_of_children: { $size: "$children" } } }]);
    // Child.aggregate();
    // const aggregate = await Child.aggregate.count("state");
    const { id } = req.params
    try {
        if (id) {
            const aggregate = await District.aggregate([{ $match: { "state": ObjectId(id) } }, { $lookup: { from: "children", localField: "_id", foreignField: "district", as: "children" } }, { $unwind: "$children" }, { $group: { _id: "$_id", name: { $addToSet: "$name" }, children: { $addToSet: "$children" } } }, { $unwind: "$name" }, { $project: { _id: 0, name: 1, number_of_children: { $size: "$children" } } }])
            res.send(aggregate)
        } else {

        }
    } catch (error) {
        return res.status(500).json({ message: error.message, error: error });
    }

}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const child = await Child.aggregate([{ $match: { _id: ObjectId(id) } }, { $lookup: { from: "states", localField: "state", foreignField: "_id", as: "state" } }, { $lookup: { from: "districts", localField: "district", foreignField: "_id", as: "district" } }, { $unwind: "$state" }, { $unwind: "$district" }, { $project: { name: 1, motherName: 1, fatherName: 1, "state.name": 1, "district.name": 1, dob: 1, gender: 1 } }])
    if (!child) {
        next(new AppError('Child Data does not exist in our Database', 500))
    } else {
        res.send(child)
    }

}))

router.get('/', isLoggedIn, catchAsync(async (req, res, next) => {

    const children = await Child.find({}).populate({
        path: "district",
        select: "name",
    }).populate({
        path: "state",
        select: "name",
    })
    // console.log(children)
    res.send(children);
    console.log('SUCCESS: Connected to protected route');
}))

router.post('/', upload.single('image'), catchAsync(async (req, res, next) => {
    if (!req.body.request) {
        const { state } = req.body
        const stateFound = await State.find({ "name": state })
        const { district } = req.body
        const districtFound = await District.find({ "name": district })

        const child = new Child(req.body)
        child.state = stateFound[0]._id
        child.district = districtFound[0]._id


        let exist = await Child.exists({ name: child.name, district: districtFound[0]._id })
        if (exist) {
            throw new AppError('Child with this name already exist in this District', 400)
        }
        await child.save();
        res.send({
            msg: 'Child Added without Image'
        })
    } else {
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
            msg: 'Child Added with image'
        })
    }

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