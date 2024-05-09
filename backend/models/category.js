const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        
    }
})

categorySchema.virtual('subcategories', {
    ref: 'subCategory', // reference to the SubCategory model
    localField: '_id',
    foreignField: 'belong',
});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
})

categorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);