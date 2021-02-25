const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Itinerary = require('../../models/Itinerary');
const User = require('../../models/User');
const City = require('../../models/City');

// @route    POST api/itineraries
// @desc     Create an itinerarie
// @access   Private
router.post(
  '/',
    [auth,
        [
            check('city', 'City is required').not().isEmpty(),
            check('text', 'Text is required').not().isEmpty(),
            check('activities', 'Activity is required').not().isEmpty()
        ]
    ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

      try {
        const user = await User.findById(req.user.id).select('-password');
        
      const newItinerary = new Itinerary({
          text: req.body.text,
          city: req.body.city,
          username: user.name,
          avatar: user.avatar,
          user: req.user.id,
          activities: req.body.activities
      });

      const itinerary = await newItinerary.save();

      res.json(itinerary);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


//@route Get api/itineraries
//@desc Get all itineraries by City
//@access Private
router.get('/:city',auth, async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ city: req.params.city });
        if (!itineraries) return res.status(400).json({ msg: 'Itineraries not found' });
        res.json(itineraries);
    } catch (err) {
        console.error(err.message);

         //checking if the object Id is a valid object id to avoid server error  for invalid ids
        if (err.kind == 'ObjectId') {  
           return res.status(400).json({msg:'Itineraries not found'}) 
        }
      
        res.status(500).send('Server Error ')
    }
})

// @route    DELETE api/itineraries/:id
// @desc     Delete an itinerary
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerarynot found' });
    }

    //Check User
    if (itinerary.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorised' });
    }

    await itinerary.remove();

    res.json({ msg: 'Itinerary removed' });
  } catch (err) {

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }
    
      res.status(500).send('Server Error');
  }
})

//@route PUT api/itineraries/like/:id
//@desc Like an itinerary
//@access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    //Check if the itinerary has already been liked
    //length > 0 means that there s already a like
    if (itinerary.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'itinerary already liked' });
    }

    itinerary.likes.unshift({ user: req.user.id });

    await itinerary.save();

    res.json(itinerary.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

//@route PUT api/itineraries/unlike/:id
//@desc Unlike an itinerary
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    //Check if the itinerary has already been liked
    //length = 0 means that there s already a like
    if (itinerary.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'itinerary has not yet been liked' });
    }

    //Get remove index
    const removeIndex = itinerary.likes.map(like => like.user.toString()).indexOf(req.user.id);

    itinerary.likes.splice(removeIndex, 1);

    await itinerary.save();

    res.json(itinerary.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route    POST api/itineraries/comment/:id
// @desc     Comment an itinerary
// @access   Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const itinerary = await Itinerary.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      itinerary.comments.unshift(newComment);

      await itinerary.save();

      res.json(itinerary.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/itineraries/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    //Pull out comment
    const comment = itinerary.comments.find(comment => comment.id === req.params.comment_id);

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    //Get remove index
    const removeIndex = itinerary.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

    itinerary.comments.splice(removeIndex, 1);

    await itinerary.save();
    res.json(itinerary.comments);
  } catch (err) {
console.error(err.message);
      res.status(500).send('Server Error');
    }
})

module.exports = router;