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

// GET route that will return a specific course along with the User that owns that course and a 200 HTTP status code.
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
        res.status(201).location('/api/courses/' + id).end(); // I think I need some work here. I think I need to add the id to the end of this url when the course is created.
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
    }
}));

// PUT route that will update the corresponding course and return a 204 status code and no content.
router.put('/:id', asyncHandler( async (req, res) => {
    const course = req.body;

    const errors = [];

    // Validate title field 
    if (!course.title) {
        errors.push('Please provide a title.')
    }

    // Validate description field
    if (!course.description) {
        error.push('Please provide a description.')
    }

    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
        await course.update(req.body);
        res.status(204).end();
        } else {
        res.status(404).json({ message: "We weren't able to update this course at this time." });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    } 
}));

// DELETE route that will delete a specific course and return a 204 HTTP status code and no content.
router.delete('/:id', asyncHandler( async(req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ message: "Couldn't delete this course at this time." });
    }
}));


module.exports = router;