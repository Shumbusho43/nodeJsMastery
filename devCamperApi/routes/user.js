const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/user');
const { advancedResult } = require('../middleware/advancedQuery');
const {
    protect,
    role
} = require('../middleware/auth');
const { USER } = require('../models/user');
const router = express.Router();
router.use(protect)
router.use(role('admin'))
router.route('/')
    .get(advancedResult(USER),getUsers)
    .post(createUser)
    router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)
module.exports.adminRoutes = router;