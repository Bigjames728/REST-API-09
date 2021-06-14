const express = require('express');

const router = express.Router();
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');

// GET route that returns the currently authenticated user along with a 200 status code
router.get('/', asyncHandler( async (req, res) => {
    const user = req.currentUser;
    res.status(200).json(user);
}));

// Route that creates a new user.
router.post('/', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).Location('/');
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