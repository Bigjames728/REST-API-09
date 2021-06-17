const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
router.get('/', asyncHandler( async (req, res) => {
    const course = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: { model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'password'] }
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
        // In the response, only return the below attributes for the course model, as well as include the User model but only the specified attributes there as well.
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: { model: User, attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'password'] }
    });
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: "No course was found." })
    }
}));

// POST route that will create a new course, set the Location header to the URL for the newly created course, and return a 201 HTTP status code and no content.
router.post('/', authenticateUser, asyncHandler (async (req, res) => {
    let course = req.body;
    try {
        await Course.create(req.body);
        res.status(201).location('/api/courses/' + course.id).end(); 
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
router.put('/:id', authenticateUser, asyncHandler( async (req, res) => {

    // The below validation isn't working for some reason.
    const course = req.body;

    const errors = [];

    // Validate title field 
    if (!course.title) {
        errors.push('Please provide a title.');
    }

    // Validate description field
    if (!course.description) {
        errors.push('Please provide a description.');
    }

    try {
        const course = await Course.findByPk(req.params.id);

        // extract the current user from request
        const { currentUser } = req; 

        // If course exists..
        if (course) {
            // And if the current user created the content, allow them to edit it. If not, a 403 forbidden is sent.
            if (currentUser.id === course.userId) {
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(403).end();
            }
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
router.delete('/:id', authenticateUser, asyncHandler( async(req, res) => {
    const course = await Course.findByPk(req.params.id);

    // extract the current user from request
    const { currentUser } = req;

    // If course exists..
    if (course) {
        // And if the current user created the content, allow them to delete it. If not, a 403 forbidden is sent.
        if (currentUser.id === course.userId) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).end();
        }
    } else {
        res.status(404).json({ message: "Couldn't delete this course at this time." });
    }
}));


module.exports = router;