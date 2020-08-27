const express = require('express')
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const auth = require('../middleware/auth')
const URL = require('../models/URL')

const router = express.Router()

//creating shortURL and storing in DB
router.post('/url', auth, async (req, res) => {
    try {
        let { slug, longUrl } = req.body
        if (!slug) {
            slug = nanoid(6)
        }
        if (!validUrl.isUri(longUrl)) {
            throw new Error('Please provide valid url for shortning...!')
        }
        const url = new URL({ slug, longUrl, user: req.user._id })
        await url.save()
        res.status(201).json({ shortURL: process.env.BASE_URL + slug, longUrl })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//listing url
router.get('/url/:id', auth, async (req, res) => {
    try {
        const url = await URL.findOne({ _id: req.params.id, user: req.user._id })
        if (!url) {
            throw new Error('No url found...!')
        }
        res.status(200).json({ shortURL: process.env.BASE_URL + url.slug, longUrl: url.longUrl })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

//listing urls
router.get('/url', auth, async (req, res) => {
    try {
        const urls = await URL.find({ user: req.user._id })
        res.status(200).send(urls)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//deleting url record
router.delete('/url/:id', auth, async (req, res) => {
    try {
        const url = await URL.findOneAndRemove({ _id: req.params.id, user: req.user._id })
        if (!url) {
            throw new Error('No url found...!')
        }
        res.status(200).send()
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

module.exports = router