const { childSchema, stateSchema } = require('./joiSchemas')
const AppError = require('./utils/AppError')
const jwt = require('jsonwebtoken');
// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         res.send('You Must Login First')
//         res.redirect('/login')
//     } else {
//         next();
//     }

// }

module.exports.validateChildData = (req, res, next) => {

    const { error } = childSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new AppError(msg, 400))
    } else {
        next();
    }
}

module.exports.validateStateData = (req, res, next) => {

    const { error } = stateSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new AppError(msg, 400))
    } else {
        next();
    }
}



module.exports.isLoggedIn = (req, res, next) => {
    jwt.verify(req.headers.token, 'privatekey', (err) => {
        if (err) {
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);

        } else {
            //If token is successfully verified, we can send the autorized data 
            next();

        }
    })
}