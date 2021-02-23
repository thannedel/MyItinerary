const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const City = require('../../models/City');
//const User = require('../../models/User');

//@route Post api/profile
//@desc Create or update user profile
//@access Private
router.post('/',
    [
    auth,
    [
      check('name', 'name is required').not().isEmpty(),
        check('country', 'Country is required').not().isEmpty(),
       check('description', 'description is required').not().isEmpty(),
        check('img', 'Image is required').not().isEmpty()
    ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            country,
            description,
            img
        } = req.body;
        
        //Build city object
        const profileFields = {};
        if (name) profileFields.name = name;
        if (country) profileFields.country = country;
        if (description) profileFields.description = description;
        if (img) profileFields.img = img;
        

        

        try {
            let city = await City.findOne({ name: req.name });
            if (city) {
                //Update
                city = await City.findOneAndUpdate(
                    { name: req.name },
                    { $set: profileFields },
                    { new: true });
                
                return res.json(city);
            }

            //Create
            city = new City(profileFields);

            await city.save();
            res.json(city);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
       }
})




//@route Get api/cities
//@desc Get Cities
//@access Public
router.get('/', async (req, res) => {
    try {
        const city = await City.find();
        res.json(city);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error ')
    }
})

module.exports = router;