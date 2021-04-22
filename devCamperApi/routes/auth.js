const express = require('express');
const {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth');
const {
    protect
} = require('../middleware/auth');
const router = express.Router();
router.route('/register')
    .post(registerUser)
router.route('/login')
    .post(loginUser)
router.route("/me")
    .get(protect, getMe);
router.route('/forgotPassword')
    .post(forgotPassword)
router.route("/resetPassword/:resetToken")
    .put(resetPassword)
router.route("/updateDetails")
    .put(protect, updateDetails)
router.route("/updatePassword")
    .put(protect, updatePassword)
module.exports.userAuth = router