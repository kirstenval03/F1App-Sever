const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const isAuthenticated = require('../middleware/isAuthenticated');
const Cart = require("../models/Cart");

router.post('/create-checkout-session/:cartId', isAuthenticated, async (req, res, next) => {
    try {
        const ourCart = req.body;
        console.log("our cart in stripe:", ourCart);
        console.log("req user:", req.user);

        const lineItems = await Promise.all(
            Object.values(ourCart).map(async (item) => {
                console.log("item:", item);
                const product = await stripe.products.create({
                    name: `${item.name}`,
                });
                console.log("Product:", product);

                const price = await stripe.prices.create({
                    unit_amount: Number(item.cost) * 100,
                    currency: 'usd',
                    product: `${product.id}`,
                });
                console.log("Price:", price);

                return { price: price.id, quantity: item.quantity };
            })
        );
        console.log("line items:", lineItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URI}/items?payment=success`,
            cancel_url: `${process.env.CLIENT_URI}/items?payment=cancel`,
        });
        console.log("Session Id:", session.id);

        // Send the session URL before attempting to delete the cart
        res.json({ url: session.url });

        // Delete the cart
        try {
            await Cart.findOneAndDelete({ owner: req.user._id });
        } catch (deleteError) {
            console.error("Error deleting cart:", deleteError);
        }
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: 'An error occurred while creating the checkout session.' });
    }
});

module.exports = router;
