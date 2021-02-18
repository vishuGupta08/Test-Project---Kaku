
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.send('You Must Login First')
        res.redirect('/login')
    } else {
        next();
    }

}

module.exports.validateChildData = (req, res, next) => {

    const { error } = childSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        next(new AppError(msg, 400))
    } else {
        next();
    }
}