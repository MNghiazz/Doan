const mongoose = require('mongoose');


const orderItemSchema = mongoose.Schema({
    
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },

    status: {
        type: String,
        default: 'Pending'
    },

    dateOrdered: {
        type: Date,
        default: Date.now,
    },

})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);