const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, courseController.getCourses);
module.exports = router;