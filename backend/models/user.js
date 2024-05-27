const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        
    },
    email: {
        type: String,
        
    },
    passwordHash: {
        type: String,
        
    },
    phone: {
        type: String, 
        
    },
    isAdmin: {
        type: Boolean,
        default: false,
        
    },
    avatar: {
        type: String,
        default: '',
    },
    
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
