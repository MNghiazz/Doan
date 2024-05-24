const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: { type: Number, required: true },
    story_id: { type: Number, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

exports.Comment = mongoose.model('Comment', commentSchema);
