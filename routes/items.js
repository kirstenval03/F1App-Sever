var express = require('express');
var router = express.Router();

const Item = require('../models/Item');


const isAuthenticated = require('../middleware/isAuthenticated');
const isStaff = require("../middleware/isStaff");
const isProfileOwner = require('../middleware/isProfileOwner');
const isItemOwner = require("../middleware/isItemOwner");

// DISPLAY ALL ITEMS
router.get('/', (req, res, next) => {
  
    Item.find()
        .then((allItems) => {
            res.json(allItems)
        })
        .catch((err) => {
            console.error(err); 
            next(err)
        })

});

//SEE ITEM DETAILS
router.get('/item-detail/:itemId', (req, res, next) => {

    const { itemId } = req.params

    Item.findById(itemId)
        .populate({
            path: 'comments',
            populate: { path: 'author'}
        })
        .then((foundItem) => {
            res.json(foundItem)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//CREATE A NEW ITEM
router.post('/new-item', isAuthenticated, isStaff, (req, res, next) => {
    console.log("Received POST request at /new-item");

    const { owner, name, image, size, description, cost } = req.body

    Item.create(
        { 
            owner, 
            name, 
            image,  
            size, 
            description, 
            cost 
        }
        )
        .then((newItem) => {
            res.json(newItem)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//UPDATE ITEM INFO
router.post('/item-update/:itemId', isAuthenticated, isStaff, isItemOwner, (req, res, next) => {

    const { itemId } = req.params

    const { name, image, size, description, cost } = req.body

    Item.findByIdAndUpdate(
        itemId,
        {
            name, 
            image,  
            size, 
            description, 
            cost 
        },
        { new: true}
    )
        .then((updatedItem) => {
            res.json(updatedItem)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//DELETE ITEM
router.post('/delete-item/:itemId', isAuthenticated, isStaff, isItemOwner, (req, res, next) => {

    const { itemId } = req.params

    Item.findByIdAndDelete(itemId)
        .then((deletedItem) => {
            res.json(deletedItem)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})



module.exports = router;