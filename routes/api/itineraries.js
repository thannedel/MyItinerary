const express = require('express');
const router = express.Router();

//@route Get api/itineraries
//@desc test route
//@access Public
router.get('/', (req, res) => res.send('itineraries route'))

module.exports = router;