const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        
    },
    image: {
        type: String,
        default: '',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        
    }],
    countInStock: {
        type: Number,
        
        min: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);