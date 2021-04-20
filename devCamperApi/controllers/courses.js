const {
    asyncHandler
} = require("../middleware/async");
const {
    bootcamps
} = require("../models/bootcamp");
const {
    courses
} = require("../models/courses");
const {
    ErrorResponse
} = require("../utils/errorResponse");

//@desc get all courses
//@routes GET /api/v1/courses
//@routes GET /api/v1/courses/:bootcampId/courses
//@desc get all courses
//access public

exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const Courses = await courses.find({
            bootcamp: req.params.bootcampId
        })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: Courses
        })
    } else {
        res.status(200).json(res.advancedResult)
    }
    const Allcourses = await query;
    res.status(200).send({
        success: true,
        count: Allcourses.length,
        data: Allcourses
    })
})

//@desc get a courses
//@routes GET /api/v1/courses/:courseId
//access public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await courses.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!course) {
        return next(new ErrorResponse(`no course with id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: course
    })
})

//@desc add a new course
//@routes POST /api/v1/bootcamp/:bootcampId/courses
//access private

exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await bootcamps.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`no bootcamp with id: ${req.params.bootcampId}`))
    }
    if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with this id: ${req.user.id} is not authorized to create a course in this bootcamp ${bootcamp._id}`, 400))
    }

    const course = await courses.create(req.body)
    res.status(201).send({
        success: true,
        message: 'course added',
        data: course
    })
})

//@desc delete a courses
//@routes Delete /api/v1/courses/:courseId
//access private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let course = await courses.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`no course with id: ${req.params.id}`))
    }
    if (req.user.id !== course.user.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with this id: ${req.user.id} is not authorized to delete a course`, 400))
    }
    course = await courses.remove()
    res.status(200).json({
        success: true,
        message: 'deleted'
    })
})

//@desc updating a courses
//@routes Delete /api/v1/courses/:courseId
//access private

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await courses.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`no course with id: ${req.params.id}`))
    }
    if (req.user.id !== course.user.toString() && req.user.role !== 'admin') {
        return next(new ErrorResponse(`user with this id: ${req.user.id} is not authorized to update a course`, 400))
    }
    course = await courses.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: 'updated',
        data: course
    })
})