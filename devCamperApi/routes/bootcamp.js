const express = require("express");
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampWithInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps");

//calling middleware
const {
    advancedResult
} = require("../middleware/advancedQuery");
const {
    protect,
    role
} = require("../middleware/auth");
const {
    bootcamps
} = require("../models/bootcamp");

//include other resourse routers
const {
    courses
} = require("./courses");
const {
    Reviews
} = require("./reviews");

//re-route into other resourse routers
router.use('/:bootcampId/courses', courses)
router.use('/reviews', Reviews)

router.route("/")
    .get(advancedResult(bootcamps, 'courses'), getBootcamps)
    .post(protect, role('publisher', 'admin'), createBootcamp)
router.route("/:id")
    .get(getBootcamp)
    .put(protect, role('publisher', 'admin'), updateBootcamp)
    .delete(protect, role('publisher', 'admin'), deleteBootcamp)
router.route('/:id/photo')
    .put(protect, role('publisher', 'admin'), bootcampPhotoUpload)
router.route("/radius/:zipcode/:distance")
    .get(getBootcampWithInRadius)
module.exports.bootcamps = router