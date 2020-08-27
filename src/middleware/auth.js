const User = require('../models/User')

const auth = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.session.userId })
        if (!user) {
            throw new Error('Please login...!')
        }

        req.user = user

        next()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = auth