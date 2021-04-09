const express = require("express");
const router = express.Router();
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampWithInRadius
} = require("../controllers/bootcamps")

//include other resourse routers
const { courses } = require("./courses")

//re-route into other resourse routers
router.use('/:bootcampId/courses', courses)

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp)
router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp)
router.route("/radius/:zipcode/:distance")
.get(getBootcampWithInRadius)
module.exports.bootcamps = router