const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 10,
    },
    longUrl: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const URL = mongoose.model('URL', urlSchema)

module.exports = URL