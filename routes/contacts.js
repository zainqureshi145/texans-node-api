const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {body, validationResult} = require('express-validator');

const User = require('../models/Users');
const Contact = require('../models/Contacts');

// @route        GET    api/contacts
// @desc         GET all users contacts
// @access       Private

router.get('/', authenticate, async (request, response) => {
    try {
        const contacts = await Contact.find({user: request.user.id}).sort({date: -1});
        response.json(contacts);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

// @route        POST    api/contacts
// @desc         Add new contact
// @access       Private

router.post('/', [
    authenticate,
    [
        body('name', 'Name is required').not().isEmpty(),
    ]
], 
async (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    const {name, email, phone, type} = request.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type, 
            user: request.user.id
        });

        const contact = await newContact.save();
        response.json(contact);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

// @route        PUT    api/contacts/:id
// @desc         Update contact
// @access       Private

router.put('/:id',authenticate, async (request, response) => {
    const {name, email, phone, type} = request.body;
    //Build a contact object
    const contactFileds = {};
    if(name) contactFileds.name = name;
    if(email) contactFileds.email = email;
    if(phone) contactFileds.phone = phone;
    if(type) contactFileds.type = type;

    try {
        let contact = await Contact.findById(request.params.id);

        if(!contact) return response.status(404).json({msg: 'Contact not found'});

        //Make sure user owns contact
        if(contact.user.toString() !== request.user.id){
            return response.status(401).json({msg: 'Not authorized'});
        }

        contact = await Contact.findByIdAndUpdate(request.params.id,
            {$set: contactFileds},
            {new: true});

            response.json(contact);

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }

});

// @route        DELETE    api/contacts/:id
// @desc         Delete contact
// @access       Private

router.delete('/:id', authenticate, async (request, response) => {
    try {
        let contact = await Contact.findById(request.params.id);

        if(!contact) return response.status(404).json({msg: 'Contact not found'});

        //Make sure user owns contact
        if(contact.user.toString() !== request.user.id){
            return response.status(401).json({msg: 'Not authorized'});
        }

        await Contact.findByIdAndRemove(request.params.id);

            response.json({msg: 'Contact removed'});

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

module.exports = router;
