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
    advancedResult
} = ("../middleware/advancedQuery")
//@desc getting all users
//@route GET /api/v1/auth/users
//access private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await USER.find();
    if (!users) {
        return next(new ErrorResponse(`no users in the database`, 200));
    }
    res.status(200).json(
        res.advancedResult);
})
//@desc getting user
//@route GET /api/v1/auth/users:id
//access private/admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const users = await USER.findById(req.params.id);
    if (!users) {
        return next(new ErrorResponse(`user not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: users
    })
})
//@desc getting create user
//@route POST /api/v1/auth
//access private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const {name,email,role,password}=req.body
    const user = await USER.create({name,email,password,role});
    const token=user.generateAuthToken()
    res.status(200).json({
        success: true,
        data: token
    })
})
//@desc getting update user
//@route PUT /api/v1/auth/:id
//access private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await USER.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators:true
    });
    if (!user) {
        return next(new ErrorResponse(`user not found`, 404));
    }
    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc getting delete user
//@route PUT /api/v1/auth/:id
//access private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await USER.findByIdAndDelete(req.params.id ,req.body);
    if (!user) {
        return next(new ErrorResponse(`user not found`, 404));
    }
    res.status(200).json({
        success: true,
        message:'user deleted successfully'
    })
})