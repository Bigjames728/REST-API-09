const express = require('express');

const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');

// GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
router.get('/', asyncHandler( async (req, res) => {
    const course = await Course.findAll({
        include: [{ model: User }]
    });
    if (course) {
        res.status(200).json(course)
    } else {
        res.status(404).json({ message: "No courses were found." })
    }
}));





module.exports = router;