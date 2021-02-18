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

    state: Joi.string()
        .required(),

    district: Joi.string()
        .required(),

    dob: Joi.string()
        .required(),
})

module.exports.surveyorSchema = Joi.object({
    email: Joi.string()
        .required(),
    password: Joi.string()
        .required()
})