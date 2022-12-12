const mongoose = require("mongoose");

const ItemOrderProductSchema= new mongoose.Schema({
    product: {
        type:mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    qte: {
        type:Number,
        required: true, 
    },
    price: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    }
});
const schemaOrder = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    ref: {
        type: String,
    },
    priceTotal: {
        type: Number,
        required: true,
    },
    qtyTotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["en cours", "delivred" ],
        default: "en cours",
    },
    products : [ItemOrderProductSchema], // ligne de cmd
},
{timestamps: true}
);

module.exports = mongoose.model("Order", schemaOrder);