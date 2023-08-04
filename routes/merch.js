var express = require('express');
var router = express.Router();

const Merch = require('../models/Merch');


const isAuthenticated = require('../middleware/isAuthenticated');
const isMerchOwner = require('../middleware/isMerchOwner')

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

router.post('/new-merch', isAuthenticated, (req, res, next) => {

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

router.post('/merch-update/:merchId', isAuthenticated, isMerchOwner, (req, res, next) => {

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

router.post('/delete-merch/:merchId', isAuthenticated, isMerchOwner, (req, res, next) => {

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