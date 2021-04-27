const {
    asyncHandler
} = require("../middleware/async");
const {
    bootcamps
} = require("../models/bootcamp");

const {
    reviews
} = require("../models/review");
const {
    ErrorResponse
} = require("../utils/errorResponse");
//@desc get all reviews
//@routes GET /api/v1/reviews
//@routes GET /api/v1/courses/:bootcampId/reviews
//access public
exports.getReviews = asyncHandler(async (req, res, next) => {
    console.log(req.params.bootcampId);
    if (req.params.bootcampId) {
        const review = await Reviews.find({
            bootcamp: req.params.bootcampId
        }).populate({
            path: 'bootcamp',
            select: 'name description'
        })
        return res.status(200).json({
            success: true,
            count: review.length,
            data: review
        })
    } else {
        res.status(200).json(res.advancedResult)
    }
})

//@desc get review
//@routes GET /api/v1/reviews
//@routes GET /api/v1/reviews/:id
//access public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await reviews.findById(req.params.id).populate({
        path: "bootcamp",
        select: 'name description'
    })
    if (!review) {
        return next(new ErrorResponse(`review not found`, 400))
    }
    res.status(200).json({
        success: true,
        data: review
    })
})
//@desc create review
//@routes POST /api/v1/reviews
//access public
exports.createReview = asyncHandler(async (req, res, next) => {
    const bootcamp = await bootcamps.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`no such bootcamp id: ${req.params.bootcampId}`, 400));
    }
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const review = await reviews.create(req.body);
    res.status(200).json({
        success: true,
        data: review
    })
})
//@desc update review
//@routes PUT /api/v1/reviews/:id
//access private
exports.updateReview = asyncHandler(async (req, res, next) => {
    const review = await reviews.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`no such review id: ${req.params.id}`, 400));
    }
    //making sure that the logged in user is the owner of the review or is an admin
    if (review.user.toString()!==req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user in unauthorized to access this route`, 400));
    }
   const rev= await reviews.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    })
    res.status(201).json({
        success: true,
        data: rev
    })
})
//@desc delete review
//@routes DELETE /api/v1/reviews/:id
//access private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await reviews.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`no such review id: ${req.params.id}`, 400));
    }
    //making sure that the logged in user is the owner of the review or is an admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user in unauthorized to access this route`, 400));
    }
    res.status(200).json({
        success: true,
        message: 'removed'
    })
})