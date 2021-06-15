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

// GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.
router.get('/:id', asyncHandler ( async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [{ model: User }]
    });
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: "No course was found." })
    }
}));

// POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
router.post('/', asyncHandler (async (req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).location('/');
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
    }
}));





module.exports = router;