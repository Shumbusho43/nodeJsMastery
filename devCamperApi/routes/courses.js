const express = require("express");
const router = express.Router({
    mergeParams: true
});
const {
    getCourses,
    createCourse,
    getCourse,
    deleteCourse,
    updateCourse
} = require("../controllers/courses");
const {
    advancedResult
} = require("../middleware/advancedQuery");
const {
    protect,
    role
} = require("../middleware/auth");
const {
    courses
} = require("../models/courses");
router.route("/")
    .get(advancedResult(courses, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, role('publisher', 'admin'), createCourse)
router.route('/:id')
    .get(getCourse)
    .delete(protect, role('publisher', 'admin'), deleteCourse)
    .put(protect, role('publisher', 'admin'), updateCourse)
module.exports.courses = router