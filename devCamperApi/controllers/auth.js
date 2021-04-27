const {
    asyncHandler
} = require("../middleware/async");
const {
    USER
} = require("../models/user");
const {
    ErrorResponse
} = require("../utils/errorResponse");
const {
    ONE_DAY
} = require("../utils/imports");
const {
    sendEmail
} = require("../utils/sendEmail");
const crypto = require("crypto");
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
    const {
        email,
        password
    } = req.body

    //validating email
    if (!email || !password) {
        return next(new ErrorResponse(`email and password are required`, 400))
    }

    //finding if user exists
    const user = await USER.findOne({
        email
    }).select('+password');
    if (!user) {
        return next(new ErrorResponse(`invalid email or password`, 400));
    }
    const isMatch = await user.passwordMatch(password)
    if (!isMatch) {
        return next(new ErrorResponse(`invalid email or password`, 400))
    }
    sendTokenResponse(user, 200, res)
})

//@desc logOut user and clear cookie
//@routes GET /api/v1/loginOut
//access private
exports.logOut = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000)
    });
    res.status(200).json({
        success: true,
        message: 'logged out'
    })
})

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

//@desc forgotPassword
//@routes POST /api/v1/forgotPassword
//access public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await USER.findOne({
        email: req.body.email
    });
    if (!user) {
        return next(new ErrorResponse(`no user with email: ${req.body.email}`, 404));
    }
    //getting reset password token
    const resetPasswordToken = user.getResetPasswordToken();
    await user.save({
        validateBeforeSave: false
    });
    //generate  reset passworfd url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetPasswordToken}`;
    const message = `You are receiving this email because you or some one else requested to reset password. Please make a PUT request to : \n\n ${resetUrl}`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })
        res.status(200).json({
            success: true,
            data: `message sent`
        })
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({
            validateBeforeSave: false
        })
        return next(new ErrorResponse(`message not sent`))
    }

})

//@desc reset password
//@routes PUT /api/v1/resetPassword/:resetToken
//access private

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await USER.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    });
    if (!user) {
        return next(new ErrorResponse(`invalid token`))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
})

//@desc updating user details
//route PUT /api/v1/updadateDetails
//access private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await USER.findByIdAndUpdate(
        req.user.id,
        fieldsToUpdate, {
            new: true,
            runValidators: true
        })
    if (!user) {
        return next(new ErrorResponse(`user with id: ${req.params.id} not found`, 404))
    }
    if (!fieldsToUpdate.name || !fieldsToUpdate.email) {
        return next(new ErrorResponse(`noting to update`))
    }
    res.status(200).json({
        success: true,
        data: user
    })
})
//@desc updating password
//route PUT /api/v1/updadatePassword
//access private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await USER.findById(req.user.id).select('+password');
    if (!user) {
        return next(new ErrorResponse(`user with id: ${req.params.id} not found`, 404))
    }
    //checking if current password is true
    if (!(await user.passwordMatch(req.body.currentPassword))) {
        return next(new ErrorResponse(`incorrect password`, 401))
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
})
//helper

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