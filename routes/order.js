const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {body, validationResult} = require('express-validator');
const Menu = require('../models/Menu');
const User = require('../models/Users');
const Order = require('../models/Orders');

// @route        GET    api/order
// @desc         GET all Orders
// @access       Private

// router.get('/', authenticate, async (request, response) => {
//     try {
//         const order = await Order.find({}, function(error, result) {
//             if(error){
//                 console.log(error);
//             }
//             else{
//                 response.json(result);
//             }
//         });
//     } catch (error) {
//         console.error(error.message);
//         response.status(500).send('Server Error');
//     }
// });



router.get('/', authenticate, async (request, response) => {
    try {
        const order = await Order.find({user: request.user.id}).sort({date: -1});
        response.json(order);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

///////////////////////////////////Make Get Order Route For Gondal///////////////////////


router.get('/admin', async (request, response) => {
    try {
        const order = await Order.find({}, function(error, result) {
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


// @route        POST    api/order
// @desc         Add new order
// @access       Private

router.post('/', authenticate,
async (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    const {quantity, instructions, orderDate} = request.body;
    //console.log(response.body._id);
    //console.log(request.body);

    try {
        const newOrder = new Order({
            user: request.user.id,
            menu: request.body._id,//Getting this shit from menu model
            quantity,
            instructions,
            orderDate
        });

        const order = await newOrder.save();
        response.json(order);
    } catch (error) {
        console.error(error.message);
        response.status(500).send('Server Error');
    }
});

module.exports = router;