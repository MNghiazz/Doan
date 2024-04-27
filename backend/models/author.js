const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
    name: {
        type: String
    }
})

authorSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

authorSchema.set('toJSON', {
    virtuals: true,
});

exports.Author = mongoose.model('Author', authorSchema);