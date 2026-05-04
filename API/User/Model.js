const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    profile: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
    },
    joining: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
})

const User = model('user', UserSchema)

module.exports = User