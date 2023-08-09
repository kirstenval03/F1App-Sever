var express = require('express');
var router = express.Router();

const Cart = require('../models/Cart');

const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/', isAuthenticated, (req, res, next) => {
    
 //FIND CART   

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

 //CREATE CART

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

//UPDATE CART

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

//REMOVE AN ITEM

router.post("/remove-item/:itemId", isAuthenticated, (req, res, next) => {
    const { itemId } = req.params;  
    const cartId = Object.keys(req.body)[0]
  
    console.log("Cart ID:", cartId);
    console.log("Req body:", req.body);
  
    Cart.findByIdAndUpdate(
      cartId,
      {
        $pull: { items: itemId },
      },
      { new: true }
    )
      .populate("items")
      .then((updatedCart) => {
        console.log("updatedCart:", updatedCart)
        if(!updatedCart.items.length){
          Cart.findByIdAndDelete(cartId)
          .then((deletedCart) => {
              if (deletedCart) {
                console.log("Deleted cart ===>",deletedCart)
                  res.json(deletedCart);
              } else {
                  res.status(404).json({ message: 'Item not found' });
              }
          })
          .catch((err) => {
              console.log(err);
              next(err);
          });
        }
        res.json(updatedCart);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });

  //INCREASE THE QUANTITY

  router.post("/increase-item/:itemId", isAuthenticated, async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const cartId = Object.keys(req.body)[0];
  
      const thisCart = await Cart.findById(cartId).populate("items");
      const itemsArray = thisCart.items;
  
      const thisItem = itemsArray.find((element) => element._id.toString() === itemId);
  
      if (thisItem) {
        thisItem.quantity++; // Increment the quantity
  
        // Find the index of the item in itemsArray
        const itemIndex = itemsArray.findIndex((item) => item._id.toString() === itemId);
  
        if (itemIndex !== -1) {
          itemsArray[itemIndex] = thisItem; // Update the item in the array
        }
  
        thisCart.subtotal += thisItem.cost; // Update the subtotal based on the increased quantity
        thisCart.total = Math.floor(thisCart.subtotal + 10);
  
        // Save the changes
        const updatedCart = await thisCart.save();
  
        res.json(updatedCart); // Return the updated cart
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      console.log(err);
      res.json(err);
      next(err);
    }
  });
  

  //DECREASE THE QUANTITY OF ONE ITEM

  router.post("/decrease-item/:itemId", isAuthenticated, async (req, res, next) => {

    try {
  
        const { itemId } = req.params;
        const cartId = Object.keys(req.body)[0]
  
        const thisCart = await Cart.findById(cartId)
        const populated = await thisCart.populate("items")
  
        const itemsArray = populated.items
  
        const thisIndex =  itemsArray.findIndex((element) => element._id.toString() === itemId)
        const thisItem = itemsArray.find((element) => element._id.toString() === itemId)
        console.log("This index ===>",thisIndex)
        console.log("This item ===>",thisItem)
  
        itemsArray.splice(thisIndex, 1)
  
        populated.subtotal -= thisItem.cost
        populated.total = Math.floor(populated.subtotal + 10)
        populated.items = itemsArray
  
  
        const newCart = await populated.save()
  
        console.log("New cart ====>", newCart)
  
        if(!newCart.items.length){
          Cart.findByIdAndDelete(cartId)
          .then((deletedCart) => {
              if (deletedCart) {
                console.log("Deleted cart ===>",deletedCart)
                  res.json(deletedCart);
              } else {
                  res.status(404).json({ message: 'Item not found' });
              }
          })
          .catch((err) => {
              console.log(err);
              next(err);
          });
        }
  
        res.json(newCart)
  
  
    } catch (err) {
        console.log(err)
        res.json(err)
        next(err)
    }})

module.exports = router;