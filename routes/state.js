const express = require('express')
const router = express.Router();
const { isLoggedIn } = require('../middlewares')


router.get('/', (req, res) => {
    console.log(req.body)
    res.send('List of states')
})


router.post('/', isLoggedIn, (req, res) => {
    const { kl } = req.body
    res.send(`State added - ${kl}`)

})

module.exports = router