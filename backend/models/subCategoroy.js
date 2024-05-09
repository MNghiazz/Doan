const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        
    },
    belong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
})

subCategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
})

subCategorySchema.set('toJSON', {
    virtuals: true,
});

exports.subCategory = mongoose.model('subCategory', subCategorySchema);