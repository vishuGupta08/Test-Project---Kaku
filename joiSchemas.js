const Joi = require('joi')
module.exports.childSchema = Joi.object({
    name: Joi.string()
        .required(),

    gender: Joi.string()
        .required(),

    motherName: Joi.string()
        .required(),

    fatherName: Joi.string()
        .required(),



    district: Joi.string()
        .required(),

    dob: Joi.string()
        .required(),
})

module.exports.stateSchema = Joi.object({
    name: Joi.string()
        .required()


})