const express = require('express')
const router = express.Router();
const { isLoggedIn } = require('../middlewares')

router.get('/', (req, res) => {
    res.send('List of all Districts')
})

router.post('/', isLoggedIn, (req, res) => {
    console.log(req.body)
    res.send('Posting a District')
})

module.exports = router