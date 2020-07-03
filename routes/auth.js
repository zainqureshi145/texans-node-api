const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authenticate = require('../middleware/authenticate');
const {body, validationResult} = require('express-validator');

// Brad Traversy's way
// const { check, validationResult } = require('express-validator/check');
// It is old and deprecated

const User = require('../models/Users');

// @route        GET    api/auth
// @desc         Get logged in user
// @access       Private

router.get('/', authenticate, async (request, response) => {
    try {
        const user = await User.findById(request.user.id).select('-password');
        response.json(user);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

// @route        POST    api/auth
// @desc         Authenticate User and get token
// @access       Public

router.post('/', [
    body('email', 'Please include a valid email').isEmail(),//Fuck
    body('password', 'Password is required').exists()
], 
async (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    const {email, password} = request.body;
    try {
        let user = await User.findOne({email}); //or email just once
        if(!user) {
            return response.status(400).json({msg: 'Invalid Credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return response.status(400).json({msg: 'Invalid Credentials'});
        }
        const payload = {
            user: {
                id: user.id
            }
        }//Based on this user id stored in the db, we can access everything related to that user

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (error, token) => {
            if(error) throw error;
            response.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

module.exports = router;
