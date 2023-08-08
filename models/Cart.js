const { Schema, model } = require('mongoose');

const cartSchema = new Schema(
    {
        items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
        subtotal: {
            type: Number,
            default: 0
        },
        shipping: {
            type:Number,
            default: 10
        },

        total: {
            type: Number,
            default: 0
        },
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        // timeLeft: Date
    },
   
)

module.exports = model('Cart', cartSchema)