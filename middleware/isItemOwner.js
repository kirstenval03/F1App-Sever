const Item = require('../models/Item');


const isItemOwner = (req, res, next) => {
    const { itemId } = req.params;

    Item.findById(itemId)
        .then((foundItem) => {
            console.log("req.user:", req.user);
            console.log("foundItem:", foundItem);

            if (foundItem.owner._id.toString() === req.user._id.toString()) {
                next();
            } else {
                res.status(403).json({ message: "Access denied. You are not the owner of this item." });
            }
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

module.exports = isItemOwner;
