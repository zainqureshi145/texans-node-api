const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {body, validationResult} = require('express-validator');
const Menu = require('../models/Menu');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');

// @route        GET    api/menu
// @desc         GET all items in the menu
// @access       Public

router.get('/', async (request, response) => {
    try {
        const menu = await Menu.find({}, function(error, result) {
            if(error){
                console.log(error);
            }
            else{
                response.json(result);
            }
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});


// @route        POST    api/menu
// @desc         Add new menu item
// @access       Private

router.post('/', [
    authenticate,
    [
        body('name', 'Name is required').not().isEmpty(),
        body('price', 'Price is required').not().isEmpty()
    ]
], 
async (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    const {name, description, price, size, spice, meat} = request.body;

    try {
        const newMenu = new Menu({
            _id: mongoose.Types.ObjectId(),
            name,
            description,
            price,
            size,
            spice,
            meat 
        });

        const menu = await newMenu.save();
        response.json(menu);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});



// @route        PUT    api/menu/:id
// @desc         Update Menu
// @access       Private

router.put('/:id',authenticate, async (request, response) => {
    const {name, description, price, size, spice, meat} = request.body;
    //Build a menu object
    const menuFileds = {};
    if(name) menuFileds.name = name;
    if(description) menuFileds.description = description;
    if(price) menuFileds.price = price;
    if(size) menuFileds.size = size;
    if(spice) menuFileds.spice = spice;
    if(meat) menuFileds.meat = meat;

    try {
        let menu = await Menu.findById(request.params.id);

        if(!menu) return response.status(404).json({msg: 'Menu item not found'});

        //Make sure only gondal can update menu
        // if(menu.user.toString() !== request.user.id){
        //     return response.status(401).json({msg: 'Not authorized'});
        // }

        menu = await Menu.findByIdAndUpdate(request.params.id,
            {$set: menuFileds},
            {new: true});

            response.json(menu);

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }

});



// @route        DELETE    api/menu/:id
// @desc         Delete menu item
// @access       Private

router.delete('/:id', authenticate, async (request, response) => {
    try {
        let menuItem = await Menu.findById(request.params.id);

        if(!menuItem) return response.status(404).json({msg: 'Menu item not found'});

        // //Make sure user owns contact
        // if(contact.user.toString() !== request.user.id){
        //     return response.status(401).json({msg: 'Not authorized'});
        // }

        await Menu.findByIdAndRemove(request.params.id);

            response.json({msg: 'Menu item removed'});

    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

module.exports = router;