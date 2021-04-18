const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
    ONE_DAY
} = require("../utils/imports");
const bcrypt = require("bcryptjs")
const userShema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 30,
        required: [true, 'plz enter your name']
    },
    email: {
        type: String,
        required: [true, 'plz provide email'],
        max: 50,
        match: [
            /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/,
            "please enter a valid email address",
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'plz provide password'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
//generating token
userShema.methods.generateAuthToken = function () {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: ONE_DAY
    })
}
//encrpting password
userShema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})
//match password
userShema.methods.passwordMatch = async function (enteredPass) {
    return await bcrypt.compare(enteredPass,this.password)
}
module.exports.USER = mongoose.model("User", userShema);