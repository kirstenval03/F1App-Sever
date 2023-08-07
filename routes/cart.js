var express = require('express');
var router = express.Router();

const Cart = require('../models/Cart');

const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, (req, res, next) => {
  const cartId = req.user.cart;

  Cart.findById(cartId)
    .populate('items')
    .then((foundCart) => {
      if (!foundCart) {
        return res.json({ message: 'Your cart is empty' });
      }
      res.json(foundCart);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post('/create', isAuthenticated, (req, res, next) => {
  const { itemId, total } = req.body;
  const today = new Date();
  let expiry = today.setDate(today.getDate() + 1);

  Cart.create({
    owner: req.user._id,
    total,
    timeLeft: expiry,
    item: [itemId], 
  })
    .then((createdCart) => {
      res.json(createdCart);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post('/update', isAuthenticated, (req, res, next) => {
  const { itemId, total } = req.body;
  const cartId = req.user.cart;

  Cart.findByIdAndUpdate(
    cartId,
    {
      total,
      $addToSet: { items: itemId }, 
    },
    { new: true }
  )
    .populate('items')
    .then((updatedCart) => {
      res.json(updatedCart);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

//DELETE ITEM FROM THE CART
router.post('/remove-item/:itemId', isAuthenticated, (req, res, next) => {
  const cartId = req.user.cart;
  const { itemId } = req.params;

  Cart.findByIdAndUpdate(
    cartId,
    {
      $pull: { items: itemId },
    },
    { new: true }
  )
    .populate('items')
    .then((updatedCart) => {
      if (!updatedCart) {
        return res.json({ message: 'Item not found in the cart' });
      }
      res.json(updatedCart);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
