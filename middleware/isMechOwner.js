const Merch = require('../models/Merch');

const isMerchOwner = (req, res, next) => {

    Merch.findById(req.params.id)
        .then((foundMerch) => {
            if (req.user._id === foundMerch.owner.toString()) {
                next()
            } else {
                res.status(401).json({message: "Validation Error"})
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
}

module.exports = isMerchOwner