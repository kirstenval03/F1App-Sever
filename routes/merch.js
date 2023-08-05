var express = require('express');
var router = express.Router();

const Merch = require('../models/Merch');


const isAuthenticated = require('../middleware/isAuthenticated');
const isStaff = require("../middleware/isStaff");
const isProfileOwner = require('../middleware/isProfileOwner');
const isMerchOwner = require("../middleware/isMerchOwner");

// DISPLAY ALL MERCH
router.get('/', (req, res, next) => {
  
    Merch.find()
        .then((allMerch) => {
            res.json(allMerch)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

//SEE ITEM INFO
router.get('/merch-detail/:merchId', (req, res, next) => {

    const { merchId } = req.params

    Merch.findById(merchId)
        .populate({
            path: 'comments',
            populate: { path: 'author'}
        })
        .then((foundMerch) => {
            res.json(foundMerch)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//CREATE A NEW ITEM
router.post('/new-merch', isAuthenticated, isStaff, (req, res, next) => {

    const { owner, name, image, size, description, cost } = req.body

    Merch.create(
        { 
            owner, 
            name, 
            image,  
            size, 
            description, 
            cost 
        }
        )
        .then((newMerch) => {
            res.json(newMerch)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//UPDATE ITEM INFO
router.post('/merch-update/:merchId', isAuthenticated, isStaff, isMerchOwner, (req, res, next) => {

    const { merchId } = req.params

    const { name, image, size, description, cost } = req.body

    Merch.findByIdAndUpdate(
        merchId,
        {
            name, 
            image,  
            size, 
            description, 
            cost 
        },
        { new: true}
    )
        .then((updatedMerch) => {
            res.json(updatedMerch)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

//DELETE ITEM
router.post('/delete-merch/:merchId', isAuthenticated, isStaff, isMerchOwner, (req, res, next) => {

    const { merchId } = req.params

    Merch.findByIdAndDelete(merchId)
        .then((deletedMerch) => {
            res.json(deletedMerch)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})



module.exports = router;