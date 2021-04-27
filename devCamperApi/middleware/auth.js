const {
    ErrorResponse
} = require("../utils/errorResponse");
const {
    asyncHandler
} = require("./async");
const jwt = require("jsonwebtoken");
const {
    USER
} = require("../models/user");
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        token=req.cookies.token
    }
    //verify if token is there
    if (!token) {
        return next(new ErrorResponse(`not authorized to access this route`, 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded);
        req.user = await USER.findById(decoded.id);
        next();
    } catch (error) {
        console.log(error);
    }
})

//Granting access to certain roles
exports.role = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`user role "${req.user.role}" is unauthorized to access this route`, 403))
        }
        next();
    }
}