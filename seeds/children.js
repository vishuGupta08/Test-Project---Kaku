const mongoose = require('mongoose')
const Child = require('../models/children')
mongoose.connect('mongodb://localhost:27017/childSurvey', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose Connected to Mongo')
    })
    .catch((err) => {
        console.log('Connection Error')
        console.log(err)
    })



const seedChildren = [
    {
        name: "Ashu Gupta",
        gender: "Male",
        motherName: "Sushma",
        fatherName: "Vinod",
        state: "Delhi",
        district: "North East Delhi",
        dob: "15/10/1998",
    },
    {
        name: "Dhruva Gupta",
        gender: "Male",
        motherName: "Mamta",
        fatherName: "Munish",
        state: "Delhi",
        district: "North West Delhi",
        dob: "24/12/2002",
    },
    {
        name: "Hitin Gupta",
        gender: "Male",
        motherName: "Mamta",
        fatherName: "Munish",
        state: "Delhi",
        district: "North East Delhi",
        dob: "18/03/2006",
    },
]

Child.insertMany(seedChildren)
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })