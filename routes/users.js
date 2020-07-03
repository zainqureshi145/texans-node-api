const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//Brad Traversy's way 
//const { check, validationResult } = require('express-validator/check');
//It is old and deprecated

const User = require('../models/Users');


/////////////////////////////////IMPORTS/////////////////////////////////////

//@route        POST    api/users
//@desc         Register a user
//@access       Public

router.post('/', [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password length must be 5 characters or more').isLength({min: 5}),
    body('phone', 'Phone number is required').not().isEmpty(),
    body('address', 'Address is required').not().isEmpty()
], 
async (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }
    //request.body should have name, pass, and email
    //Destructuring is used to pull out information
    const {name, email, password, phone, address} = request.body;

    try {
        //Check existing user
        let user = await User.findOne({email:email});
        if(user){
            return response.status(400).json({msg: 'User already exists'});
        }
        user = new User({
            name: name,
            email: email,
            password: password,
            phone: phone,
            address: address
        });
        
        //Before inserting password into database, we need to encrypt it

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id //We will get contacts of the user by using his id => from database
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