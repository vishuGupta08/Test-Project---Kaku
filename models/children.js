const mongoose = require('mongoose')



const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    motherName: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
        // 
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    dob: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    }
})

const Child = mongoose.model('Child', childSchema)

module.exports = Child;