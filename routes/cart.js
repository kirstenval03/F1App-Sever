var express = require('express');
var router = express.Router();

const Cart = require('../models/Cart');

const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/', isAuthenticated, (req, res, next) => {

    Cart.findOne({
        owner: req.user._id
    })
        .populate('items')
        .then((foundCart) => {
            if(!foundCart) {
                return res.json({message: 'Your cart is empty'})
            }
            res.json(foundCart)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/create', isAuthenticated, async (req, res, next) => {

    try {

        const { itemId, itemCost } = req.body
    
        const newCart = await Cart.create({
            owner: req.user._id,
            subtotal: itemCost, 
            total: itemCost + 10,
            items: [itemId]
        })
    
        const populated = await newCart.populate('items')

        console.log("POPULATED ====>", populated)
    
            res.json(populated)

    } catch (err) {
        
        res.json(err)
        console.log(err)
        next(err)

    }

})

router.post('/update', isAuthenticated, async (req, res, next) => {

    try {

        const { itemId, cartId, itemCost } = req.body

        const toUpdate = await Cart.findById(cartId)
    
        toUpdate.subtotal += itemCost
        toUpdate.total = toUpdate.subtotal + 10
        toUpdate.items.push(itemId)

        const newCart = await toUpdate.save()
    
        const populated = await newCart.populate('items')
    
            res.json(populated)

    } catch (err) {
        
        res.redirect(307, '/cart/create')
        console.log(err)
        next(err)
    }

})

router.post('/remove-item/:itemId', isAuthenticated, async (req, res, next) => {
    

    try {

        const cartId = req.body._id
        
        const { itemId } = req.params

        console.log("ITEMID ===>", itemId)

        const toPopulate = await Cart.findById(cartId)

        const cart = await toPopulate.populate('items')

        console.log("Cart ===>", cart)

        let item = cart.items.find((thisItem) => thisItem._id.toString() === itemId)

        console.log("Item ====>", item)
        
        let remainingItems = cart.items.filter((item) => item._id.toString() !== itemId)

        cart.items = remainingItems
        cart.subtotal -= item.cost
        cart.total = cart.subtotal + cart.shipping

        let newCart = await cart.save()

        console.log("New cart ===>", newCart)

        res.json(newCart)

    } catch (err) {

        res.json(err)
        console.log(err)
        next(err)
    }

  })

module.exports = router;