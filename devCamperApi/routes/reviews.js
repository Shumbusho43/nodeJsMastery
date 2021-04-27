const express = require("express");
const router = express.Router();
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviews");
const {
    advancedResult
} = require("../middleware/advancedQuery");
const {
    reviews
} = require("../models/review");
const {
    protect,
    role
} = require("../middleware/auth");

router.route("/")
    .get(advancedResult(reviews, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
router.route("/:bootcampId")
    .post(protect, role('user', 'admin'), createReview)
router.route("/:id")
    .get(getReview)
    .put(protect, role('user', 'admin'),updateReview)
    .delete(protect, role('user', 'admin'),deleteReview)
module.exports.Reviews = router;