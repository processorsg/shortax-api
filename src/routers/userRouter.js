const express = require('express')
const User = require('../models/User')
const URL = require('../models/URL')
const auth = require('../middleware/auth')

const router = express.Router()

//@createUser POST
router.post('/user/create', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//@loginUser POST
router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        req.session.userId = user._id
        res.status(200).send()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//@logoutUser POST
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.session.userId = null
        res.status(200).send()
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//@readUser GET
router.get('/user/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(400).json({ message: 'problem with userId...!' })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//@updateUser PATCH
router.patch('/user/me', auth, async (req, res) => {
    const updateList = ['firstName', 'lastName', 'email', 'password']

    try {
        if (req.body.updateType === updateList.map(update => update === updateType)) {
            const user = await User.findById(req.session.userId)
            user[update] = req.body.updateValue
            res.status(200).send()
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//@deleteUser DELETE
router.delete('/user/me', auth, async (req, res) => {
    try {
        await URL.deleteMany({ user: req.user._id })
        await User.findByIdAndDelete(req.user._id)
        res.status(200).json({ message: 'User deleted...!' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router