const { Schema, model } = require('mongoose');

const itemSchema = new Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        name: String, 
        image: String,
        size: String,
        description: String,
        cost: {
            type: Number,
        },
    },
    {
        timestamps: true
    }
)

module.exports = model('Item', itemSchema)