const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
        select: false,
        min:[5,'password must be greater than 5 characters']
    },
    role: {
        type: String,
        enum: ['user', 'publisher','admin'],
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
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})
//match password
userShema.methods.passwordMatch = async function (enteredPass) {
    return await bcrypt.compare(enteredPass, this.password)
}
//generate and hash passwordToken
userShema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hashing token and set it to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //string token expiration time
    this.resetPasswordExpires = Date.now() + 10*60*1000;
    return resetToken;
}
module.exports.USER = mongoose.model("User", userShema);