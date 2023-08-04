const { Schema, model } = require('mongoose');

const cartSchema = new Schema(
    {
        merch: [{type: Schema.Types.ObjectId, ref: 'Merch'}],
        subtotal: {
            type: Number,
            default: 0
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