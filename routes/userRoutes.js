const express = require('express');

const router = express.Router();
const User = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');

router.get('/api/users', asyncHandler( async (req, res) => {

}));





module.exports = router;