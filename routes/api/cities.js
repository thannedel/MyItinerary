const express = require('express');
const router = express.Router();

//@route Get api/cities
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('City route'))

module.exports = router;