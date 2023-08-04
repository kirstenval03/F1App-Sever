const { Schema, model } = require('mongoose');

const merchSchema = new Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        name: String, 
        image: String,
        size: String,
        description: String,
        cost: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
)

module.exports = model('Merch', merchSchema)