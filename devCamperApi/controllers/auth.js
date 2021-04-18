const {
    asyncHandler
} = require("../middleware/async");
const {
    USER
} = require("../models/user");
const { ErrorResponse } = require("../utils/errorResponse");
const { ONE_DAY } = require("../utils/imports");

//@desc create a new user
//@routes POST /api/v1/register
//access public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body
    const user = await USER.create({
        name,
        email,
        password,
        role
    })

    // creating token
    sendTokenResponse(user, 200, res)
})

//@desc login user
//@routes POST /api/v1/login
//access public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    //validating email
    if (!email || !password) {
        return next(new ErrorResponse(`email or password is required`,400))
    }

    //finding if user exists
    const user = await USER.findOne({
        email
    }).select('+password'); 
    if (!user) {
        return next(new ErrorResponse(`invalid email or password`,400));
    }
    const isMatch = await user.passwordMatch(password)
    if (!isMatch) {
        return next(new ErrorResponse(`invalid email or password`,400))
    }
   sendTokenResponse(user,200,res)
})

//getting token from model, creating cookie and sending response

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    const options = {
        expires: new Date(Date.now() + ONE_DAY),
        httpOnly: true,
    }; 
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token: token
    })
}

//@desc getting logged in user
//@routes POST /api/v1/me
//access private

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await USER.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
})
